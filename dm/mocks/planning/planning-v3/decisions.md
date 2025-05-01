# Decision Checklist - V1 Planning

**Status:** `PLANNING` (Switch to `PRODUCTION` when decisions locked for V1 build)

## A. Database Choice

- [x] Confirm final database choice (**[Decision V1: Leaning Supabase/Postgres due to relational needs & familiarity. Revisit if V1 prototyping highlights significant need for Convex's real-time capabilities that outweigh its learning curve.]**)
- [ ] Is the planned V1 feature set (core loop, basic personalization, narrative state) adequately served by Postgres alone, or is there a V1 feature anticipating DynamoDB-like scale/access patterns? (**[Note: Likely Postgres is sufficient for V1. Duolingo uses DynamoDB for specific high-scale key-value needs like Birdbrain, which we likely won't replicate at that scale initially.]**)

## B. Content & Narrative Workflow

- [ ] Define content management process (**[Note: How to manage/import content? CMS needed? Payload/Sanity seem blog-focused. Consider custom build or node-based editor exporting structured JSON for V1? V1 might require simple CSV->DB uploader initially.]**)
- [ ] Define scope of unique content for Cipher vs. Guardian paths (**[Note: Reskin or fundamentally different mechanics/content?]**)
- [ ] Define complexity and data representation for narrative branching (failure paths, optional ops). (**[Note: How will logic be stored/accessed? Options: Node-based editor -> JSON stored in DB (V1 leaning), simple state variables in user record, scripting? Games use node editors, scripting (Lua), ECS state.]**)
- [x] Plan for voice acting (**[Decision V1: TTS. Need to select provider/model.]**)
- [ ] How will recurring audio segments (if any, e.g., UI sounds, common feedback) be identified/managed for consistency? (**[Note: Investigate audio hashing (fingerprinting) like Duolingo uses? Necessary for V1 TTS? Requires Audio Chunk Marker tool.]**)
- [ ] If considering AI content gen later, what structured format (beyond plain text) would guide it effectively? (**[Note: Propose starting with structured JSON representing dialogue steps, speakers, expected responses, exercise links? Needs refinement.]**)
- [ ] Define minimum content seeding needed for V1 launch (**[Note: e.g., Language row, 1 Section->Unit->Lesson, exercise templates, items/concepts for first ~30min audio, corresponding media assets.]**)

## C. Technical Implementation Details

- [ ] Design API / backend functions for core loop (**[Note: Node/Bun/FastAPI/Go/Elixir candidates? tRPC? Define specific functions needed. Tentative lean towards Node/Bun or FastAPI for V1.]**)
  - [ ] Define spec for `startSession(userId)` endpoint/function.
  - [ ] Define spec for `nextPrompt(sessionId)` endpoint/function (handles Spine vs Overlay logic).
  - [ ] Define spec for `submitAnswer(eventPayload)` endpoint/function (handles event write, HLR/Elo update, response).
  - [ ] Define spec for `endSession(sessionId)` endpoint/function.
- [x] Decide where/when HLR/Elo calculations occur (**[Decision V1: Real-time via backend function/action (e.g., Supabase Edge Function/Trigger), fed by `userExerciseEvents`. Resides in backend layer.]**)
- [ ] Define specific exercise templates for V1 (MC, fill-in, match, construct, speak?) and their `jsonPayload` structure.
- [x] Finalize target platform(s) (**[Decision V1: Mobile first (iOS initially) via Expo React Native.]**)
- [x] Choose authentication provider (**[Decision V1: Clerk.]**)
- [ ] Define schema and initial parameters for HLR/Elo models (**[Note: Seed A/B for HLR, d=0 for Elo? See `convex-db-setup-checklist.md` for detailed schema.]**)
- [ ] Define V1 speech recognition approach (**[Note: Use expo-speech-recognition or native? Basic Levenshtein distance check for correctness (e.g., <= 30%)?]**)

## D. Gameplay & UX

- [ ] Plan for balancing/playtesting Cover Integrity percentages (+/- effects).
- [ ] Define exact consequence of Cover Integrity hitting 0% (beyond "forced retreat").
- [ ] Detail language learning integration within Failure Loops (Detention/Safehouse). (**[Note: How can this feel distinct & meaningful? Ideas: Learn unique slang/jargon, gain intel from inmates/guards, different story beats unlock, potentially fun mini-loop. Avoid pure punishment.]**)
- [ ] Define adherence level to Pimsleur methodology for "Intercept" lessons (recall intervals, backward buildup?) and technical implementation. (**[Note: Confirm V1 pattern is 'Scripted-Spine (Pimsleur-like) + Adaptive Overlay (HLR/Elo reviews)'?]**)
- [ ] Define logic for Adaptive Overlay trigger (`P(recall)` threshold?) and actions (re-listen vs. micro-reviews?).
- [ ] Create detailed UI mockups/wireframes for key screen flows (**[Note: Wireframes exist, need review/integration. Define specific data needed for each UI surface: Map, Audio Player, Review Modal, Feedback Toasts, Status Bars.]**).
- [ ] What specific UI elements/animations will provide positive feedback? (**[Note: Explore thematic ideas like 'Days Undercover' flip sign, score streaks/momentum mechanics (like CoD killstreaks), celebratory animations for milestones/completions.]**)
- [ ] Explore "Clout/Credibility/Goodwill" mechanic for relationship/unlock progression? (**[Note: Likely V2+, but capture idea.]**)

## E. Planning & Scope

- [ ] Break down V1 Scope into buildable user stories/tasks. (**[Note: Aim for a polished 'V1', not just MVP, per Duolingo philosophy. Define the minimal "Hello World" path.]**)
- [ ] Assess team skills against chosen tech stack requirements. (**[Note: V1 Stack Candidates: Expo/RN, Supabase/Postgres, Clerk, Backend (Node/FastAPI/Bun?), Rive. Compare team comfort vs performance needs (Go/Rust later?).]**)
- [ ] Define structure and timing for creating the final V1 Technical Specification document. (**[Note: When are decisions locked? What goes into the spec?]**)
- [ ] Identify backend jobs that can be postponed post-V1 (**[Note: e.g., Nightly Elo replay, tier decay, gem refill cron, leaderboard snapshots.]**)
- [ ] Define minimal V1 content authoring tools (**[Note: Need CSV Uploader, Audio Chunk Marker, Script Previewer?]**)

## F. Tech Stack Decisions (from research)

- [ ] Choose Forced alignment & phoneme timing method (**[Note: Need to test Whisper/Seamless + MFA vs other. Phoneme-level timing likely post-V1.]**).
- [x] Define Phoneme → Viseme mapping approach (**[Decision V1: Static JSON mapping. Rhubarb is OSS option for dynamic later if needed.]**)
- [x] Confirm Animation runtime (**[Decision V1: Rive primary, evaluate Moho/Lottie pre-renders case-by-case. Consider basic Rive mouth-sync triggered by recording state for V1 nicety?]**).
- [x] Select Real-time chat LLM & integration method (**[Decision V1: Pipcast Cloud likely for real-time, Vercel AI SDK for TTS-TTS. Model agnostic. Apply Duolingo's structured prompt pattern (System/Assistant/User roles).]**)
- [ ] How will the Chat LLM's "List of Facts" (memory) be stored & retrieved efficiently per user/session? (**[Note: Options: 1. Key-value facts in user DB record/system prompt (simple V1 lean). 2. Vector DB query for semantic recall. 3. Rolling context summary. Consider game state saving patterns.]**)
- [ ] Determine Feedback scoring mechanism (**[Note: Open - Focus on simpler V1 metrics? Prompting + Vosk/CEFR heuristics? Keyword usage? Response latency? Complexity? Full 'interactional competence' likely post-V1. Consider Pipecat bolt-on for corrective hints?]**)
- [ ] Decide on Experiment infrastructure (**[Note: Open - LaunchDarkly viable for V1, or homemade?]**).

## G. Research Questions (from research)

- [x] Investigate best open-source service for auto-generating viseme keyframes (**[Decision V1: Tentatively Rhubarb-Lip-Sync (maintained) if dynamic needed beyond static map.]**)
- [ ] Can Seamless M4T export phone-level timestamps directly, or is MFA still needed? (**[Note: Needs verification.]**)
- [ ] Evaluate Apple MLX speech models for on-device alignment feasibility.
- [ ] How to automatically grade *interactional competence*? (**[Note: V1 focus likely simpler: Explore ELO-style conversation score? Other metrics like keyword usage, response latency, complexity heuristics? Use Vosk + CEFR heuristics?]**)

## H. Terminology Mapping & Deviation Tracking

- [ ] Define final V1 terminology mapping (**[Note: Plan is roughly Language->Campaign, Section->Clearance Level, Unit->Operation, Lesson->Mission. Needs formalization.]**)
- [ ] Clarify structure within a Mission (e.g., Submissions? End-of-mission "Test"/"Cover Operation"?) (**[Note: Needs discussion based on deviation from original plan.]**)
- [ ] Establish process for tracking deviations from Vision/Blueprint documents during development.

## I. Questions from Dev Blueprint

- [ ] Do we want linear mission progression or open-world exploration for V1? (**[Note: Vision implies linear progression through arrondissements for V1.]**)
- [ ] Should we include mini-games for specific language skills in V1?
- [ ] What is the target balance between educational content vs. narrative focus in V1 missions?
- [ ] Will V1 include voice recognition for speaking practice? (**[Note: Seems implied by TTS and feedback mechanisms, but needs confirmation.]**)

## J. Action Items (To-Do)

- [ ] **Chat LLM:** Evaluate Voice Pipeline vs WebRTC integration options.
- [ ] **Chat LLM:** Define and apply Duolingo-inspired structured prompt pattern (System/Assistant/User roles).
