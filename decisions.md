# Decision Checklist - V1 Planning

**Status:** `PLANNING` (Switch to `PRODUCTION` when decisions locked for V1 build)

## A. Database Choice

- [ ] Confirm final database choice (**[Note: Leaning Supabase/Postgres due to relational needs, vs Convex/Firebase/Custom]**)

## B. Content & Narrative Workflow

- [ ] Define content management process (**[Note: How to manage/import content? CMS needed? Payload/Sanity seem blog-focused, custom build?]**)
- [ ] Define scope of unique content for Cipher vs. Guardian paths (**[Note: Reskin or fundamentally different mechanics/content?]**)
- [ ] Define complexity and data representation for narrative branching (failure paths, optional ops).
- [ ] Plan for voice acting (**[Decision: Likely TTS for V1, investigate audio hashing?]**)

## C. Technical Implementation Details

- [ ] Design API / backend functions for core loop (**[Note: Node/Bun/Go candidates? tRPC? Define specific functions needed]**).
- [ ] Decide where/when HLR/Elo calculations occur (Real-time function vs. Batch process?).
- [ ] Define specific exercise templates for V1 (MC, fill-in, match, construct, speak?) and their `jsonPayload` structure.
- [ ] Finalize target platform(s) (**[Decision: Mobile first (iOS initially)]**).
- [ ] Choose authentication provider (**[Decision: Clerk or Supabase Auth]**).

## D. Gameplay & UX

- [ ] Plan for balancing/playtesting Cover Integrity percentages (+/- effects).
- [ ] Define exact consequence of Cover Integrity hitting 0% (beyond "forced retreat").
- [ ] Detail language learning integration within Failure Loops (Detention/Safehouse).
- [ ] Define adherence level to Pimsleur methodology for "Intercept" lessons (recall intervals, backward buildup?) and technical implementation.
- [ ] Create detailed UI mockups/wireframes for key screen flows (**[Note: Wireframes exist, need review/integration]**).

## E. Planning & Scope

- [ ] Break down V1 Scope into buildable user stories/tasks.
- [ ] Assess team skills against chosen tech stack requirements.

## F. Tech Stack Decisions (from research)

- [ ] Choose Forced alignment & phoneme timing method (**[Note: Need to test Whisper/Seamless + MFA vs other]**).
- [ ] Define Phoneme → Viseme mapping approach (**[Note: Need to test Static JSON mapping vs other]**).
- [ ] Confirm Animation runtime (**[Decision: Rive primary, evaluate Moho/Lottie pre-renders case-by-case]**).
- [ ] Select Real-time chat LLM & integration method (**[Decision: Pipcast Cloud likely for real-time, Vercel AI SDK for TTS-TTS. Model agnostic. Evaluate Voice Pipeline vs WebRTC.]**).
- [ ] Determine Feedback scoring mechanism (**[Note: Open - Prompting + Vosk/CEFR? Other?]**).
- [ ] Decide on Experiment infrastructure (**[Note: Open - LaunchDarkly or homemade?]**).

## G. Research Questions (from research)

- [ ] Investigate best open-source service for auto-generating viseme keyframes (**[Decision: Tentatively Rhubarb-Lip-Sync (maintained), but investigate custom generation?]**).
- [ ] Can Seamless M4T export phone-level timestamps directly, or is MFA still needed?
- [ ] Evaluate Apple MLX speech models for on-device alignment feasibility.
- [ ] How to automatically grade *interactional competence*? (Explore ELO-style conversation score? Other metrics?).

  OSS/Vendor: Prompt-engineering + function-calling; add speech scoring via Vosk + CEFR heuristics
audio hashing? 