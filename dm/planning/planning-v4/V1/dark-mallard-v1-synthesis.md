# Dark Mallard V1 - Project Synthesis & Action Plan

## Executive Summary

Dark Mallard is a spy-themed language learning app that combines:
- **Narrative-driven learning** using Ink/Inky for branching storylines
- **Pimsleur-style audio lessons** integrated into spy missions
- **Gamification elements** inspired by Blooket games (especially Crypto Hack)
- **Adaptive learning** with Elo-based skill tracking

The player takes on the role of Drake (a duck agent) who must learn French to complete missions in Cannes. Your handler Sheldon (turtle) helps guide you through neural-linked contacts that provide translation overlays.

## Current Project State

### What's Built
1. **Tech Stack Established:**
   - Expo React Native app with TypeScript
   - Convex for backend/database
   - Clerk for authentication
   - Ink/inkjs for narrative system
   - NativeWind for styling

2. **Initial Narrative Written:**
   - Opening jet sequence (FR-C01-OP01-U01-N-01.ink)
   - Sets up the premise: Drake and Sheldon heading to Paris to find missing agent Stella
   - Neural contact lens mechanic explained
   - French skill level selection integrated

3. **Content Resources Available:**
   - Complete Pimsleur French I-III transcripts (JSON format)
   - Michel Thomas & Paul Noble transcripts
   - Duolingo vocabulary and unit structure data
   - Mission planning for first 3 Pimsleur lessons

### What's Missing/Needed
1. **Core Lesson Implementation:**
   - Integration of Pimsleur audio structure into Ink narrative
   - Exercise system implementation
   - Speech recognition setup
   - TTS voice generation

2. **Game Mechanics:**
   - Cover Integrity system
   - XP/progression tracking
   - Gamification elements (inspired by Crypto Hack)
   - Daily calibration system

3. **Content Pipeline:**
   - Ink compilation workflow
   - Audio generation and storage
   - Content validation system

## Key Design Decisions (From Your Research)

### Language Learning Approach
**Chosen Method:** Pimsleur-style audio-first with narrative integration

**Rationale:**
- Pimsleur's spaced repetition and graduated interval recall are proven effective
- Audio-first aligns with spy "intercept" theme
- Can integrate narrative elements between practice segments

**Implementation:**
```
1. Narrative setup (30-60 seconds) - Set mission context
2. Audio intercept (10-15 minutes) - Modified Pimsleur lesson
3. Field exercises (3-5 activities) - Apply what was learned
4. Mission outcome - Success/failure affects story
```

### Gamification Strategy
**Primary Inspiration:** Crypto Hack's hacking/password mechanics

**Adaptation for Language Learning:**
- **Password System → Code Phrases:** Learn phrases that serve as "passwords" for missions
- **Hacking Tasks → Language Challenges:** When you fail, complete language mini-games to recover
- **Crypto Currency → Intel Points:** Correct answers earn intelligence that unlocks story branches
- **Bot Characters → Asset Network:** NPCs you can recruit by successfully communicating

**Additional Elements from Other Games:**
- **From Gold Quest:** Risk/reward choices after correct answers
- **From Deceptive Dinos:** "Cheat" mechanic = using translation overlay (costs Cover Integrity)

### Narrative Integration

**Dual-Character System:**
- **Drake (Player):** In the field, must speak French
- **Sheldon (Handler):** Provides support via neural link
- Creates natural reason for translation overlay UI
- Allows for humor and character development

**Mission Structure:**
```
Mission = Narrative Node + Language Lesson + Field Test
├── Briefing (Ink narrative)
├── Intercept (Pimsleur-style audio)
├── Analysis (Vocabulary/grammar exercises)  
└── Field Op (Speaking/comprehension challenge)
```

## Technical Architecture

### Content Identification System
```
Slug Format: <lang>-<clearance>-<op>-<unit>-<kind>-<idx>
Example: fr-C01-op01-u01-L-01
         └─┘ └──┘ └───┘ └──┘ └┘ └─┘
          │    │     │     │   │  └── Sequential number
          │    │     │     │   └───── Content type (L=Lesson, N=Narrative)
          │    │     │     └───────── Unit/Mission group
          │    │     └─────────────── Operation/Story arc
          │    └───────────────────── Clearance level (CEFR-based)
          └────────────────────────── Language code
```

### Exercise System
```typescript
// Core exercise types for V1
type ExerciseType = 
  | 'mcq_translate'    // Multiple choice translation
  | 'mcq_listen'       // Audio → meaning selection
  | 'fill_blank'       // Cloze sentences
  | 'type_translate'   // Free text translation
  | 'speak_repeat';    // Speech recognition

// Exercise evaluation
interface ExerciseResult {
  correct: boolean;
  coverIntegrityDelta: number;  // -5 to -25 for errors
  xpEarned: number;
  intelPoints?: number;         // For story progression
}
```

## Immediate Next Steps (Priority Order)

### 1. Create First Integrated Lesson (3-4 days)
**Objective:** Combine narrative + Pimsleur Lesson 1 in Ink format

