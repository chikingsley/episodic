# Decision Checklist - V1 Planning

Status: `PLANNING` (Switch to `PRODUCTION` when decisions locked for V1 build)

## 1. Core Architecture Decisions

### 1.1 Database & Infrastructure

- ✅ Database: Convex
  - Convex will handle all tables (users, missions, sessions, exerciseEvents, etc.)
  - Schema defined in `/convex/schema.ts`
  - Mutations and queries organized in `/convex/mutations/` and `/convex/queries/`
  - Long-running jobs in `/convex/functions/`
- ✅ CDN: AWS CloudFront with S3 storage
  - Static content (images, audio) served from S3 buckets
  - CloudFront distribution for global caching and delivery

### 1.2 Authentication & User Management

- ✅ Auth Provider: Clerk (with Convex adapter in `/convex/auth.config.ts`)

### 1.3 Platform & Client

- ✅ Target Platform: Mobile first (iOS initially) via Expo React Native

### 1.4 Backend Implementation

- ✅ Backend Technology: Convex (replacing previous Bun/tRPC stack)
- ✅ API Design: Core endpoints defined as Convex mutations and queries
  - `getInitialAppState` → `/convex/queries/getInitialAppState.ts`
  - `startMission` → `/convex/mutations/startMission.ts`
  - `submitAnswer` → `/convex/mutations/submitAnswer.ts`
  - `endMission` → `/convex/mutations/endMission.ts`

## 2. Content & Narrative System

### 2.1 Content Management

- ✅ Content Structure:
  - Inky/Ink for designing/writing branching narrative (compiled to JSON)
  - Content stored in `/content/` directory with narrative, lessons, audio, and images
  - Scripts for compiling Ink to JSON and validating content

### 2.2 Content Identification System

