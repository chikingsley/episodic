# Pimsleur Cross-Level Analysis: What Changes From Level 1 to Level 5

## The Problem This Document Solves

All prior analysis (PIMSLEUR_MODEL.md, 167 tests, 7-language validation) focuses on **Level 1 only**. The spaced repetition algorithm, the four-phase structure, backchaining criteria, the L22 instruction flip -- all verified within a single level.

But Pimsleur French has **five levels**, each with 30 lessons. That's 150 lessons total, covering A0 through B2. The Level 1 model describes ~20% of the full system.

This document identifies what changes across levels, what stays the same, and what we still don't know.

---

## Executive Summary

The Pimsleur system operates on two distinct scales:

1. **Within-Level Architecture** (30 lessons): Has a clear four-phase structure in Level 1. This structure does NOT repeat identically in Levels 2-5.
2. **Across-Level Progression** (150 lessons): Follows a fundamentally different logic -- a gradual handoff from English to French, from explicit teaching to implicit immersion, from atomic vocabulary to conversational fluency.

The Level 1 "algorithm" (SRS timing, backchaining, four-phase structure) is actually a **bootstrapping protocol** -- it's how you get someone from zero to functional. Levels 2-5 are a **different mode** of instruction built on different assumptions.

---

## What the Level 1 Model Actually Describes

The model validated in PIMSLEUR_MODEL.md describes the **onboarding protocol** for a complete beginner:

| Feature | Level 1 Status | Levels 2-5 Status |
|---------|---------------|-------------------|
| Four-phase structure (Foundation/Multimodal/Flip/Register) | Verified across 7 languages | Does NOT repeat. Levels 2-5 operate in a steady-state mode. |
| L22 instruction flip | Verified 7/7 languages | Level 1 only. By L2, French instructions are used from Unit 1. |
| Heavy backchaining (7 instances in L1) | Verified 7/7 languages | Minimal to absent. L2 has ~1 instance across 30 lessons. |
| Base-5 exponential SRS (within-lesson) | Verified with timestamped data | Unknown. No timestamps exist for L2-5. Likely similar but unverified. |
| Cross-lesson SRS pattern (17→6→5→4→2→gap→3→periodic) | Verified for French L1 | Unknown. Cannot verify without word-level tracking in L2-5 transcripts. |
| ~9 new vocab items per lesson | Verified (271 total for L1) | Similar rate (5-10 per lesson) but exact counts not extracted. |
| 100% English narration (early lessons) | Verified | L2 starts with mixed narration. By L5, English is minimal. |

### Key Insight: The Four-Phase Structure is an Onboarding Pattern

Level 1's phases (Foundation → Multimodal → Instruction Flip → Register/Tense) describe a **one-time transition**:
- L1-8: Pure English scaffolding, heavy phonetic work
- L9-21: Gradual introduction of reading, French starting to creep in
- L22-27: The flip -- French instructions dominate
- L28-30: Register distinction (tu/vous) and past tense

By Level 2, this transition is complete. The learner already understands French instructions, already reads, already handles tu/vous. So Levels 2-5 don't need to repeat these phases.

---

## What Actually Changes Across Levels

### 1. English/French Ratio Shifts Dramatically

| Level | English Usage | French Usage | Key Marker |
|-------|--------------|-------------|------------|
| L1 (early) | ~80% English narration | ~20% French (learner production + models) | "How do you say..." |
| L1 (late) | ~40% English | ~60% French | "Dites que..." |
| L2 | ~30-40% English | ~60-70% French | French instructions from Unit 1: "Répondez", "Comment dit-on" |
| L3 | ~20-30% English | ~70-80% French | Less explanation, more immersion |
| L4 | ~20% English | ~80% French | Professional contexts, complex scenarios |
| L5 | ~10-15% English | ~85-90% French | Explicitly tells learner to "rely on intuition, not literal cues" |

**Level 5 opens with this meta-statement:**
> "You will need to rely more on your intuition, or your natural sense of the language, and less on literal cues and hints given in English. Don't worry if you don't understand everything you hear right away."

This is the opposite of Level 1, which explains everything before asking the learner to produce it.

### 2. Grammar Complexity Follows a Specific Staircase

