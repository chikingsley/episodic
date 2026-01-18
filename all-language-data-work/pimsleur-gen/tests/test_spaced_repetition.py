"""Tests for the spaced repetition algorithm.

These tests verify that the formalized algorithm matches observed Pimsleur patterns.
"""

from datetime import timedelta

from src.spaced_repetition import (
    CROSS_LESSON_PATTERN,
    PIMSLEUR_BASE,
    VocabularyItem,
    cross_lesson_schedule,
    expected_occurrences,
    lessons_for_mastery,
    total_occurrences_by_lesson,
    within_lesson_intervals,
    within_lesson_recall_times,
)


class TestWithinLessonSpacing:
    """Tests for within-lesson spaced repetition intervals."""

    def test_initial_interval_is_5_seconds(self):
        """First recall should be ~5 seconds after introduction."""
        intervals = within_lesson_intervals()
        assert intervals[0] == timedelta(seconds=5)

    def test_second_interval_is_25_seconds(self):
        """Second recall should be ~25 seconds (5*5) after first."""
        intervals = within_lesson_intervals()
        assert intervals[1] == timedelta(seconds=25)

    def test_intervals_follow_base_5_exponential(self):
        """Intervals should follow base-5 exponential growth."""
        intervals = within_lesson_intervals(max_minutes=60)
        for i in range(1, len(intervals)):
            expected = intervals[i - 1].total_seconds() * PIMSLEUR_BASE
            assert intervals[i].total_seconds() == expected

    def test_intervals_include_2_minute_mark(self):
        """Intervals should include approximately 2 minutes."""
        intervals = within_lesson_intervals()
        two_min_interval = next(
            (i for i in intervals if 100 <= i.total_seconds() <= 130), None
        )
        assert two_min_interval is not None, "Should have ~2 minute interval (125s)"

    def test_intervals_include_10_minute_mark(self):
        """Intervals should include approximately 10 minutes."""
        intervals = within_lesson_intervals()
        ten_min_interval = next(
            (i for i in intervals if 600 <= i.total_seconds() <= 700), None
        )
        assert ten_min_interval is not None, "Should have ~10 minute interval (625s)"

    def test_max_interval_respects_limit(self):
        """Intervals should not exceed max_minutes parameter."""
        max_min = 5
        intervals = within_lesson_intervals(max_minutes=max_min)
        for interval in intervals:
            assert interval.total_seconds() <= max_min * 60

    def test_recall_times_are_cumulative(self):
        """Recall times should be cumulative from introduction time."""
        intro = timedelta(minutes=2)
        times = within_lesson_recall_times(intro)

        # First recall: 2:00 + 5s = 2:05
        assert times[0] == intro + timedelta(seconds=5)

        # Second recall: 2:05 + 25s = 2:30
        assert times[1] == intro + timedelta(seconds=5 + 25)


class TestCrossLessonSpacing:
    """Tests for cross-lesson spaced repetition pattern."""

    def test_introduction_lesson_is_intensive(self):
        """Introduction lesson should have ~17 occurrences."""
        assert expected_occurrences(1, 1) == 17

    def test_lessons_2_to_5_decline(self):
        """Lessons 2-5 should show declining occurrences."""
        occurrences = [expected_occurrences(i, 1) for i in range(2, 6)]
        assert occurrences == [6, 5, 4, 2], "Should decline: 6, 5, 4, 2"

    def test_lessons_6_to_8_are_gap(self):
        """Lessons 6-8 should have zero occurrences (gap period)."""
        for lesson in [6, 7, 8]:
            assert expected_occurrences(lesson, 1) == 0, f"L{lesson} should be gap"

    def test_lesson_9_returns(self):
        """Lesson 9 should have occurrences (word returns after gap)."""
        assert expected_occurrences(9, 1) == 3

    def test_after_pattern_is_periodic(self):
        """After L9, occurrences should be periodic (~every 4 lessons)."""
        # L10-12 should not have occurrence (not on period)
        for lesson in [10, 11, 12]:
            assert expected_occurrences(lesson, 1) == 0, f"L{lesson} should be 0"

        # L13 should have occurrence (4 lessons after L9)
        assert expected_occurrences(13, 1) == 1

        # L14-16 should not have occurrence
        for lesson in [14, 15, 16]:
            assert expected_occurrences(lesson, 1) == 0, f"L{lesson} should be 0"

        # L17 should have occurrence (4 lessons after L13)
        assert expected_occurrences(17, 1) == 1

        # L21, L25, L29 should also have occurrences
        for lesson in [21, 25, 29]:
            assert expected_occurrences(lesson, 1) == 1, f"L{lesson} should be 1"

    def test_schedule_for_late_introduction(self):
        """Pattern should apply relative to introduction lesson."""
        # Word introduced in L5
        assert expected_occurrences(5, 5) == 17  # Intensive at introduction
        assert expected_occurrences(6, 5) == 6   # Heavy reinforcement
        assert expected_occurrences(10, 5) == 0  # Gap
        assert expected_occurrences(13, 5) == 3  # Returns

    def test_before_introduction_is_zero(self):
        """Lessons before introduction should have zero occurrences."""
        assert expected_occurrences(1, 5) == 0  # Word not yet introduced
        assert expected_occurrences(4, 5) == 0  # Still not introduced


class TestCrossLessonSchedule:
    """Tests for generating full cross-lesson schedules."""

    def test_schedule_length(self):
        """Schedule should cover all lessons from introduction to end."""
        schedule = cross_lesson_schedule(1, 30)
        assert len(schedule) == 30

    def test_schedule_starts_at_introduction(self):
        """Schedule should start at introduction lesson."""
        schedule = cross_lesson_schedule(5, 30)
        assert 4 not in schedule  # Before introduction
        assert 5 in schedule      # Introduction lesson

    def test_schedule_matches_pattern(self):
        """Schedule values should match the defined pattern."""
        schedule = cross_lesson_schedule(1, 30)
        for lesson, expected in CROSS_LESSON_PATTERN.items():
            assert schedule[lesson] == expected, f"L{lesson} mismatch"


