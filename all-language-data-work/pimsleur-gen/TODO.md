# Pimsleur Reverse Engineering - Status

**Last updated:** December 31, 2025

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

## Reverse Engineering: COMPLETE ✅

The Pimsleur method has been fully reverse engineered across 7 languages:

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

### Medium Priority

1. **Vocabulary selection principles**
   - We have 271 French words. Why these words?
   - Compare to frequency lists
   - Identify selection criteria

2. **Build generator prototype**
   - Input: vocabulary list, grammar points
   - Output: lesson structure with scaffolding schedule
   - Use spaced_repetition.py and drill_patterns.py

### Low Priority

3. **Effectiveness testing**
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
├── PIMSLEUR_MODEL.md          # Key doc: 11 testable predictions
├── RESEARCH_FINDINGS.md       # Detailed French evidence
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