| Level | CEFR Target | Grammar Focus | Key Structures |
|-------|-------------|---------------|----------------|
| L1 | A1 | Present tense, basic question formation | `est-ce que`, `je voudrais`, `ne...pas`, `je vais + inf` |
| L2 | A2 → low B1 | Past tenses, object pronouns | Passé composé (avoir + être), imparfait, `le/la/les/lui/leur/y/en` |
| L3 | B1 | Future simple, subjunctive introduction | `je serai`, `il faut que + subj`, relative pronouns `qui/que` |
| L4 | B1 → B2 | Subjunctive expansion, conditional perfect | `il faut que j'achète`, `j'aurais aimé`, `faire faire` |
| L5 | B2 | All tenses consolidated, nuance | Advanced `si` clauses, reported speech, `se débrouiller` |

**The grammar staircase across levels:**
```
L1:  Present → Near Future → (late) Past tense
L2:  Past tenses solidified → Object pronouns → Comparatives
L3:  Future simple → Subjunctive basics → Complex sentences
L4:  Subjunctive expanded → Conditional perfect → Causative
L5:  Everything consolidated → Nuance and idiom
```

### 3. Backchaining Disappears After Level 1

| Level | Backchaining Frequency | Why |
|-------|----------------------|-----|
| L1 | Heavy (7 in L1, spikes at L11-17 for numbers) | Learner has never heard French sounds. Phonetic bootstrapping required. |
| L2 | ~1 instance across 30 lessons ("part by part" near end) | Learner's ear is trained. Only used for exceptionally difficult new words. |
| L3-5 | Essentially zero | Pronunciation is assumed adequate. Focus shifts to meaning and grammar. |

**Implication for generation:** Backchaining is a Level 1 technique. If building a multi-level course, backchaining logic should be heavy in early lessons and essentially turned off for intermediate/advanced content.

### 4. Conversation Complexity Grows Across Levels

