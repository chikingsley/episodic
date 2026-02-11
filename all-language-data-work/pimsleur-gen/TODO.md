# Pimsleur Reverse Engineering - Status

**Last updated:** February 8, 2026

---

## Current State: Model Validated Across 7 Languages ✅

We have a **testable Pimsleur model** that predicts course structure. Verified across **ALL 7 languages**: French, German, Spanish, Italian, Japanese, Polish, Russian.

**Key document:** `PIMSLEUR_MODEL.md`

---

## What We Have

| Component | Status | File |
|-----------|--------|------|
| 11 testable predictions | ✅ Verified (7 languages) | `PIMSLEUR_MODEL.md` |
| 220 passing tests | ✅ Complete | `tests/` |
| Cross-language verification | ✅ Complete (50 tests) | `tests/test_cross_language.py` |
| Spaced repetition algorithm | ✅ Formalized (30 tests) | `src/spaced_repetition.py` |
| Drill patterns | ✅ Formalized (32 tests) | `src/drill_patterns.py` |
| French metrics (30 lessons) | ✅ Complete | `data/french_lesson_metrics.json` |
| Parser + tests | ✅ Working | `src/parser.py`, `tests/` |
| Backchaining criteria | ✅ Verified across 7 languages | See model |

---

## Universal Patterns (Verified Across 7 Languages)

| Pattern | Status | Evidence |
|---------|--------|----------|
| L22 instruction flip | ✅ 7/7 | All languages switch to target language instructions |
| L1 backchaining | ✅ 7/7 | All use end-to-start syllable building |
| "Excuse me" first | ✅ 7/7 | Universal first phrase taught |
| "Understand" early | ✅ 7/7 | Taught in L1 across all languages |
| "American" identity | ✅ 7/7 | All teach "I am American" in L1 |
| Yes/No basics | ✅ 7/7 | All teach yes/no in L1 |

---

## Critical Gap Identified: Level 1 Only ⚠️

All analysis below covers **Level 1 only** (30 of 150 total lessons). The model, tests, and algorithms describe the *bootstrapping protocol* for beginners. Levels 2-5 operate differently:

- Four-phase structure (Foundation/Multimodal/Flip/Register) is **Level 1 only** -- does NOT repeat
- L22 instruction flip is **Level 1 only** -- Level 2+ uses French instructions from Unit 1
- Heavy backchaining is **Level 1 only** -- essentially disappears by Level 2
- The system is actually a three-stage progression: Bootstrap (L1 early) → Scaffold (L1 late + L2) → Immersion (L3-5)

See `CROSS_LEVEL_ANALYSIS.md` for full findings.

---

## Reverse Engineering: Level 1 COMPLETE ✅ | Levels 2-5: GAPS IDENTIFIED

The Pimsleur method has been reverse engineered for Level 1 across 7 languages:

### Core Algorithms (Formalized with Tests)

1. **Spaced Repetition** - `src/spaced_repetition.py` (30 tests)
   - Within-lesson: Base-5 exponential (5s → 25s → 125s → 625s)
   - Cross-lesson: {L1: 17, L2: 6, L3: 5, L4: 4, L5: 2, L6-8: gap, L9: 3, then periodic every 4 lessons}
   - Algorithm is precise enough to GENERATE correct schedules

2. **Drill Patterns** - `src/drill_patterns.py` (32 tests)
   - 8-phase drill structure (LISTEN → BREAKDOWN → BACKCHAIN → COMBINE → EXPAND → DRILL → RECONSTRUCT → ROLEPLAY)
   - 15+ prompt types identified with pattern matching
   - Target language markers for all 7 languages
   - Lesson structure by phase (Foundation L1-8, Multimodal L9-21, Instruction Flip L22-27, Register/Tense L28-30)

3. **Cross-Language Verification** - `tests/test_cross_language.py` (50 tests)
   - Universal patterns verified across French, German, Spanish, Italian, Japanese, Polish, Russian
   - L22 instruction flip: 7/7 languages
   - L1 backchaining: 7/7 languages
   - Universal L1 content: 7/7 languages

---

## What's Needed for GENERATION (Next Phase)

### High Priority

1. **Cross-level understanding** ✅ DONE → `CROSS_LEVEL_ANALYSIS.md`
   - Three-stage system: Bootstrap → Scaffold → Immersion
   - Four-phase structure and L22 flip do NOT repeat in higher levels
   - Backchaining essentially disappears after Level 1