class TestTotalOccurrences:
    """Tests for calculating total occurrences."""

    def test_total_at_introduction(self):
        """Total at introduction should equal intensive count."""
        total = total_occurrences_by_lesson(1, 1)
        assert total == 17

    def test_total_through_pattern(self):
        """Total through L9 should sum the pattern."""
        total = total_occurrences_by_lesson(1, 9)
        expected = sum(CROSS_LESSON_PATTERN.values())
        assert total == expected

    def test_total_increases_periodically(self):
        """Total should increase at periodic maintenance lessons."""
        # L12 is before first periodic, L13 is first periodic
        total_l12 = total_occurrences_by_lesson(1, 12)
        total_l13 = total_occurrences_by_lesson(1, 13)
        assert total_l13 == total_l12 + 1, f"L13 should add 1 (got {total_l13} vs {total_l12})"

        # L16 is before second periodic, L17 is second periodic
        total_l16 = total_occurrences_by_lesson(1, 16)
        total_l17 = total_occurrences_by_lesson(1, 17)
        assert total_l17 == total_l16 + 1, f"L17 should add 1 (got {total_l17} vs {total_l16})"


class TestMastery:
    """Tests for mastery estimation."""

    def test_mastery_lesson_for_l1_word(self):
        """Word introduced in L1 should reach mastery by L9."""
        mastery = lessons_for_mastery(1)
        assert mastery == 9

    def test_mastery_lesson_for_late_word(self):
        """Mastery lesson should be relative to introduction."""
        mastery = lessons_for_mastery(10)
        assert mastery == 18  # 10 + 9 - 1


class TestVocabularyItem:
    """Tests for the VocabularyItem class."""

    def test_creation(self):
        """Test basic item creation."""
        item = VocabularyItem("pardon", 1, timedelta(seconds=32))
        assert item.word == "pardon"
        assert item.introduction_lesson == 1
        assert item.introduction_time == timedelta(seconds=32)

    def test_expected_in_lesson(self):
        """Test expected occurrences calculation."""
        item = VocabularyItem("pardon", 1)
        assert item.expected_in_lesson(1) == 17
        assert item.expected_in_lesson(6) == 0
        assert item.expected_in_lesson(9) == 3

    def test_is_mastered(self):
        """Test mastery detection."""
        item = VocabularyItem("pardon", 1)
        assert not item.is_mastered(5)
        assert item.is_mastered(9)
        assert item.is_mastered(15)

    def test_next_scheduled_lesson(self):
        """Test finding next scheduled lesson."""
        item = VocabularyItem("pardon", 1)

        # From L5 (maintenance), next should be L9 (returns)
        assert item.next_scheduled_lesson(5) == 9

        # From L6 (gap), next should be L9
        assert item.next_scheduled_lesson(6) == 9

        # From L9 (returns), next should be L13 (first periodic, 4 lessons after L9)
        assert item.next_scheduled_lesson(9) == 13

        # From L13 (first periodic), next should be L17
        assert item.next_scheduled_lesson(13) == 17

    def test_record_occurrence(self):
        """Test recording occurrences."""
        item = VocabularyItem("pardon", 1)
        assert item.occurrence_count == 0

        item.record_occurrence(1, timedelta(minutes=2))
        assert item.occurrence_count == 1

        item.record_occurrence(1, timedelta(minutes=5))
        assert item.occurrence_count == 2


class TestRealDataValidation:
    """Tests that validate algorithm against observed Pimsleur patterns.

    These tests use the actual data from PIMSLEUR_MODEL.md to verify
    our algorithm matches real Pimsleur course structure.
    """

    def test_pardon_l1_pattern_matches_observation(self):
        """Test that 'pardon' L1 pattern matches observed data.

        From PIMSLEUR_MODEL.md, 'pardon' in French L1:
        - 17 occurrences in L1
        """
        item = VocabularyItem("pardon", 1, timedelta(seconds=32))
        assert item.expected_in_lesson(1) == 17

    def test_observed_cross_lesson_pattern(self):
        """Test cross-lesson pattern matches PIMSLEUR_MODEL.md observation.

        From the model:
        L1:  17 occurrences
        L2:   6 occurrences
        L3:   5 occurrences
        L4:   4 occurrences
        L5:   2 occurrences
        L6-8: 0 occurrences (GAP)
        L9:   3 occurrences
        """
        schedule = cross_lesson_schedule(1, 10)
        assert schedule[1] == 17
        assert schedule[2] == 6
        assert schedule[3] == 5
        assert schedule[4] == 4
        assert schedule[5] == 2
        assert schedule[6] == 0
        assert schedule[7] == 0
        assert schedule[8] == 0
        assert schedule[9] == 3

    def test_within_lesson_intervals_match_observation(self):
        """Test within-lesson intervals match PIMSLEUR_MODEL.md observation.

        From the model (verified with 'pardon' in L1):
        +27s (matches 25s theory)
        +25s (exact match!)
        +8s  (immediate recall ~5s)
        +1m14s (matches 2min cycle)
        """
        intervals = within_lesson_intervals()

        # Should have 5s interval
        assert timedelta(seconds=5) in intervals

        # Should have 25s interval
        assert timedelta(seconds=25) in intervals

        # Should have ~125s (2min) interval
        assert timedelta(seconds=125) in intervals