**Tasks:**
- [ ] Create `fr-C01-op01-u01-L-01.ink` that weaves Pimsleur content into story
- [ ] Design exercise insertion points using Ink tags
- [ ] Create JSON structure for exercises referenced from Ink
- [ ] Test full flow in Inky editor

**Deliverable:** Working Ink file that represents complete first lesson

### 2. Implement Exercise Engine (2-3 days)
**Objective:** Build system to handle exercises triggered from Ink

**Tasks:**
- [ ] Create exercise components for each type
- [ ] Implement exercise evaluation logic
- [ ] Build Cover Integrity tracking
- [ ] Add XP/progression calculation

**Deliverable:** Exercise system that integrates with inkjs runtime

### 3. Audio Pipeline Setup (2 days)
**Objective:** Generate and manage TTS audio

**Tasks:**
- [ ] Set up Rime/ElevenLabs TTS integration
- [ ] Create audio generation scripts
- [ ] Configure AWS S3 + CloudFront for storage
- [ ] Build audio preloading system

**Deliverable:** Audio generation and delivery pipeline

### 4. Minimum Viable Game Loop (3 days)
**Objective:** Complete playable first mission

**Tasks:**
- [ ] Integrate all components
- [ ] Add basic UI for mission flow
- [ ] Implement save/restore state
- [ ] Add progression unlocking

**Deliverable:** Playable first mission from start to finish

## Content Creation Decisions

### How to Structure Pimsleur Integration

**Option A: Direct Integration** (Recommended)
- Embed Pimsleur dialogue directly into Ink narrative
- Drake encounters situations requiring the exact phrases
- Example: Hotel check-in scene uses "Pardon, comprenez-vous l'anglais?"

**Option B: Abstracted Learning**
- Keep Pimsleur as separate "training module"
- Reference learned content in narrative scenes
- More flexibility but less immersive

### Exercise Placement Strategy

```ink
// Example structure in Ink
=== hotel_checkin ===
You approach the hotel desk. The clerk looks at you expectantly.

* [Greet the clerk]
  -> lesson_exercise("greeting_mcq") ->
  {exercise_result == "success":
    "Bonjour, monsieur," you say confidently.
    The clerk smiles. "Bonjour! Comment puis-je vous aider?"
  - else:
    Your pronunciation falters. The clerk's eyes narrow suspiciously.
    ~ cover_integrity -= 10
  }
```

### Gamification Integration

**Intel Points System:**
- Correct answers = +10 intel
- Perfect pronunciation = +5 bonus intel
- Intel unlocks: Side missions, character dossiers, equipment upgrades

**Optional Ops (Side Missions):**
- Café conversation practice
- Shopping district vocabulary
- Restaurant ordering scenarios
- Time-limited for urgency

## Research Questions Resolved

1. **Pimsleur vs. Other Methods?**
   - Use Pimsleur as primary structure
   - Supplement with Michel Thomas grammar explanations
   - Paul Noble's approach for cultural notes

2. **How Much Narrative vs. Learning?**
   - 20% narrative setup/consequences
   - 60% adapted Pimsleur content
   - 20% practice exercises

3. **Multiplayer/PvP Elements?**
   - V1: Local competitive modes only
   - "Handler Battle" - Two players compete as handlers
   - "Asset Race" - Who can recruit NPCs faster
   - Future: Online leaderboards, async challenges

## Final V1 Scope Definition

### Must Have (MVP)
1. First 5 missions (Pimsleur lessons 1-5)
2. Core exercise types implemented
3. Basic Cover Integrity system
4. Simple progression/unlocking
5. Narrative through first operation

### Nice to Have (Post-MVP)
1. Advanced gamification (equipment, upgrades)
2. Side missions/optional ops
3. Multiplayer modes
4. Additional languages
5. Voice acting (vs. TTS)

### Won't Have (V2+)
1. User-generated content
2. Social features
3. Advanced AI conversation
4. Procedural mission generation

## Development Sprint Plan

### Sprint 1 (Week 1): Foundation
- Set up Ink compilation pipeline
- Create first lesson in Ink
- Basic exercise components
- Initial app navigation

### Sprint 2 (Week 2): Core Loop
- Exercise evaluation system
- Cover Integrity mechanics
- Audio generation setup
- Mission complete flow

### Sprint 3 (Week 3): Content & Polish
- Create lessons 2-5
- Add progression system
- UI polish and animations
- Basic save/load system

### Sprint 4 (Week 4): Testing & Launch Prep
- Full playthrough testing
- Performance optimization
- Bug fixes
- App store preparation

## Summary

Your next concrete steps:
1. **Today:** Start writing `fr-C01-op01-u01-L-01.ink` combining narrative + Pimsleur 1
2. **Tomorrow:** Design exercise JSON schema and create first exercise set
3. **This Week:** Get first complete lesson playable in the app
4. **Next Week:** Expand to 5 lessons and polish core mechanics

The key is to start with ONE complete vertical slice - one mission that includes narrative setup, language lesson, exercises, and story consequences. Once that works, expanding to more content becomes straightforward.

Remember: The unique value proposition is the narrative integration. Pimsleur provides the proven learning structure, but YOUR innovation is making it feel like an exciting spy mission rather than a language drill. 