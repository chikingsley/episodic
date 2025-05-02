# Decision Checklist - V1 Planning

**Status:** `PLANNING` (Switch to `PRODUCTION` when decisions locked for V1 build)

## A. Database Choice

- [x] Confirm final database choice (**[Decision V1: Supabase/Postgres due to relational needs & familiarity. Note: Will require research/testing if V1 prototyping reveals significant need for Convex-like real-time features that outweigh learning curve.]**)
- [x] Is the planned V1 feature set (core loop, basic personalization, narrative state) adequately served by Postgres alone, or is there a V1 feature anticipating DynamoDB-like scale/access patterns? (**[Decision V1: Yes, Postgres is sufficient. V1 features don't require DynamoDB's specific scale/latency; real-time elements depend on client/inference speed or Supabase Realtime; V1 personalization is simpler than Birdbrain.]**)
- [x] Define DB migration & branching workflow (**[Decision V1: Use Prisma Migrate. Local dev uses `prisma db push`; feature branches create SQL via `prisma migrate dev --name <desc>`. GitHub Actions applies migrations to a staging Supabase project, then promotes to prod via Supabase CLI after tests pass.]**)
- [x] Confirm Row-Level Security (RLS) policy approach (**[Decision V1: Enable RLS on all per-user tables (`users`, `mission_sessions`, `user_exercise_events`, etc.). Provide `select`/`insert`/`update` policies constrained by `auth.uid()`. Lookup tables (`missions`, `vocab`, `exercises`) remain `PUBLIC READ` for performance. Policies generated in migrations.]**)

## B. Content & Narrative Workflow

