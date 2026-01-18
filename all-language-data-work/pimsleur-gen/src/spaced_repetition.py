"""Pimsleur spaced repetition algorithm.

This module formalizes the spaced repetition pattern observed in Pimsleur courses.

Key insight: Pimsleur uses a BASE-5 EXPONENTIAL pattern for within-lesson repetition,
and a specific cross-lesson pattern for reinforcement.

Within-lesson intervals (in seconds):
    5 → 25 → 125 → 625 → ...
    (approximately: 5s → 25s → 2min → 10min)

Cross-lesson pattern (each lesson = 1 day):
    L1:   17 occurrences (INTENSIVE - first introduction)
    L2:    6 occurrences (heavy reinforcement)
    L3:    5 occurrences (reinforcement)
    L4:    4 occurrences (maintenance)
    L5:    2 occurrences (light maintenance)
    L6-8:  0 occurrences (GAP - consolidation)
    L9:    3 occurrences (returns)
    L10+:  1 periodic (every ~4-5 days)
"""

from datetime import timedelta

# Base multiplier for Pimsleur's exponential spacing
PIMSLEUR_BASE = 5

# Initial interval (seconds)
INITIAL_INTERVAL_SECONDS = 5

# Maximum within-lesson interval (minutes)
MAX_WITHIN_LESSON_INTERVAL_MINUTES = 15


def within_lesson_intervals(
    max_minutes: float = MAX_WITHIN_LESSON_INTERVAL_MINUTES,
) -> list[timedelta]:
    """Generate within-lesson repetition intervals.

    Uses base-5 exponential growth: 5s → 25s → 125s → 625s ...
    Stops when interval exceeds max_minutes.

    Args:
        max_minutes: Maximum interval before stopping (default 15 min)

    Returns:
        List of intervals as timedelta objects

    Example:
        >>> intervals = within_lesson_intervals()
        >>> [int(i.total_seconds()) for i in intervals]
        [5, 25, 125, 625]  # 5s, 25s, ~2min, ~10min
    """
    intervals = []
    current = INITIAL_INTERVAL_SECONDS

    while current <= max_minutes * 60:
        intervals.append(timedelta(seconds=current))
        current *= PIMSLEUR_BASE

    return intervals


def within_lesson_recall_times(
    introduction_time: timedelta,
    max_minutes: float = MAX_WITHIN_LESSON_INTERVAL_MINUTES,
) -> list[timedelta]:
    """Calculate absolute recall times within a lesson.

    Args:
        introduction_time: When the word is first introduced
        max_minutes: Maximum interval for within-lesson recalls

    Returns:
        List of absolute times when the word should be recalled

    Example:
        >>> intro = timedelta(minutes=2)
        >>> times = within_lesson_recall_times(intro)
        >>> # Returns times like 2:05, 2:30, 4:35, 14:58
    """
    intervals = within_lesson_intervals(max_minutes)
    times = []
    current = introduction_time

    for interval in intervals:
        current = current + interval
        times.append(current)

    return times


# Cross-lesson occurrence counts (lesson number -> expected occurrences)
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
    # 10+: 1 every ~4-5 lessons
}

# Period for periodic maintenance (lessons between occurrences)
MAINTENANCE_PERIOD = 4


def expected_occurrences(lesson: int, introduction_lesson: int = 1) -> int:
    """Calculate expected occurrences of a word in a given lesson.

    Args:
        lesson: The lesson number (1-30)
        introduction_lesson: The lesson where the word was introduced

    Returns:
        Expected number of times the word appears in the lesson

    Example:
        >>> expected_occurrences(1, 1)  # Word introduced in L1, checking L1
        17
        >>> expected_occurrences(5, 1)  # Word introduced in L1, checking L5
        2
        >>> expected_occurrences(10, 1)  # Periodic maintenance
        1
    """
    if lesson < introduction_lesson:
        return 0

    relative_lesson = lesson - introduction_lesson + 1

    if relative_lesson in CROSS_LESSON_PATTERN:
        return CROSS_LESSON_PATTERN[relative_lesson]

    # After the pattern, periodic maintenance every MAINTENANCE_PERIOD lessons
    # First maintenance is 4 lessons after L9, then every 4 lessons
    if relative_lesson > max(CROSS_LESSON_PATTERN.keys()):
        lessons_after_pattern = relative_lesson - max(CROSS_LESSON_PATTERN.keys())
        if lessons_after_pattern % MAINTENANCE_PERIOD == 0:
            return 1
        return 0

    return 0


