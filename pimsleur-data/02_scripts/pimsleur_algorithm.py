#!/usr/bin/env python3
"""Pimsleur Spaced Repetition Algorithm.

Based on reverse-engineering analysis of Pimsleur French I (30 lessons).

The Pimsleur method uses a two-phase approach:
1. INTENSIVE PHASE: Drill the phrase in consecutive lessons (3-5 lessons)
2. EXPANDING PHASE: Space out reviews with growing intervals (1→2→4→8...)

This differs from pure spaced repetition (SM-2) which starts spacing immediately.
Pimsleur front-loads the drilling to build initial memory strength.
"""

from dataclasses import dataclass


@dataclass
class PimsleurConfig:
    """Configuration for the Pimsleur scheduling algorithm."""

    # Phase 1: Intensive drilling
    intensive_lessons: int = 4  # How many consecutive lessons to drill

    # Phase 2: Expanding intervals
    initial_interval: int = 2  # First gap after intensive phase
    expansion_factor: float = 2.0  # How much to multiply interval each time
    max_interval: int = 15  # Cap on how large intervals can get

    # Limits
    max_total_lessons: int = 30  # Total lessons in the course


def generate_schedule(
    introduced_at: int,
    config: PimsleurConfig | None = None,
) -> list[int]:
    """Generate lesson schedule for a phrase.

    Args:
        introduced_at: Lesson number where phrase is first introduced (1-indexed)
        config: Algorithm configuration (uses defaults if None)

    Returns:
        List of lesson numbers where the phrase should appear
    """
    if config is None:
        config = PimsleurConfig()

    schedule = []
    current_lesson = introduced_at

    # Phase 1: Intensive drilling - consecutive lessons
    for _ in range(config.intensive_lessons):
        if current_lesson <= config.max_total_lessons:
            schedule.append(current_lesson)
            current_lesson += 1

    # Phase 2: Expanding intervals
    interval = config.initial_interval

    while current_lesson <= config.max_total_lessons:
        # Add the review lesson
        schedule.append(current_lesson)

        # Calculate next interval (expand it)
        interval = min(int(interval * config.expansion_factor), config.max_interval)
        current_lesson += interval

    return schedule


def calculate_intervals(lessons: list[int]) -> list[int]:
    """Calculate intervals between lesson appearances.

    Args:
        lessons: Sorted list of lesson numbers

    Returns:
        List of intervals (gaps) between consecutive lessons
    """
    if len(lessons) < 2:
        return []
    sorted_lessons = sorted(lessons)
    return [sorted_lessons[i + 1] - sorted_lessons[i] for i in range(len(sorted_lessons) - 1)]


def classify_schedule(lessons: list[int]) -> dict:
    """Analyze a schedule and classify its pattern.

    Args:
        lessons: List of lesson numbers where phrase appears

    Returns:
        Dictionary with analysis results
    """
    if not lessons:
        return {"pattern": "empty", "intervals": [], "phases": {}}

    intervals = calculate_intervals(lessons)

    # Count consecutive lessons at start (intensive phase)
    intensive_count = 1
    for interval in intervals:
        if interval == 1:
            intensive_count += 1
        else:
            break

    # Check if remaining intervals are expanding
    expanding_intervals = intervals[intensive_count - 1:] if intensive_count > 1 else intervals
    is_expanding = all(
        expanding_intervals[i] <= expanding_intervals[i + 1]
        for i in range(len(expanding_intervals) - 1)
    ) if len(expanding_intervals) >= 2 else False

    return {
        "pattern": "pimsleur" if intensive_count >= 3 and is_expanding else "other",
        "intervals": intervals,
        "intensive_phase_length": intensive_count,
        "is_expanding": is_expanding,
        "first_lesson": min(lessons),
        "last_lesson": max(lessons),
        "total_appearances": len(lessons),
    }


def score_schedule_match(
    generated: list[int],
    actual: list[int],
    tolerance: int = 1,
) -> float:
    """Score how well a generated schedule matches actual Pimsleur data.

    Args:
        generated: Schedule produced by our algorithm
        actual: Actual lessons from Pimsleur data
        tolerance: How many lessons off is still considered a match

    Returns:
        Score from 0.0 to 1.0 (1.0 = perfect match)
    """
    if not actual:
        return 0.0

    matches = 0
    for lesson in actual:
        # Check if any generated lesson is within tolerance
        if any(abs(lesson - g) <= tolerance for g in generated):
            matches += 1

    return matches / len(actual)


# Pre-configured variants based on observed patterns
SCAFFOLDING_CONFIG = PimsleurConfig(
    intensive_lessons=5,
    initial_interval=2,
    expansion_factor=2.0,
)

CORE_PHRASE_CONFIG = PimsleurConfig(
    intensive_lessons=4,
    initial_interval=2,
    expansion_factor=2.0,
)

VOCABULARY_CONFIG = PimsleurConfig(
    intensive_lessons=3,
    initial_interval=2,
    expansion_factor=2.5,
)


if __name__ == "__main__":
    # Demo: Generate schedules for phrases introduced at different lessons
    print("Pimsleur Algorithm Demo")
    print("=" * 50)

    for intro_lesson in [1, 5, 10, 15, 20]:
        schedule = generate_schedule(intro_lesson)
        intervals = calculate_intervals(schedule)
        print(f"\nIntroduced at lesson {intro_lesson}:")
        print(f"  Schedule: {schedule}")
        print(f"  Intervals: {intervals}")
        analysis = classify_schedule(schedule)
        print(f"  Intensive phase: {analysis['intensive_phase_length']} lessons")
        print(f"  Expanding: {analysis['is_expanding']}")