- [x] Define content management process (**[Decision V1: Use Twine for designing/writing/structuring branching narrative, exporting its data (e.g., JSON) for runtime use. Use Payload CMS for managing other structured data (Vocab, Exercises, Mission Metadata). Connect via tags in Twine passages interpreted by application code. Note: Requires minimal V1 authoring tools like CSV uploader, potentially audio chunk marker.]**)
- [x] Define scope of unique content for player paths (**[Decision V1: Focus *only* on one path (The Network / Duc). Syndicate path with fundamentally different content is post-V1 scope.]**)
- [x] Define complexity and data representation for narrative branching (failure paths, optional ops). (**[Decision V1: Target Moderate Branching. Choices within missions impact outcomes/paths within that mission; include some optional objectives; success/failure state of a mission impacts subsequent V1 mission starts/options. Specific logic deferred to Twine narrative design.]**)
- [x] Plan for voice acting (**[Decision V1: TTS. Need to select provider/model.]**)
- [x] How will recurring audio segments (if any, e.g., UI sounds, common feedback) be identified/managed for consistency? (**[Decision V1: Plan for consistency. Identify recurring short audio, generate TTS once, review/select canonical version, store (e.g., Supabase Storage), and reference file ID/hash. Defer on-the-fly TTS for these specific clips. Requires asset management & likely Audio Chunk Marker tool.]**)
- [x] If considering AI content gen later, what structured format (beyond plain text) would guide it effectively? (**[Decision V1: Yes, defining V1 content using structured JSON (dialogue steps, speakers, linked vocab/exercises from Twine/Payload) is the right preparation. This structured data will serve as constrained input for future AI generation, aligning with Duolingo's successful DuoRadio approach.]**)
- [x] Define minimum content scope for V1 launch (**[Decision V1: Need fully authored content for the first ~5-10 missions (including branching paths designed in Twine), encompassing Language, Section/Unit/Lesson structure, V1 Exercise Templates, all required Vocab Items/Concepts, and associated Media Assets (TTS audio files).]**)
- [x] Select concrete TTS provider/model & pricing tier (**[Decision V1: Start with Rime TTS via Pipecat; evaluate ElevenLabs as higher-quality backup. Pipecat abstraction lets us swap providers without code change.]**)
- [x] Define Twine export schema conventions & automated validator (**[Decision V1: Use Zod schema in repo; GitHub Action `pnpm validate:twine` parses exported JSON, checks tag naming rules & link targets.]**)
- [x] Plan content QA pipeline (**[Decision V1: CI pipeline with three stages – (1) schema validator, (2) asset link checker against Supabase Storage manifest, (3) automated playthrough linter ensuring all paths terminate with `tag:end`.]**)

## C. Technical Implementation Details

- [x] Design API / backend functions for core loop (**[Decision V1 Backend Tech: Bun or Rust + tRPC. Evaluate based on team skill/preference & V1 perf needs.]**)
  - [x] Define spec for `getInitialAppState(userId)` endpoint/function (**[Decision V1 Detailed Spec below]**)
    - **Purpose:** Provide everything the mobile client needs to render the **Home / Map** screen immediately after login, with *no* mission selected yet.
    - **Inputs (tRPC args):**

      ```ts
      { userId: string }   // Clerk UID
      ```

    - **Response (TypeScript interface):**

      ```ts
      type InitialAppState = {
        userMeta: {
          displayName: string;
          avatarUrl: string;              // signed URL (Supabase Storage)
          locale: string;                 // e.g. "fr-FR"
        };

        progress: {
          currentMissionId: string | null;
          unlockedMissionIds: string[];   // highlight on map
          clearanceLevel: number;         // "Section" index
          xpTotal: number;
          coverIntegrity: number;         // 0-100
          gemBalance: number;
          streak: {
            current: number;              // days
            longest: number;
          };
        };

        boosts: {
          streakFreezeActive: boolean;
          doubleXPRemaining: number;      // minutes, 0 if none
        };

        notifications: {
          unreadCount: number;
        };

        featureFlags: Record<string, boolean>; // A/B toggles

        preloadAssets: string[];               // signed URLs for hero images, map BG, etc.
      };
      ```

    - **Behavior Notes:**
      • Server queries aggregate tables/views to populate `progress` quickly (use `JOIN LATERAL` to avoid N+1).  
      • Feature flags drawn from `user_experiments` table so we can bucket users.  
      • Signed URLs expire in 6 h; client must re-fetch via cached endpoint after.
    - **Implementation Stack:** Bun runtime + tRPC router + Prisma ORM talking to Supabase Postgres.  
      • Auth handled via Clerk JWT→middleware.  
      • Endpoint lives in `api/appState.get` and deploys as Vercel Edge Function.

    - **Status:** SPEC LOCKED ✅

    - **Related Decisions (recorded here so they don't get lost):**
      - **Twine JSON Transfer Strategy:** *Chunk by passage groups* (~20-30 passages ≈100-200 KB). First chunk included in `startMission`; further chunks streamed via `submitAnswer` response. Ignores very old/low-RAM phones for V1.
      - **Distractor Shuffling:** *Pre-compute on server* during `startMission` so every client sees the same ordering and mobile bundle stays lighter.
      - **Backend Access Pattern:** Client never sends raw SQL. All data flows through Bun + tRPC API; Prisma (or Drizzle) handles queries server-side. Supabase JS SDK used only for Storage signed-URL generation.
  - [x] Define spec for `startMission(userId, missionId)` endpoint/function (**[Decision V1 Spec below]**)
    - **Purpose:** Initiate a new "Mission Session" (play-through instance) for a user, pre-loading all data the client needs to render the opening screen & first dialogue prompt.
    - **Inputs (tRPC args):**

      ```ts
      {
        userId: string;        // Clerk UID
        missionId: string;     // Primary-key from `missions` table
        resumeSessionId?: string; // Optional: resume an existing in-progress session
      }
      ```

    - **Validation / Preconditions:**
      1. Verify `userId` exists & is authenticated.
      2. Ensure `missionId` is unlocked for the user (based on previous completions, coverIntegrity ≥ required, etc.).
      3. If `resumeSessionId` provided, make sure it belongs to `(userId, missionId)` & is not already `completed`.
    - **DB Writes (if new session):** Insert row into `mission_sessions` table:

      ```sql
      id            UUID  PK
      user_id       FK → users.id
      mission_id    FK → missions.id
      start_time    timestamptz DEFAULT now()
      state_json    jsonb   -- hydrated Twine variable store (initial)
      current_node  text    -- passage ID the user is on
      integrity_at_start numeric(4,1)
      status        enum('in_progress','completed','aborted') DEFAULT 'in_progress'
      ```

    - **Server-side Assembly Steps:**
      1. Fetch **Mission Master JSON** (`missions.twine_json`) – exported from Twine, containing all passages, tags, and links.
      2. Hydrate first passage variables & split out **Exercise Blocks** referenced via tags like `exercise:VOCAB_123`.
      3. Pull referenced assets:
         • TTS/audio URLs for each passage speaking line (usually via Supabase Storage).
         • Illustration/animation IDs if passage has `asset:` tag.
      4. Build **`preloadAssets`** list (first ≤5 audio clips, images, Rive files) for client pre-fetch.
      5. Fetch **User Runtime State** (`coverIntegrity`, `gemBalance`, `streak`, any inventory flags).
    - **Response (typescript interface):**

      ```ts
      type StartMissionResponse = {
        session: {
          sessionId: string;
          missionId: string;
          startedAt: string;        // ISO timestamp
        };
        missionMeta: {
          codeName: string;
          title: string;
          difficulty: number;       // 1–5
          summary: string;
        };
        narrative: TwineStoryJson;   // full (or chunked) Twine export
        initialNodeId: string;       // passage ID client should render first
        userState: {
          coverIntegrity: number;    // 0–100
          gemBalance: number;
          dailyGoalMet: boolean;
        };
        preloadAssets: string[];     // signed URLs for first batch of media
      };
      ```

    - **Behavior Notes:**
      • If `resumeSessionId` is passed, use existing `state_json/current_node` to return `initialNodeId` & skip new DB insert.
      • Server returns **signed URLs** so the client can fetch media directly from Supabase Storage.
      • Response purposely *over-fetches* (`narrative`) to minimise future round-trips; subsequent `submitAnswer` calls will send just deltas.
    - **Open Questions:**
      1. Should we chunk `TwineStoryJson` to passages ahead vs lazy load?
      2. How large can a mission get before hitting payload limits (RN ~6-8 MB over cellular)?
      3. Do we pre-compute randomisation (shuffle distractors) server-side here or on each `submitAnswer`?
  - [x] Define spec for `submitAnswer(eventPayload)` endpoint/function (**[Decision V1 Spec below]**)
    - **Purpose:** Evaluate a single learner interaction, persist analytics, update HLR/Elo, and return immediate feedback & the next narrative node.
    - **Flow Chosen:** *Server-side evaluation for every answer* (simpler, authoritative, ~100 ms round-trip).
    - **Inputs (tRPC args):**

      ```ts
      type SubmitAnswerInput = {
        sessionId: string;          // FK → mission_sessions.id
        nodeId: string;             // passage / exercise ID being answered
        answerPayload: JsonValue;   // schema depends on exerciseType
        clientTimestamp: number;    // ms since epoch
      };
      ```

    - **Server-side Evaluation Steps:**
      1. Fetch session row & exercise definition.  
      2. Determine correctness:  
         • MCQ → equality.  
         • Type-in → Levenshtein ≤ 30 %.  
         • Speech → ASR transcript must satisfy `confidence ≥ 0.85` *and* pass keyword/Levenshtein rule.  
      3. Insert event into `user_exercise_events` and compute `xpDelta`, `coverIntegrityDelta`, `gemDelta`.  
      4. Update user Elo/HLR in the same DB transaction (values stored server-side; not returned each call).  
      5. Resolve branching: pick `nextNodeId` from Twine via `link[success]` / `link[failure]`. If the exercise has `retryAllowed=true`, include `retryPrompt`.  
      6. If nearing end of current narrative chunk, append next chunk & `preloadAssets` to response.

    - **Response:**

      ```ts
      type SubmitAnswerResponse = {
        correct: boolean;
        xpDelta: number;
        coverIntegrityDelta: number;    // negative or zero
        gemDelta: number;
        nextNodeId: string;
        retryPrompt?: string;           // if retryAllowed
        narrativePatch?: TwineStoryJson;
        preloadAssets?: string[];
      };
      ```

    - **Specific Decisions:**
      • **No retries by default**; optional per-exercise `retryAllowed` handled via `retryPrompt`.  
      • **Cover Integrity** only decreases (or stays) on incorrect.  
      • **Elo visibility:** Raw ability/uncertainty hidden from client; may surface later in profile endpoint.  
      • **ASR Threshold:** `confidence ≥ 0.85`; value configurable via env.

    - **Status:** SPEC LOCKED ✅
  - [x] Define spec for `endMission(sessionId, finalState)` endpoint/function (**[Decision V1 Spec below]**)
    - **Purpose:** Finalise a Mission Session, persist results, update rewards/streaks, and return refreshed home-state deltas.
    - **End Types:** `'success' | 'failure' | 'aborted'` (no partial XP).
    - **Inputs (tRPC args):**

      ```ts
      type EndMissionInput = {
        sessionId: string;
        endType: 'success' | 'failure' | 'aborted';
        coverIntegrityRemaining: number; // 0-100 after final event
        missionSeconds: number;
      };
      ```

    - **Server-side Steps:**
      1. Verify session is `in_progress`; set `status=endType`, `end_time=now()`.
      2. **XP Calculation:**  
         • If `endType==='success'` → `xpEarned = eventSum + COMPLETION_BONUS (20)`.  
         • Else → `xpEarned = 0`.
      3. **Cover Integrity Reward:**  
         • On `success`, grant `+5` integrity (capped at `100`).  
         • On other endTypes, keep remaining value.
      4. **Update User Row (single transaction):**

         ```sql
         users.cover_integrity = newIntegrity;
         users.xp_total      += xpEarned;
         users.gems          += gemDelta; -- could be 0
         users.missions_completed = missions_completed + (endType='success');
         ```

      5. **Streak Logic (daily undercover streak):**  
         • If `endType==='success'` **and** `coverIntegrityRemaining>0` → increment streak.  
         • If `coverIntegrityRemaining==0` (cover blown) → reset streak to `0`.
      6. Unlock next mission(s) only on `success`.
      7. Insert analytics row into `mission_results`.

    - **Response (delta, not full app state):**

      ```ts
      type EndMissionResponse = {
        xpEarned: number;                 // 0 if mission failed/aborted
        coverIntegrity: number;           // after +5 bonus if success
        streak: { current: number; longest: number };
        missionsUnlocked: string[];
        newAchievements: string[];
        dailyGoalMet: boolean;
        gemBalance: number;
        preloadAssets: string[];
      };
      ```

    - **Specific Decisions:**
      • **No partial XP:** If mission not completed (`success`), XP=0.  
      • **Integrity Bonus:** +5 on success (tunable).  
      • **Streak Definition:** Days in a row the agent completes at least one mission **without cover blown**. Resets when integrity hits 0.  
      • Separate "daily login streak" concept may be added later; not part of core endpoint.  

    - **Status:** SPEC LOCKED ✅
- [x] Decide where/when HLR/Elo calculations occur (**[Decision V1: Real-time via backend function/action (e.g., Supabase Edge Function/Trigger), fed by `userExerciseEvents`. Resides in backend layer.]**)
- [x] Define schema and initial parameters for HLR/Elo models (**[Decision V1: Use 1-parameter Elo-style logistic model].**)
  - **Model:**  \(P(\text{correct}) = \frac{1}{1+e^{-(\theta_u-\beta_i)}}\) where \(\theta_u\) is user ability; \(\beta_i\) item difficulty.
  - **Update rule (per event):**

    ```math
    \theta_u \leftarrow \theta_u + K_u ( outcome - P )
    \beta_i  \leftarrow \beta_i  - K_i ( outcome - P )
    ```

    • `outcome` = 1 for correct else 0.  
    • **K factors:** `K_u = 0.05`, `K_i = 0.02` (tunable via env).  
  - **DB Tables:**
    • `user_skill_params(user_id, skill_id, theta NUMERIC DEFAULT 0, last_updated)`  
    • `exercise_items(id, skill_id, beta NUMERIC DEFAULT 0)`
  - **Event Input Fields (already in `user_exercise_events`):** `correct BOOLEAN`, `skill_id`, `item_id`, `duration_ms`.
  - **Initialization:** All users & items start at 0 (average difficulty).  Content authors may seed `beta` per item to [-2…+2] scale via CMS.
  - **Edge Function:** `api/internal/updateElo.ts` runs inside the same DB transaction triggered by `submitAnswer`.
- [x] Define specific exercise templates for V1 (**[Decision V1: Support 5 types]**)
  1. `mcq_translate` (text → choose translation)
  2. `mcq_listen` (audio prompt → choose meaning)
  3. `fill_blank` (cloze sentence)
  4. `type_translate` (free-text)
  5. `speak_repeat` (speech)

  - **Shared JSON envelope:**

    ```ts
    interface ExerciseBase {
      id: string;           // UUID within mission JSON
      type: 'mcq_translate'|'mcq_listen'|'fill_blank'|'type_translate'|'speak_repeat';
      skillId: string;      // maps to HLR/Elo skill
      prompt: {
        text?: string;
        audioUrl?: string;
        imageUrl?: string;
      };
    }
    ```

  - **Type-Specific Payloads (examples):**

    ```ts
    interface McqTranslate extends ExerciseBase {
      choices: string[];          // 2-5 options
      correctIndex: number;
    }
    interface FillBlank extends ExerciseBase {
      sentence: string;           // with ___ placeholder
      correct: string;
      distractors: string[];
    }
    interface SpeakRepeat extends ExerciseBase {
      expectedTranscript: string; // canonical answer
      keywords: string[];         // for fallback check
    }
    ```

  - **Authoring Guidance:** Template JSON lives in Payload CMS; Twine passage tag `exercise:<id>` pulls it at build-time.
- [x] Finalize target platform(s) (**[Decision V1: Mobile first (iOS initially) via Expo React Native.]**)
- [x] Choose authentication provider (**[Decision V1: Clerk.]**)
- [x] Define V1 speech recognition approach (**[Decision V1: Use `expo-speech-recognition` library.]**)
- [x] Define V1 speech correctness check (**[Decision V1: Two-gate rule]**)
  - **Gate 1 – ASR Confidence:** Accept only transcripts where `confidence ≥ 0.85` (device ASR or server fallback).
  - **Gate 2 – Transcript Match:** Compute Levenshtein distance ratio between lower-cased `transcript` and `expectedTranscript`. Pass if `ratio ≤ 0.30` **OR** all `keywords[]` appear in transcript.
  - **Implementation:** Helper `checkSpeechAnswer(transcript, confidence, expected, keywords)` returns boolean + `distance` for analytics.
  - **Future:** Phoneme-level MFA alignment flagged for V2 (Research item in Section G).

## D. Gameplay & UX

- [x] Cover Integrity baseline established (**[Decision V1: Start 100; minor error −5, moderate −15, major −25; correct +2; warning ≤30; forced retreat at 0.]**)
- [x] Extraction token system defined (**[Decision V1: Player starts with 1 token; auto-consumed to reset Integrity to 25; token refills to 1 at next UTC-midnight if daily Neural-Calibration completed.]**)
- [x] Daily Neural-Calibration lesson rewards finalized (**[Decision V1: Safe training; +5 Integrity (cap 100); XP slightly > standard; required to enable token regen.]**)
- [x] Consequence of Integrity hitting 0% clarified (**[Decision V1: If no token available, mission ends in Forced Retreat; XP = 0; triggers Failure-Loop detour narrative (exact content TBD).]**)

## E. Planning & Scope

- [x] Break down V1 scope into buildable user stories/tasks (**see E.1 User Stories below**)
- [x] Assess solo-dev skills against chosen V1 tech stack (**see E.2 Skills & Risk**)
- [x] Background/cron jobs for V1 — **None required** (edge models run in-request)

### E.1 User Stories – "Hello-World" V1

EPIC 1 — Boot & Home
1.1 Auto-Bootstrap Home – silent Clerk restore → Map screen  
1.2 Start Mission 001 Segment A – tap node → intro plays  
1.3 Answer Exercise – MCQ translate, feedback, integrity delta  
1.4 Segment Complete – next segment icon lights up  
1.5 Mission Complete – after final segment `endMission(success)`; Mission 002 appears

EPIC 2 — Cover Integrity & Token (penalties, extraction token, daily calibration)

EPIC 3 — Content Pipeline – Twine schema validator, Payload CMS starter, signed-URL audio

EPIC 4 — Tech Foundation – Supabase+Prisma, Bun+tRPC Edge API, Expo RN scaffold

### E.2 Solo-Dev Skills & Risk Matrix

| Stack Component | Experience | Risk | Mitigation |
|-----------------|------------|------|------------|
| Expo / React Native | Strong | Low | — |
| Supabase / Postgres | Good | Low | Prisma docs |
| Clerk (silent auth) | Decent | Low | Starter kit |
| Rive Animations | Light | Medium | Contractor + course |
| Bun + tRPC backend | New | HIGH | Early spike, keep API thin |
| Content pipeline (Twine + CMS) | Low | Medium | Prototype early |

> Highest-risk area: Bun backend unfamiliarity; secondary: producing Rive at scale.

## F. Tech Stack Decisions (from research)

- [x] Feedback scoring mechanism agreed (**simple Elo + CEFR heuristics via Pipecat bolt-on**)
- [x] Define Phoneme → Viseme mapping approach (**static JSON; Rhubarb optional later**)  
- [x] Confirm Animation runtime (**Rive primary; Moho/Lottie pre-render optional**)  
- [x] Select Real-time chat LLM & integration (**Pipcast Cloud + Vercel AI SDK**)

## G. Research Questions (from research)

- [x] Investigate best open-source service for auto-generating viseme keyframes (**[Decision V1: Tentatively Rhubarb-Lip-Sync (maintained) if dynamic needed beyond static map.]**)
- [x] Evaluate Apple MLX speech models for on-device alignment feasibility.
- [x] How to automatically grade *interactional competence*? (**Decision: Use existing Elo + CEFR heuristics; revisit advanced metrics post-V1.**)

## H. Terminology Mapping & Deviation Tracking

- [x] V1 terminology mapping decided (Language→Campaign, Section→Clearance Level, Unit→Operation, Lesson→Mission)
- [x] Deviation Log process adopted — any spec change recorded as `[Deviation yyyy-mm-dd]: reason, impact, link`.
  - Example: `[Deviation 2024-06-28]: Swapped Bun Edge API to tRPC v11 beta to fix deploy latency; impact = backend bundle size +8 KB; link = PR #42`

## I. Questions from Dev Blueprint

- [x] Do we want linear mission progression or open-world exploration for V1? (**[Note: Vision implies linear progression through arrondissements for V1.]**)
- [x] Should we include mini-games for specific language skills in V1? (**Decision: No mini-games in V1. Re-evaluate post-launch.**)
- [x] What is the target balance between educational content vs. narrative focus in V1 missions? (**Decision: Prioritise narrative; ensure each mission teaches ≤8 new vocab items—see content KPIs.**)
- [x] Will V1 include voice recognition for speaking practice? (**Yes – decided via Section C.**)

## J. Action Items (To-Do)

- [x] **Chat LLM:** Voice pipeline chosen — PipeCat TTS/TTR; occasional WebRTC fallback when real-time required.
- [x] **Chat LLM:** Duolingo-style structured prompt pattern drafted and to be refined in PRD.

## K. Script & Narrative Decisions (TBD)

> Central parking lot for story-centric mechanics we still need to lock down.  These influence both narrative design and gameplay code but don't fit cleanly in the other sections yet.

- [ ] Structure within a Mission (sub-missions, end-test) — **moved to Section K**
- [ ] Optional-Op **life-span / despawn timer**
  - Options: 48 h, 72 h, 7 d; should timer pause while another mission is active?
- [ ] **Clue Integration Model** – how intel from Optional Ops affects the main spine
  - Simple boolean flags per clue vs. point-based "intel score" unlocking variant dialogue/endings.
- [ ] **Failure-Loop (Forced Retreat) content & rewards**
  - Short remedial mission, safe-house hub, or purely narrative cut-scene?
  - Does clearing it restore Integrity / grant XP?
- [ ] **Error-Severity Rubric** for exercise authors (Minor / Moderate / Major)
  - Quick guidance so story designers tag penalties consistently.
- [ ] **Pimsleur "Intercept" adaptive overlay** specifics
  - Trigger rule (HLR `P(recall)` threshold?)
  - Micro-review format (re-play audio vs. injected recall items).
- [ ] **Respawn policy for despawned Optional Ops**
  - Gone forever, or can re-appear in later arrondissements?

## L. Remaining Open Checklist Items

- [ ] Detail language learning integration within Failure Loops (Detention/Safehouse). (**[Note: How can this feel distinct & meaningful? Ideas: Learn unique slang/jargon, gain intel from inmates/guards, different story beats unlock, potentially fun mini-loop. Avoid pure punishment.]**)
- [ ] Define adherence level to Pimsleur methodology for "Intercept" lessons. (**[Decision V1 Pattern: 'Scripted-Spine (Pimsleur-like) + Adaptive Overlay (HLR/Elo reviews)'. Define recall intervals, backward buildup use.]**)
  - [ ] Define logic for Adaptive Overlay trigger (`P(recall)` threshold?) and actions (re-listen vs. micro-reviews?).
- [ ] Create detailed UI mockups/wireframes for key screen flows (**[Note: Wireframes exist, need review/integration. Define specific data needed for each UI surface: Map, Audio Player, Review Modal, Feedback Toasts, Status Bars.]**).
- [ ] What specific UI elements/animations will provide positive feedback? (**[Note: Explore thematic ideas like 'Days Undercover' flip sign, score streaks/momentum mechanics (like CoD killstreaks), celebratory animations for milestones/completions.]**)
- [ ] Explore "Clout/Credibility/Goodwill" mechanic for relationship/unlock progression? (**[Note: Likely V2+, but capture idea.]**)

## M. Build-Phase Spikes & Deferred Items

Items intentionally deferred until implementation/testing phase.  They are *not* blockers for V1 code-freeze.

- Finalise full V1 Technical Spec (rich TSD / PRD document).
- Minimal authoring-tool suite: Payload CMS starter, Twine export CLI + validator, lightweight Audio-Marker web UI (evaluate Audacity vs Wavesurfer prototype).
- Vision & Blueprint document refresh once Section E fully locked.
- Forced alignment / phoneme-timing method evaluation (Whisper/Seamless + MFA vs alternatives).
- Chat-LLM memory storage (key-value vs vector) — prototype after baseline chat shipped.
- Experiment / A-B infra — review Expo EAS offerings vs LaunchDarkly once traffic justifies.
- Audio-Marker workflow final choice — implement prototype during first asset-import sprint.
- Define minimal V1 content-authoring tooling (Payload CMS starter, Twine export CLI + Zod validator, lightweight Audio-Marker web UI) - finalize during build prep.
- Schedule Vision/Blueprint refresh after Section E fully locked.
- Chat LLM memory storage strategy (key-value vs vector) — prototype after baseline chat shipped.
- Experiment infrastructure — review Expo EAS offerings vs LaunchDarkly once traffic justifies.
- EAS A/B testing infra — evaluate post-launch.
