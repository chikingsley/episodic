# Pimsleur Reverse Engineering - Status

**Last updated:** February 6, 2026

---

## Current State: Model Validated Across 7 Languages ✅

We have a **testable Pimsleur model** that predicts course structure. Verified across **ALL 7 languages**: French, German, Spanish, Italian, Japanese, Polish, Russian.

**Key document:** `PIMSLEUR_MODEL.md`

---

## What We Have

| Component | Status | File |
|-----------|--------|------|
| 11 testable predictions | ✅ Verified (7 languages) | `PIMSLEUR_MODEL.md` |
| 167 passing tests | ✅ Complete | `tests/` |
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

1. **Cross-level understanding** ✅ STARTED → `CROSS_LEVEL_ANALYSIS.md`
   - Current model only describes Level 1 (the bootstrapping protocol)
   - Levels 2-5 operate in a different mode (scaffolding → immersion)
   - Four-phase structure and L22 flip do NOT repeat in higher levels
   - Backchaining essentially disappears after Level 1

2. **Cross-level vocabulary tracking**
   - Extract vocabulary lists from all 5 level transcripts
   - Track overlap between consecutive levels
   - Identify "permanent" vocabulary that persists across all levels
   - Quantify total unique words per level

3. **Grammar staircase formalization**
   - Map grammar structures to specific levels across all 5
   - When introduced vs when "mastered" (used without English prompting)
   - Map to CEFR expectations
   - Determine what's universal vs language-specific

### Medium Priority

4. **Vocabulary selection principles**
   - We have 271 French words for Level 1. Why these words?
   - Compare to frequency lists
   - Identify selection criteria

5. **Simplified drill structure for Levels 2-5**
   - The 8-phase drill model is Level 1 specific
   - Document the simpler structure used in later levels
   - More roleplay, longer conversations, less breakdown

6. **Build generator prototype**
   - Input: vocabulary list, grammar points, target level
   - Output: lesson structure with scaffolding schedule
   - Must handle different modes: bootstrap (L1) vs scaffold (L2) vs immersion (L3-5)
   - Use spaced_repetition.py and drill_patterns.py

### Low Priority

7. **Effectiveness testing**
   - Do generated lessons actually teach?
   - User testing required

---

## Quick Reference

```bash
# Run all 167 tests
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
├── CROSS_LEVEL_ANALYSIS.md    # NEW: What changes from Level 1 to Level 5
├── RESEARCH_FINDINGS.md       # Detailed French Level 1 evidence
├── TODO.md                    # This file
├── data/
│   └── french_lesson_metrics.json  # Ground truth metrics
├── src/
│   ├── models.py              # Pydantic models (Lesson, Utterance)
│   ├── parser.py              # Transcript parser
│   ├── spaced_repetition.py   # Formalized SRS algorithm (30 tests)
│   └── drill_patterns.py      # 8-phase drill structure (32 tests)
├── tests/
│   ├── test_cross_language.py     # 50 tests for 7-language verification
│   ├── test_spaced_repetition.py  # 30 tests for SRS algorithm
│   ├── test_drill_patterns.py     # 32 tests for drill patterns
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