def cross_lesson_schedule(
    introduction_lesson: int = 1,
    total_lessons: int = 30,
) -> dict[int, int]:
    """Generate the full cross-lesson repetition schedule for a vocabulary item.

    Args:
        introduction_lesson: The lesson where the word is first introduced
        total_lessons: Total number of lessons in the course

    Returns:
        Dict mapping lesson number to expected occurrences

    Example:
        >>> schedule = cross_lesson_schedule(1, 30)
        >>> schedule[1]  # Introduction lesson
        17
        >>> schedule[6]  # Gap
        0
        >>> schedule[9]  # Returns
        3
    """
    return {
        lesson: expected_occurrences(lesson, introduction_lesson)
        for lesson in range(introduction_lesson, total_lessons + 1)
    }


def total_occurrences_by_lesson(
    introduction_lesson: int = 1,
    target_lesson: int = 30,
) -> int:
    """Calculate total occurrences from introduction to target lesson.

    Args:
        introduction_lesson: When the word was introduced
        target_lesson: Calculate total up to this lesson

    Returns:
        Total number of times the word should have appeared
    """
    return sum(
        expected_occurrences(lesson, introduction_lesson)
        for lesson in range(introduction_lesson, target_lesson + 1)
    )


def lessons_for_mastery(introduction_lesson: int = 1) -> int:
    """Estimate how many lessons until a word reaches "mastery".

    Mastery is defined as when the word enters periodic maintenance mode
    (after the initial intensive → gap → return cycle).

    Args:
        introduction_lesson: When the word was introduced

    Returns:
        Lesson number when mastery is achieved
    """
    # After lesson 9 relative to introduction, word is in maintenance
    return introduction_lesson + max(CROSS_LESSON_PATTERN.keys()) - 1


class VocabularyItem:
    """Represents a vocabulary item with its spaced repetition state."""

    def __init__(
        self,
        word: str,
        introduction_lesson: int,
        introduction_time: timedelta | None = None,
    ):
        """Initialize a vocabulary item.

        Args:
            word: The vocabulary word/phrase
            introduction_lesson: Lesson number where first introduced
            introduction_time: Time within the introduction lesson
        """
        self.word = word
        self.introduction_lesson = introduction_lesson
        self.introduction_time = introduction_time or timedelta(0)
        self._occurrences: list[tuple[int, timedelta]] = []

    def record_occurrence(self, lesson: int, time: timedelta) -> None:
        """Record an occurrence of this word."""
        self._occurrences.append((lesson, time))

    @property
    def occurrence_count(self) -> int:
        """Total number of recorded occurrences."""
        return len(self._occurrences)

    def expected_in_lesson(self, lesson: int) -> int:
        """Expected occurrences in a specific lesson."""
        return expected_occurrences(lesson, self.introduction_lesson)

    def is_mastered(self, current_lesson: int) -> bool:
        """Check if word has reached mastery phase."""
        return current_lesson >= lessons_for_mastery(self.introduction_lesson)

    def next_scheduled_lesson(self, current_lesson: int) -> int | None:
        """Find the next lesson where this word should appear.

        Args:
            current_lesson: The current lesson number

        Returns:
            Next lesson number where word should appear, or None if done
        """
        for lesson in range(current_lesson + 1, 31):
            if expected_occurrences(lesson, self.introduction_lesson) > 0:
                return lesson
        return None
