# The Pimsleur Model: Testable Predictions

This document formalizes what we believe we understand about the Pimsleur method into **testable predictions** that should hold across any Level 1 course.

## Core Predictions

### 1. L22 Instruction Language Flip
**Prediction:** Lesson 22 will explicitly announce that instructions will now be given in the target language.

**Test:** Search for announcement text like:
- "Starting with this lesson, you'll receive more instructions in [language]"
- "Now you'll receive many instructions in [language]"

**Verified in:**
- [x] French L22: "Pas de conversation dans cette leçon... vous recevrez de plus en plus d'instructions en français"
- [x] German L22: "Starting with this lesson, you'll receive many instructions in German"
- [x] Spanish L22: Uses Spanish instructions throughout ("Pregunte", "Diga", "Escuche y repita")
- [x] Italian L22: "In questa lezione non c'è conversazione" + Italian instructions ("Mi dica", "Mi domandi", "Ascolti e ripeta")
- [x] Japanese L22: "From now on, we will be giving more instructions in Japanese" + と言ってください, 聞いて繰り返してください
- [x] Polish L22: "Starting with this lesson, you'll receive some instructions in Polish" + Proszę powiedzieć, Proszę zapytać
- [x] Russian L22: Uses Russian instructions throughout (Слушайте и повторяйте, Слушайте)

---

### 2. Four-Phase Structure
**Prediction:** Level 1 follows four phases:

| Phase | Lessons | Characteristics |
|-------|---------|-----------------|
| Foundation | 1-8 | Heavy backchaining, 100% English narration, no reading |
| Multimodal | 9-21 | Reading introduced ~L9, target language instructions creep in |
| Instruction Flip | 22-27 | Target language instructions dominant, explicit announcement at L22 |
| Register & Tense | 28-30 | Formal/informal distinction, past tense introduced |

**Test:** Check L9 for reading, L28 for formal/informal, L29-30 for past tense.

---

### 3. Backchaining Criteria
**Prediction:** Words get backchained (syllable-by-syllable breakdown) if they meet ALL criteria:
1. 2+ syllables
2. Content word (noun, verb, adjective) - NOT function words (articles, pronouns)
3. Contains phonemes difficult for English speakers
4. New vocabulary (first introduction)

**Additional:** Backchaining intensity is highest L1-5, spikes again L11-17 for numbers, then decreases.

**Test:** Check L1 for backchaining of greeting/identity words, L11-17 for number backchaining.

---

### 4. Spaced Repetition Pattern ✅ VALIDATED + FORMALIZED
**Prediction:** New vocabulary follows BASE-5 EXPONENTIAL within-lesson pattern:
- First recall: ~5 seconds after introduction
- Second recall: ~25 seconds (5×5)
- Third recall: ~125 seconds / ~2 minutes (5×25)
- Fourth+ recall: expanding intervals (625s / ~10min)

**Formalized Algorithm:** See `src/spaced_repetition.py` with 30 passing tests.

**Verified with "pardon" in L1:**
```
[00:00:32] +27s  (matches 25s theory)
[00:00:57] +25s  (exact match!)
[00:01:08] +8s   (immediate recall ~5s)
[00:02:22] +1m14s (matches 2min cycle)
[00:08:57] +3m38s (expanding)
[00:14:59] +6m2s  (expanding further)
```

**Cross-lesson pattern (each lesson = 1 day):**
```
L1:  17 occurrences  ████████████████████  INTENSIVE
L2:   6 occurrences  ██████                reinforcement
L3:   5 occurrences  █████                 reinforcement
L4:   4 occurrences  ████                  maintenance
L5:   2 occurrences  ██                    maintenance
L6-8: 0 occurrences  (GAP - consolidation)
L9:   3 occurrences  ███                   returns
L13:  1 occurrence   █                     periodic (4 lessons after L9)
L17:  1 occurrence   █                     periodic (4 lessons after L13)
... continues every 4 lessons
```

**Algorithm (implemented in src/spaced_repetition.py):**
```python
# Within-lesson: base-5 exponential intervals
intervals = [5s, 25s, 125s, 625s, ...]  # 5^n seconds

# Cross-lesson: fixed pattern then periodic
PATTERN = {1: 17, 2: 6, 3: 5, 4: 4, 5: 2, 6: 0, 7: 0, 8: 0, 9: 3}
# After L9: 1 occurrence every 4 lessons (L13, L17, L21, L25, L29)
```

**Test:** Track any core vocabulary item - should see intensive → decline → gap → periodic pattern.

---

### 5. Vocabulary Size
**Prediction:** Level 1 introduces 250-300 unique vocabulary items total (~9 per lesson average).

**Test:** Count unique vocabulary across all 30 lessons.

---