- ✅ Slug Scheme: `<lang>-<clearance>-<op>-<unit>-<kind>-<idx>`
  - `lang`: Language code (fr, es)
  - `clearance`: CEFR section/security tier (C01, C02)
  - `op`: Story arc or skill bucket (op01, op02)
  - `unit`: Mission/lesson group (u01, u02)
  - `kind`: Content type (N=narrative, L=lesson, D=drill, etc.)
  - `idx`: Sequential number (01, 02)
  - Example: `fr-C01-op03-u04-N-05` (French, Clearance 1, Operation 3, Unit 4, Narrative, #5)

- ✅ Terminology Mapping:

  | Term | Slug Segment |
  |------|--------------|
  | Campaign | lang |
  | Security Clearance | clearance |
  | Operation | op |
  | Mission | unit |
  | Exercise/Drill | kind + idx |

- ✅ File Organization:
  - Organized in content directory:

    ```text
    /content/
    ├── narrative/            ← compiled Ink JSON
    │   ├── fr-C01-op01-u01-N-01.json
    │   └── …
    ├── lessons/              ← lesson JSON blobs
    ├── audio/                ← dev copies of TTS (source of truth)
    └── images/
    ```

  - Ink source files in `/content_src/narrative/` with `.ink` extension
  - Ink tags reference by slug: `#lesson:fr-C01-op03-u04-L-02`

- ✅ Ink Workflow:
  1. Writers edit `.ink` files in `/content_src/narrative/`
  2. `scripts/compile-ink.mjs` runs inklecate to generate JSON in `/content/narrative/`
  3. CI runs `validate-content.mjs` to enforce naming conventions and required tags
  4. Mobile app loads JSON from Convex (or bundles first few) and feeds to inkjs

- ✅ Validation System:
  - Maintain registry table in Convex with columns: slug, title, kind, live
  - CI script validates that referenced slugs exist and filenames match

### 2.3 Narrative Scope

- ✅ Scope: Focus only on one path (The Network / Duck)
- ✅ Branching Complexity: Moderate branching
  - Choices within missions impact outcomes within that mission
  - Success/failure state impacts subsequent mission options
- ✅ Minimum Content: First 5-10 missions with full content

### 2.4 Audio & Voice

- ✅ Voice Implementation: Text-to-Speech (TTS)
- ✅ TTS Provider: Rime TTS via Pipecat; ElevenLabs as backup
- ✅ Audio Management: Identify recurring audio, generate TTS once, store in AWS S3 and serve via CloudFront

### 2.5 Content Validation

- ✅ Ink Export: Define schema conventions with Zod validator
- ✅ QA Pipeline:
  - Schema validator
  - Asset link checker against AWS S3 bucket
  - Automated playthrough linter

## 3. Exercise & Learning System

### 3.1 Exercise Templates

- ✅ V1 Exercise Types:
  1. `mcq_translate` (text → choose translation)
  2. `mcq_listen` (audio → choose meaning)
  3. `fill_blank` (cloze sentence)
  4. `type_translate` (free-text)
  5. `speak_repeat` (speech recognition)

### 3.2 Speech Recognition

- ✅ Implementation: Use `expo-speech-recognition` library
- ✅ Correctness Check: Two-gate rule
  - Gate 1: ASR Confidence ≥ 0.85
  - Gate 2: Levenshtein distance ratio ≤ 0.30 OR all keywords appear
- ✅ SpeechAce API: Use for pronunciation scoring

### 3.3 Learning Model

- ✅ Skill Model: 1-parameter Elo-style logistic model
  - P(correct) = 1/(1+e^(-(θ_u-β_i)))
  - Update rule per event: θ_u ← θ_u + K_u(outcome - P)
- ✅ Calculation Timing: Real-time via backend function/action
- ✅ Initialization: All users & items start at 0 (average difficulty)

## 4. Gameplay Mechanics

### 4.1 Core Mechanics

- ✅ Cover Integrity:
  - Start at 100
  - Minor error: -5
  - Moderate error: -15
  - Major error: -25
  - Correct answer: +2
  - Warning at ≤30
  - Forced retreat at 0

- ✅ Extraction Token:
  - Start with 1 token
  - Auto-consumed to reset Integrity to 25
  - Refills at UTC-midnight if daily Neural-Calibration completed

- ✅ Neural-Calibration:
  - Safe training (+5 Integrity, cap 100)
  - XP slightly > standard
  - Required for token regeneration

### 4.2 Progression System

- ✅ Terminology Mapping:
  - Language → Campaign
  - Section → Clearance Level
  - Unit → Operation
  - Lesson → Mission
  
Note: This terminology mapping is also reflected in the content identification system (Section 2.2)

## 5. API Specifications

### 5.1 `getInitialAppState(userId)`

- Purpose: Provide data for Home/Map screen after login
- Response: User metadata, progress, boosts, notifications, feature flags, preload assets
- Implementation: Bun + tRPC + Prisma ORM talking to Supabase Postgres

### 5.2 `startMission(userId, missionId)`

- Purpose: Initiate new Mission Session with data for first dialogue
- Validation: Verify user, ensure mission is unlocked
- DB Writes: Insert into `mission_sessions` table
- Response: Session info, mission metadata, narrative data, assets to preload

### 5.3 `submitAnswer(eventPayload)`

- Purpose: Evaluate learner interaction, update state, return feedback
- Server Evaluation: Determine correctness based on exercise type
- Updates: Insert event, compute deltas, update user Elo/HLR
- Response: Correctness, XP/integrity changes, next node, retry info if applicable

### 5.4 `endMission(sessionId, finalState)`

- Purpose: Finalize session, update rewards/streaks, return home-state deltas
- Processing: Update session status, calculate XP/integrity, update user data
- Response: XP earned, new integrity, streak info, unlocked missions

## 6. Project Planning

### 6.1 User Stories

### EPIC 1 — Boot & Home

1. Auto-Bootstrap Home – silent Clerk restore → Map screen
2. Start Mission 001 Segment A – tap node → intro plays
3. Answer Exercise – MCQ translate, feedback, integrity delta
4. Segment Complete – next segment icon lights up
5. Mission Complete – after final segment; Mission 002 appears

### EPIC 2 — Cover Integrity & Token

- Penalties, extraction token, daily calibration

### EPIC 3 — Content Pipeline

- Twine schema validator, Payload CMS starter, signed-URL audio

### EPIC 4 — Tech Foundation

- Supabase+Prisma, Bun+tRPC Edge API, Expo RN scaffold

### 6.2 Skill & Risk Assessment

| Stack Component | Experience | Risk | Mitigation |
|-----------------|------------|------|------------|
| Expo / React Native | Strong | Low | — |
| Supabase / Postgres | Good | Low | Prisma docs |
| Clerk (silent auth) | Decent | Low | Starter kit |
| Rive Animations | Light | Medium | Contractor + course |
| Bun + tRPC backend | New | HIGH | Early spike, keep API thin |
| Content pipeline | Low | Medium | Prototype early |

## 7. Pending Decisions (TBD)

### 7.1 Script & Narrative

- ⬜ Structure within a Mission (sub-missions, end-test)
- ⬜ Optional-Op lifespan/despawn timer (48h, 72h, 7d?)
- ⬜ Clue Integration Model (boolean flags vs. "intel score")
- ⬜ Failure-Loop content & rewards
- ⬜ Error-Severity Rubric for exercise authors
- ⬜ Pimsleur "Intercept" adaptive overlay specifics
- ⬜ Respawn policy for despawned Optional Ops

### 7.2 Deferred for Implementation Phase

- ⬜ Finalize full V1 Technical Spec
- ⬜ Develop minimal authoring tools
- ⬜ Evaluate phoneme-timing/forced alignment methods
- ⬜ Define Chat-LLM memory storage approach
- ⬜ Set up experiment/A-B infrastructure
- ⬜ Create detailed UI mockups for key screens
- ⬜ Define positive feedback UI elements/animations

## 8. Completed Items

- ✅ Chat LLM: Voice pipeline chosen — PipeCat TTS/TTR
- ✅ Chat LLM: Duolingo-style structured prompt pattern drafted
- ✅ Feedback scoring mechanism: simple Elo + CEFR heuristics
- ✅ Animation runtime: Rive primary with optional Moho/Lottie pre-render
- ✅ Phoneme → Viseme mapping: static JSON with optional Rhubarb later
- ✅ Deviation Log process adopted for tracking spec changes

## Appendix: API Schema Details

The detailed TypeScript interfaces for the API endpoints are retained here for reference.
