# CLAUDE.md

## Project Goal

Understand how Pimsleur structures their language lessons so we can generate custom lessons with personalized topics.

**The simple question**: What happens in a Pimsleur lesson, minute by minute, and how does that change from Lesson 1 to Lesson 30?

## Current Status (Dec 2025)

**Model validated across ALL 7 languages.** We have 11 testable predictions verified with 135 passing tests.

**Key document:** `PIMSLEUR_MODEL.md` - Contains testable predictions with verification status.

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
├── PIMSLEUR_MODEL.md              # KEY DOC: Testable predictions (11 predictions)
├── RESEARCH_FINDINGS.md           # Detailed French evidence
├── TODO.md                        # Current roadmap
├── data/
│   └── french_lesson_metrics.json # Ground truth metrics (30 lessons)
├── src/
│   ├── models.py                  # Pydantic models (Lesson, Utterance)
│   ├── parser.py                  # Parse transcripts into models
│   └── spaced_repetition.py       # Formalized SRS algorithm (NEW)
├── tests/                         # 135 tests
│   ├── test_cross_language.py     # 50 tests for 7-language verification
│   ├── test_spaced_repetition.py  # 30 tests for SRS algorithm
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
# Run all 135 tests
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

See `TODO.md` for detailed roadmap. Main gaps:
1. **Vocabulary selection principles** - Why these 271 words?
2. **Drill pattern formalization** - Exact sequence structure
3. **Generator prototype** - Apply model to generate lessons