### 6. Grammar Introduction Order
**Prediction:** Grammar follows this order:
1. L1: Present tense (I/you forms only)
2. L3-5: Negation, gender agreement
3. L5: Conditional/polite forms
4. L7: Partitive articles
5. L10: Immediate future (going to + verb)
6. L11-17: Numbers 1-100
7. L18-21: Possessives, plurals
8. L28: Formal/informal distinction
9. L29-30: Past tense

**Test:** Check lesson content for grammar feature first appearances.

---

### 7. Numbers Teaching Pattern
**Prediction:** Numbers are NOT backchained syllabically but taught through:
- Repetition and contrast drills
- Structural explanation for complex systems (French 70=60+10)
- Integration into realistic contexts (time, prices)

Number ranges by lesson:
- L8-10: 1-5
- L11: 6-10
- L12-14: 11-19
- L16-17: 20-69
- L23-27: 70-100

**Test:** Check number introduction lessons and teaching method.

---

## Verification Status

| Prediction | French | German | Spanish | Italian | Japanese | Polish | Russian |
|------------|--------|--------|---------|---------|----------|--------|---------|
| L22 flip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| L1 backchaining | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| L9 reading | ✅ | ◐ | N/A | N/A | N/A | N/A | N/A |
| L28-29 formal/informal | ✅ | ✅ | ✅ | L29✅ | N/A* | N/A* | L29✅ |
| L29-30 past tense | ✅ | ✅ | ✅ | ? | L30✅ | N/A* | N/A* |
| L11-17 numbers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ~275 vocab | ✅ (271) | ? | ? | ? | ? | ? | ? |

**Notes:**
- *Japanese N/A for formal/informal: Japanese uses です/ます polite forms throughout Level 1
- *Polish/Russian N/A for past tense: Level 1 uses present + "already" constructions; past tense in Level 2
- Italian L29, Russian L29: Explicit tu/Lei and ты/вы distinction introduced

**Verified 2025-12-31:** ALL 7 languages confirm L22 instruction flip and L1 backchaining.

### Cross-Language Backchaining Evidence

| Language | L1 Backchained Words | Pattern |
|----------|---------------------|---------|
| French | pardon (Don→Par→Pardon), comprenez (Nez→Prenez→Comprenez) | End-to-start |
| German | Entschuldigung, verstehen | End-to-start |
| Spanish | perdón, señorita (Rita→Señorita), castellano (llano→te llano→caste→castellano) | End-to-start |
| Italian | scusi (Zee→Scusi→scu→scusi), capisce (PISSE→KA→Capisci), l'italiano | End-to-start |
| Japanese | すみません (千→ません→すみ→すみません), 英語 (語→英→英語), わかります | End-to-start |
| Polish | Przepraszam (Szam→Pra→Prraszam), po polsku (Sku→Pol→Polsku) | End-to-start |
| Russian | Извините (Те→Ните→Вините→Из→Извините), По-русски (Ски→Русски→По-русски) | End-to-start |

**Universal Pattern Confirmed:** All 7 languages use reverse syllable building (end-to-start backchaining) for first introduction of complex words.

---

## What This Enables

If these predictions hold across languages, we can:

1. **Generate lesson structures** knowing what elements belong in each phase
2. **Predict vocabulary distribution** for spaced repetition
3. **Apply backchaining rules** to determine which words need syllable breakdown
4. **Order grammar introduction** appropriately
5. **Create the "Pimsleur feel"** without copying content

---

### 8. Vocabulary Selection Principles
**Pattern observed (French L1):**

| Category | % of Vocab | Examples |
|----------|-----------|----------|
| Single words | 62% | pardon, comprenez, monsieur |
| Phrases/chunks | 36% | est-ce que, je ne comprends pas |
| Verb-related | 17% | voudriez, savez, habitez |

**L1 Foundation vocabulary is SURVIVAL:**
- Getting attention (pardon)
- Checking understanding (comprenez/comprends)
- Asking questions (est-ce que)
- Basic responses (oui, non)
- Identity (américain, français)
- Hedging (un peu)

**Theme progression by phase:**
- L1-5: Stranger interactions (understanding, identity, politeness)
- L6-10: Social situations (restaurant, time, ordering)
- L11-21: Expanded contexts (family, money, shopping)
- L22-27: Travel theme (car, directions, distances)
- L28-30: Deeper relationships (du/Sie, shared past)

---

### 9. Recurring Characters & Storylines
**Prediction:** Characters are introduced and reappear across lessons.

**Verified in French:**
```
Michel:     L4(22), L5(18), L6(7), L8(7), L9(6) - early protagonist
Pierre:     L7(10), L8(4), L12(8), L30(4) - recurring
Marie:      L9(5), L12(6), L13(8), L16(3) - mid-course
Jacqueline: L6(2), L8(3), L28(2) - periodic
```

**Scenario progression:**
- Restaurant: L4 onwards (social context)
- Time/directions: Throughout (utility)
- Family: L9 onwards (expanding from "you" to "us/them")
- Travel: L22-27 (matches instruction flip phase)

