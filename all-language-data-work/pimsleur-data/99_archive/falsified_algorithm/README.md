# Archived: Falsified Algorithm

**Archived:** 2026-01-18
**Reason:** Empirically falsified against real transcript data

## What's Here

- `pimsleur_algorithm.py` - A two-phase spaced repetition model

## Why It's Wrong

The algorithm proposed a "two-phase" model:

1. **Intensive phase**: 4 consecutive lessons with high repetitions
2. **Expanding phase**: Intervals grow by 2.0x factor

### Empirical Test

We tested this against the word "pardon" in French Level 1 transcripts:

| Lesson | Two-phase prediction | Actual count |
|--------|---------------------|--------------|
| L1 | ~17 (intensive) | 17 |
| L2 | ~17 (intensive) | **6** (falsifies) |
| L3 | ~17 (intensive) | **5** (falsifies) |
| L4 | ~17 (intensive) | **4** (falsifies) |
| L5 | gap begins | 2 |
| L6-L8 | 0 | 0 |
| L9 | 1 (expanding) | **3** (falsifies) |

The "intensive phase" concept is wrong. Pimsleur doesn't maintain consistent counts during early lessons - there's an immediate steep decay (17→6→5→4→2).

### The Correct Model

See `/pimsleur-gen/src/spaced_repetition.py` which uses:

```python
CROSS_LESSON_PATTERN = {
    1: 17,   # Intensive introduction
    2: 6,    # Heavy reinforcement
    3: 5,    # Reinforcement
    4: 4,    # Maintenance
    5: 2,    # Light maintenance
    6: 0,    # Gap
    7: 0,    # Gap
    8: 0,    # Gap
    9: 3,    # Returns
}
```

This fixed-count pattern matches the actual transcript data exactly.

### Other Issues

1. **No data derivation**: The parameters `intensive_lessons=4` and `expansion_factor=2.0` were guessed, not derived from analysis
2. **No tests**: This file had zero unit tests validating it
3. **Orphaned code**: Never imported or used by other modules

## Authoritative Source

The validated model lives at:
`/home/simon/github/episodic/all-language-data-work/pimsleur-gen/src/spaced_repetition.py`

With 135 passing tests across 7 languages in:
`/home/simon/github/episodic/all-language-data-work/pimsleur-gen/tests/`