2. **Cross-level vocabulary tracking** ✅ DONE → `scripts/extract_vocabulary.py`
   - 370 words persist across ALL 5 levels (permanent core)
   - ~54-65% carryover between consecutive levels
   - Cumulative growth: 1,080 → 1,880 → 2,515 → 3,842 → 5,375

3. **Grammar staircase formalization** ✅ DONE → `GRAMMAR_STAIRCASE.md`
   - Complete matrix of grammar structures across all 5 levels
   - CEFR mapping for each structure
   - 7 "handle constructions" identified as curriculum drivers
   - Cross-referenced with Speak and Duolingo data

4. **Vocabulary selection principles** ✅ DONE → `VOCABULARY_SELECTION.md`
   - 10 selection principles identified (meta-communication first, formal register, function over frequency, handle-construction-driven, conversation-embeddable, progressive context, numbers as infrastructure, grammar through vocabulary, cognitive load management, cultural appropriateness)
   - 285 items categorized by theme across 30 lessons
   - Cross-method comparison: Pimsleur vs Speak vs Duolingo vocabulary priorities
   - Actionable framework for vocabulary selection in new languages

5. **Simplified drill structure for Levels 2-5** ✅ DONE → `DRILL_STRUCTURE_L2_L5.md`
   - L1: 8-phase model (full breakdown/backchain/reconstruct)
   - L2: 4-phase scaffold (conversation → highlight → drill-cycle → scenario)
   - L3: 3-phase immersion (conversation → drill-cycle → scenarios)
   - L4: 2-phase advanced (conversation → drill-scenario merged)
   - L5: 1-phase near-native (immersive practice, drill=conversation)
   - Constants identified: opening conversation, prompt-pause-confirm, SRS, scenarios, 30min

6. **Build generator prototype** ✅ DONE → `src/generator.py` (53 tests)
   - `CourseGenerator` class: vocabulary list + target level → full course plan
   - Three teaching modes: Bootstrap (L1) → Scaffold (L2) → Immersion (L3-5)
   - Five drill modes: 8-phase → 4-phase → 3-phase → 2-phase → 1-phase
   - SRS integration via `spaced_repetition.py` for review scheduling
   - Vocabulary assignment by theme following progressive context expansion
   - English instruction %, backchaining count, reading section curves per level
   - Sample French L1 vocabulary (~54 items) for demonstration

### Remaining

7. **Effectiveness testing**
   - Do generated lessons actually teach?
   - User testing required
   - **Low priority** — requires actual human learners

---

## Quick Reference

```bash
# Run all 220 tests
uv run pytest

# Run linting
uv run ruff check .

# Run type checking
uv run ty check

# View French metrics
cat data/french_lesson_metrics.json | python -m json.tool | head -100
```

---

## File Structure

```
pimsleur-gen/
├── PIMSLEUR_MODEL.md          # Key doc: 11 testable predictions (Level 1 only)
├── CROSS_LEVEL_ANALYSIS.md    # What changes from Level 1 to Level 5
├── GRAMMAR_STAIRCASE.md       # Grammar progression across all 5 levels
├── VOCABULARY_SELECTION.md    # 10 vocabulary selection principles
├── DRILL_STRUCTURE_L2_L5.md   # How drill model simplifies L2-L5
├── RESEARCH_FINDINGS.md       # Detailed French Level 1 evidence
├── TODO.md                    # This file
├── data/
│   └── french_lesson_metrics.json  # Ground truth metrics
├── src/
│   ├── models.py              # Pydantic models (Lesson, Utterance)
│   ├── parser.py              # Transcript parser
│   ├── spaced_repetition.py   # Formalized SRS algorithm (30 tests)
│   ├── drill_patterns.py      # 8-phase drill structure (32 tests)
│   └── generator.py           # Course generator prototype (53 tests)
├── tests/
│   ├── test_cross_language.py     # 50 tests for 7-language verification
│   ├── test_spaced_repetition.py  # 30 tests for SRS algorithm
│   ├── test_drill_patterns.py     # 32 tests for drill patterns
│   ├── test_generator.py          # 53 tests for course generator
│   ├── test_real_data.py          # French transcript tests
│   ├── test_parser.py             # Parser tests
│   └── test_models.py             # Model tests
├── research-data/             # 7 languages of transcripts (210 lessons)
│   ├── french/                # 30 timestamped transcripts
│   ├── german/                # 29 lessons (missing L14)
│   ├── spanish/               # 30 lessons
│   ├── italian/               # 30 lessons
│   ├── japanese/              # 30 lessons
│   ├── polish/                # 30 lessons
│   └── russian/               # 30 lessons
└── archive/                   # Old/deprecated code
```