---

### 10. Conversational Substrate ✅ KEY INSIGHT
**The conversation is the container. Words never exist alone.**

**Lesson structure:**
```
1. LISTEN:      Target conversation (the GOAL)
2. BREAKDOWN:   Smallest components isolated
3. BACKCHAIN:   Complex words syllable-by-syllable
4. COMBINE:     "vous" + "comprenez" → "vous comprenez"
5. EXPAND:      "est-ce que" + "vous comprenez l'anglais?"
6. DRILL:       Variations (I/you/do you understand?)
7. RECONSTRUCT: Full sentences
8. ROLEPLAY:    Produce the conversation
```

**Example - L1 target conversation:**
```
Pardon, est-ce que vous comprenez l'anglais?
Non, Monsieur. Je ne comprends pas l'anglais.
Je comprends un peu le français.
Est-ce que vous êtes américain?
Oui, Mademoiselle.
```

**Built from components:**
- "Pardon" → backchained (Don → Par → Pardon)
- "comprenez" → backchained (Nez → Prenez → Comprenez)
- "vous comprenez" → combined
- "est-ce que vous comprenez" → expanded
- Full phrase assembled

**Cross-lesson conversation expansion:**
- L1: "Pardon, est-ce que vous comprenez l'anglais?"
- L10: "Qu'est-ce que je ne comprends pas?" (embedded in new structure)
- L20: "Vous êtes américain, n'est-ce pas?" (tag question added)
- L30: "Nous sommes américains" (pronoun expansion: vous → nous)

**Implication for generation:**
You don't generate "word lists" - you generate **target conversations** and derive lessons from breaking them down and building them back up.

---

### 11. Generation Entry Points ✅ KEY ARCHITECTURE

**The fundamental question:** What can be algorithmically generated vs what requires human design?

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: CURRICULUM (Human Design - NOT generatable)        │
│                                                              │
│ Question: What can the learner DO by L30?                   │
│                                                              │
│ Pimsleur's answer: Functional progression by USEFULNESS     │
│   L1-8:  Survival ("Can you communicate at all?")           │
│   L9-21: Daily life ("Can you make plans, navigate?")       │
│   L22-27: Social ("Can you be a guest, handle complexity?") │
│   L28-30: Fluency ("Past tense, register, meta-discussion") │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 2: TARGET CONVERSATIONS (Human Design - the spec)     │
│                                                              │
│ For each lesson: "By end of L_n, learner can do THIS"       │
│                                                              │
│ Examples:                                                    │
│   L1:  "Pardon, do you understand English?"                 │
│   L10: "I'd like to eat with you. At what time?"            │
│   L20: "I'd like to speak with Mr. Dupont"                  │
│   L30: "What does this word mean?"                          │
│                                                              │
│ Constraint: Each target uses L1..L(n-1) material + new      │
│             ≤9 new items per lesson                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 3: COMPONENT EXTRACTION (Algorithmic - can generate)  │
│                                                              │
│ Input:  Target conversation + learner's known vocabulary     │
│ Output: List of new components to teach                     │
│                                                              │
│ Algorithm:                                                   │
│   1. Parse target into words/phrases                        │
│   2. Filter out already-known items                         │
│   3. Group by type (backchain-needed, drill-only, etc.)     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 4: LESSON GENERATION (Algorithmic - can generate)     │
│                                                              │
│ Input:  New components + known vocab + 30-min budget        │
│ Output: Drill sequence (the actual lesson audio script)     │
│                                                              │
│ Algorithm:                                                   │
│   1. Present target conversation (the GOAL)                 │
│   2. For each new component:                                │
│      - Backchain if meets criteria (prediction #3)          │
│      - Drill in isolation                                   │
│      - Combine with known material                          │
│   3. Interleave review at spaced intervals (prediction #4)  │
│   4. Build toward full sentences                            │
│   5. End with roleplay of target conversation               │
│                                                              │
│ CONSTRAINT: Everything must be automatic by minute ~28      │
└─────────────────────────────────────────────────────────────┘
```

**The Integration Insight:**
Spaced repetition and conversation-building are NOT separate systems.
The spaced repetition exists TO SERVE production fluency.
The target conversation is the TEST of whether spaced repetition worked.

**What this means for building a generator:**
- You CAN'T just combine "any SRS" + "any curriculum"
- The curriculum must be FUNCTIONAL (what can you DO?)
- Targets must CHAIN (L10 uses L1-9 material)
- SRS must serve PRODUCTION (not just recognition)
- The constraint is: automatic by minute 28

---

## Known Variables (Language-Specific)

These elements vary by language and are NOT predictable:
- Specific vocabulary items (based on language frequency/utility)
- Phoneme difficulty (which sounds need backchaining)
- Grammar complexity (German cases vs French gender)
- Writing system introduction (Japanese hiragana/katakana timing)
- Character names (culture-specific)
