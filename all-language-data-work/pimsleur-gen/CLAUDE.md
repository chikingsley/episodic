# CLAUDE.md

## Project Goal

Understand how Pimsleur structures their language lessons so we can generate custom lessons with personalized topics.

**The simple question**: What happens in a Pimsleur lesson, minute by minute, and how does that change from Lesson 1 to Lesson 150?

## Current Status (Feb 2026)

**Level 1 model validated across ALL 7 languages.** 11 testable predictions verified with 220 passing tests.

**Critical finding:** All analysis covers Level 1 only (30 of 150 total lessons). Levels 2-5 operate in a fundamentally different mode. The four-phase structure, L22 instruction flip, and heavy backchaining are Level 1-specific bootstrapping patterns that do NOT repeat in later levels. The real system is a three-stage progression: Bootstrap → Scaffold → Immersion.

**Key documents:**
- `PIMSLEUR_MODEL.md` - Testable predictions (Level 1 only)
- `CROSS_LEVEL_ANALYSIS.md` - What changes from Level 1 to Level 5
- `GRAMMAR_STAIRCASE.md` - Grammar progression all 5 levels with CEFR mapping
- `VOCABULARY_SELECTION.md` - 10 vocabulary selection principles + cross-method comparison
- `DRILL_STRUCTURE_L2_L5.md` - How the 8-phase drill model simplifies across levels
- `VALIDATION_SCORECARD.md` - Test results and confidence levels

### The Pimsleur Model (Verified Across 7 Languages)

| Prediction | FR | DE | ES | IT | JP | PL | RU |
|------------|----|----|----|----|----|----|-----|
| L22 instruction flip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| L1 backchaining | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| L9 reading intro | ✅ | ◐ | N/A | N/A | N/A | N/A | N/A |
| L28-29 formal/informal | ✅ | ✅ | ✅ | L29 | N/A | N/A | L29 |
| L29-30 past tense | ✅ | ✅ | ✅ | ? | L30 | N/A | N/A |
| L11-17 numbers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

*N/A = Not applicable in Level 1 (language-specific)*

### Key Insights
- **Spaced repetition:** Base-5 exponential (5s → 25s → 2min → 10min) - FORMALIZED in `src/spaced_repetition.py`
- **Backchaining criteria:** 2+ syllables + content word + difficult phonemes + new vocab
- **271 vocabulary items** in French Level 1 (~9 per lesson)
- **Universal L1 content:** "excuse me", "understand", "yes/no", "I am American"

## Project Structure

```text
pimsleur-gen/
├── PIMSLEUR_MODEL.md              # Testable predictions (Level 1 only, 11 predictions)
├── CROSS_LEVEL_ANALYSIS.md        # What changes from Level 1 to Level 5
├── GRAMMAR_STAIRCASE.md           # Grammar progression all 5 levels
├── VOCABULARY_SELECTION.md        # 10 vocabulary selection principles
├── DRILL_STRUCTURE_L2_L5.md       # Drill model simplification L2-L5
├── RESEARCH_FINDINGS.md           # Detailed French Level 1 evidence
├── VALIDATION_SCORECARD.md        # Test results and confidence levels
├── TODO.md                        # Current roadmap
├── data/
│   └── french_lesson_metrics.json # Ground truth metrics (30 lessons)
├── src/
│   ├── models.py                  # Pydantic models (Lesson, Utterance)
│   ├── parser.py                  # Parse transcripts into models
│   ├── spaced_repetition.py       # Formalized SRS algorithm
│   ├── drill_patterns.py          # 8-phase drill structure (Level 1)
│   └── generator.py              # Course generator prototype
├── tests/                         # 220 tests
│   ├── test_cross_language.py     # 50 tests for 7-language verification
│   ├── test_spaced_repetition.py  # 30 tests for SRS algorithm
│   ├── test_generator.py          # 53 tests for course generator
│   └── ...
├── research-data/                 # 7 languages (210 lessons)
│   ├── french/                    # 30 timestamped transcripts
│   ├── german/                    # 29 lessons (missing L14)
│   ├── spanish/                   # 30 lessons
│   ├── italian/                   # 30 lessons
│   ├── japanese/                  # 30 lessons
│   ├── polish/                    # 30 lessons
│   └── russian/                   # 30 lessons
└── archive/                       # Deprecated code
```

## Commands

```bash
# Run all 220 tests
uv run pytest

# Run linting
uv run ruff check .

# Run type checking
uv run ty check

# View metrics
cat data/french_lesson_metrics.json | python -m json.tool | head -100

# Read a lesson transcript
cat research-data/french/timestamped-transcripts/sentence-level/French01_Unit_22_sentencelevel.txt
```

## Data Model

```python
class Utterance:
    speaker: str      # "Narrator", "Male Speaker", "Female Speaker"
    text: str
    start_time: timedelta | None
    end_time: timedelta | None

class Lesson:
    language: str     # "French", "German", etc.
    level: int        # 1, 2, 3...
    unit: int         # 1-30
    utterances: list[Utterance]
```

## What's Next

See `TODO.md` for detailed roadmap. Completed:
1. ✅ Cross-level understanding → `CROSS_LEVEL_ANALYSIS.md`
2. ✅ Cross-level vocabulary tracking → `scripts/extract_vocabulary.py`
3. ✅ Grammar staircase → `GRAMMAR_STAIRCASE.md`
4. ✅ Vocabulary selection principles → `VOCABULARY_SELECTION.md`
5. ✅ Simplified drill model for L2-5 → `DRILL_STRUCTURE_L2_L5.md`

6. ✅ Generator prototype → `src/generator.py` (53 tests)

Remaining:
7. **Effectiveness testing** - Do generated lessons actually teach? (requires human learners)