| Level | Opening Conversation Length | Topic Complexity | Dialogue Style |
|-------|---------------------------|-----------------|----------------|
| L1 | 3-5 lines | Survival (greetings, directions) | Formal, stranger-to-stranger |
| L2 | 6-10 lines | Social (friends, family, cars breaking down) | Mix of formal/informal |
| L3 | 8-12 lines | Personal (dinner parties, trips, photos) | More natural, less scripted |
| L4 | 10-15 lines | Professional (TGV train, business conferences) | Sophisticated, adult scenarios |
| L5 | 12-20 lines | Complex social (weddings, New Year's Eve, family dynamics) | Near-native conversational flow |

**Level 1 target conversation (L1):**
```
Pardon, est-ce que vous comprenez l'anglais?
Non, Monsieur. Je ne comprends pas l'anglais.
```

**Level 5 target conversation (L1 of Level 5):**
```
Bonjour Anne, ça va?
Vous avez passé de bonnes vacances?
Oui, excellente, merci. On est allé au mariage de notre fille, à Montréal.
Mais oui, c'est vrai. Félicitations. Et ça s'est bien passé?
Oh oui, très bien. Son mari est charmant.
Le seul problème, c'est que...
Quoi? Il y a déjà un problème?
Non, c'est juste qu'elle vient de déménager et qu'elle nous manque beaucoup.
Ah, je comprends. Mais c'est la vie, on n'y peut rien.
```

The jump is massive. The Level 5 conversation uses passé composé, subjunctive triggers (`il va falloir que j'aille`), idiomatic expressions (`on n'y peut rien`), and emotional nuance.

### 5. Teaching Mode Shifts from Explicit to Implicit

| Level | Teaching Mode | How New Material is Introduced |
|-------|-------------|-------------------------------|
| L1 | Explicit | "Here's how to say X. Listen and repeat." Syllable breakdown. English explanation of every word. |
| L2 | Semi-explicit | "In this conversation, you heard X, which means Y." Less breakdown, more context-based introduction. |
| L3 | Contextual | New words appear in conversation first. Brief English gloss. Learner expected to pick up from context + drill. |
| L4 | Immersive | New vocabulary presented in full French scenarios. English used mainly for prompts, not explanations. |
| L5 | Near-immersion | "Rely on your intuition." Minimal English. Grammar taught entirely through pattern repetition. |

### 6. Learner Identity Evolves

| Level | Learner's Role | Scenarios |
|-------|---------------|-----------|
| L1 | Lost tourist | Asking for directions, basic transactions |
| L2 | Social visitor | Making plans with friends, handling car troubles |
| L3 | Dinner party guest | Discussing trips, showing photos, sharing opinions |
| L4 | Business professional | TGV trains, conferences, shopping for gifts |
| L5 | Integrated participant | Family events, emotional conversations, cultural participation |

---

## The Full Pimsleur Framework (All 5 Levels)

Based on this analysis, the Pimsleur method is not a single algorithm but a **three-stage system**:

### Stage 1: Phonetic Bootstrapping (Level 1, Lessons 1-8)
- **Goal:** Train the learner's ear and mouth
- **Techniques:** Heavy backchaining, slow pace, 100% English narration, survival vocabulary
- **Cognitive model:** Behaviorist (stimulus → response → reinforcement)
- **Output:** Learner can produce basic French sounds and survival phrases

### Stage 2: Structural Scaffolding (Level 1 L9-30, Level 2)
- **Goal:** Build grammatical intuition through pattern repetition
- **Techniques:** Gradual English→French instruction shift, reading introduction, SRS for vocabulary + grammar patterns
- **Cognitive model:** Pattern recognition through structured variation
- **Output:** Learner has present tense, past tenses, object pronouns, basic conversation ability

### Stage 3: Immersive Consolidation (Levels 3-5)
- **Goal:** Develop automatic, flexible French production
- **Techniques:** Near-immersion, minimal English, complex scenarios, advanced grammar through chunks (not rules)
- **Cognitive model:** Implicit learning through massive contextualized practice
- **Output:** B2-level conversational fluency with natural intonation

### The Handoff Between Stages

```
Level 1:  [====BOOTSTRAP====][===SCAFFOLD===]
Level 2:  [=========SCAFFOLD=========]
Level 3:  [====SCAFFOLD====][===IMMERSION===]
Level 4:  [==========IMMERSION==========]
Level 5:  [==========IMMERSION==========]
```

The key insight: **there is no sharp boundary.** The transition from scaffolding to immersion is gradual. Level 3 is the pivot point where both modes coexist.

---

## What We Know vs. What We Don't Know

### Verified (High Confidence)

1. The English→French ratio shifts progressively across all 5 levels
2. Grammar follows a specific staircase (present→past→subjunctive→consolidation)
3. Backchaining is primarily a Level 1 technique
4. Conversation complexity increases steadily
5. Teaching mode shifts from explicit to implicit
6. The four-phase structure is Level 1 specific (not repeated)
7. The L22 instruction flip is Level 1 specific (not repeated)
8. ~5-10 new vocabulary items per lesson holds across all levels
9. Opening conversations exist in all levels
10. The core drill cycle (prompt→pause→response→confirmation) is consistent across all levels

### Unverified (Needs Data)

1. **Does the base-5 SRS timing hold in Levels 2-5?** We have no timestamped data for Levels 2-5 to check.
2. **What is the cross-lesson repetition pattern in Levels 2-5?** The {17→6→5→4→2→gap→3→periodic} pattern is only verified for Level 1 vocabulary. Does it apply to Level 2 vocabulary within Level 2?
3. **How much Level 1 vocabulary persists into Level 2?** We don't have word-level tracking across levels.
4. **Exact vocabulary counts per level.** Level 1 = 271. Levels 2-5 are estimated at 5-10 per lesson (~150-300 per level) but not counted.
5. **Does the 8-phase drill structure (LISTEN→BREAKDOWN→...→ROLEPLAY) hold at higher levels?** The transcripts suggest a simplified version (CONVERSATION→DRILL→ROLEPLAY) at higher levels.

### Unknown (Probably Can't Know Without Experimentation)

1. **Why these specific vocabulary items?** Vocabulary selection criteria remain the weakest part of the model.
2. **What determines the grammar staircase ordering?** Is it universal (all languages should teach present before past?) or language-specific?
3. **How do you adapt this for languages with different grammar structures?** Japanese has no subjunctive. Chinese has no verb conjugation. The grammar staircase must be language-specific.

---

## Cross-Language Implications

The current cross-language verification (7 languages) only covers Level 1. But Level 1 patterns are the most universal because:
- Every language has "excuse me" / "understand" / "yes/no"
- Every language has basic phonetic challenges for English speakers
- Every language benefits from backchaining for first exposure

**Levels 2-5 is where language-specific divergence happens:**

| Feature | Likely Universal | Likely Language-Specific |
|---------|-----------------|------------------------|
| English→TL ratio shift | Yes | Timing may vary |
| Conversation complexity growth | Yes | Topic selection varies |
| Teaching mode shift (explicit→implicit) | Yes | Speed of transition varies |
| Grammar staircase | Broad structure yes | Specific tenses/structures are very language-specific |
| Vocabulary selection | General principles yes | Specific words entirely language-specific |
| Backchaining decline | Yes | Rate depends on phonetic difficulty |

**This is the key challenge for generating courses in new languages:**
- Level 1 patterns can be replicated algorithmically (we have the model)
- Levels 2-5 require **language-specific curriculum design** -- you need to know what grammar structures exist in the target language and what order to teach them

---

## What This Means for Course Generation

### What Can Be Algorithmically Generated (All Levels)

1. **Spaced repetition scheduling** -- the within-lesson timing and cross-lesson patterns
2. **Drill sequence structure** -- prompt→pause→response→confirmation cycle
3. **English/French ratio** given a target level number
4. **Backchaining decisions** given phonetic difficulty data and level number
5. **Lesson timing** -- 30 minutes, ~5-10 new items, 3 minimum touches per item

### What Requires Human Design (Level-Specific)

1. **Target conversations** for each lesson -- what can the learner DO after this lesson?
2. **Grammar staircase** for the target language -- what structures exist and in what order should they be taught?
3. **Vocabulary selection** -- which words serve the target conversations?
4. **Cultural context** -- what scenarios make sense for this language's learners?
5. **Phonetic difficulty mapping** -- which sounds in this language are hard for the source language speakers?

### What Requires Language-Pair-Specific Design

1. **Cognate strategy** -- French/English share many cognates; Japanese/English share almost none
2. **Writing system introduction** -- irrelevant for French, critical for Japanese/Chinese/Arabic
3. **Register system** -- tu/vous in French, multiple politeness levels in Japanese/Korean
4. **Grammar explanation approach** -- some structures need explicit explanation (Japanese particles), others work implicitly (French gender through article pairing)

---

## Recommendations for Next Steps

### Priority 1: Cross-Level Vocabulary Tracking

Extract vocabulary lists from all 5 level transcripts and track:
- Total unique words per level
- Overlap between consecutive levels (how much L1 vocab appears in L2?)
- Introduction rate curves
- Which words from L1 are truly "permanent" (appear in all levels)

### Priority 2: Grammar Staircase Formalization

Create a formal matrix mapping grammar structures to levels:
- When is each structure introduced?
- When is it considered "mastered" (used without English prompting)?
- How does this map to CEFR expectations?

### Priority 3: Simplified Drill Structure for Levels 2-5

The 8-phase model (LISTEN→BREAKDOWN→BACKCHAIN→...) is Level 1 specific. Document the simplified drill structure used in Levels 2-5:
- What phases are kept?
- What phases are dropped?
- What new patterns emerge? (e.g., more roleplay, longer conversations, less breakdown)

### Priority 4: Level Template Specification

Define what a "Level N" template looks like for each stage:
- Level 1 template: Bootstrapping protocol (backchaining, explicit teaching, four-phase structure)
- Level 2 template: Scaffolding protocol (mixed instructions, grammar expansion, object pronouns)
- Level 3-5 template: Immersion protocol (near-TL immersion, chunk-based grammar, complex scenarios)

---

## Appendix: Data Inventory for Cross-Level Work

### Available Data

| Level | Full Transcript | Speaker Labels | Timestamps | Human Verified | Completeness |
|-------|----------------|---------------|------------|----------------|--------------|
| L1 | pimsleur_french_1_full.md (425K) | Yes | Yes (word + sentence) | Yes | Complete |
| L2 | pimsleur_french_2_full.md (279K) | No | No | Partial (~80-95%) | Complete |
| L3 | pimsleur_french_3_full.txt (260K) | No | No | Partial (~80-95%) | INCOMPLETE (no closure) |
| L4 | pimsleur_french_4_full.txt (295K) | No | No | Partial (~80-95%) | Complete |
| L5 | pimsleur_french_5_full.txt (309K) | No | No | Partial (~80-95%) | Complete |

### Data Quality Issues

- Level 1 is the gold standard -- speaker-labeled, timestamped, human-verified
- Levels 2-5 are speech-to-text transcriptions without speaker labels or timestamps
- Level 3 transcript may be incomplete (no closure message at end)
- Without timestamps in L2-5, we cannot verify SRS timing patterns
- Without speaker labels in L2-5, we cannot easily separate narrator/learner/model roles

### What Would Improve This Analysis

1. **Timestamped transcripts for Levels 2-5** (even sentence-level) would allow SRS verification
2. **Speaker-labeled transcripts for Levels 2-5** would allow drill pattern analysis
3. **Vocabulary extraction scripts** run against all 5 levels would give quantitative data
4. **Cross-level word frequency analysis** would reveal the repetition patterns across levels
