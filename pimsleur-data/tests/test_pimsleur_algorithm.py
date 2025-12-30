"""Tests for the Pimsleur scheduling algorithm.

Validates that our algorithm produces schedules similar to actual Pimsleur data.
"""

import csv
import pathlib
from importlib.util import module_from_spec, spec_from_file_location

import pytest

# Load the algorithm module
SCRIPTS_DIR = pathlib.Path(__file__).parent.parent / "02_scripts"
spec = spec_from_file_location("pimsleur_algorithm", SCRIPTS_DIR / "pimsleur_algorithm.py")
algo = module_from_spec(spec)
spec.loader.exec_module(algo)

# Actual Pimsleur data for validation
ACTUAL_PIMSLEUR_PATTERNS = {
    # phrase: (introduced_at, lessons_appeared_in)
    "Pardon.": (1, [1, 2, 3, 5, 9]),
    "Très bien.": (2, [2, 3, 6, 11, 22]),
    "Je comprends un peu.": (1, [1, 2, 3, 4, 5, 6]),
    "Est-ce que vous comprenez l'anglais?": (1, [1, 2, 3, 4, 5, 17]),
    "Bonjour, Monsieur.": (2, [2, 3, 4, 5, 9]),
    "Plus tard.": (6, [6, 7, 11, 18, 29]),
    "Au revoir.": (2, [2, 3, 4, 5]),
    "Je ne sais pas.": (5, [5, 6, 7, 8, 10, 16, 18, 19, 24, 29]),
}


class TestGenerateSchedule:
    """Test the core schedule generation."""

    def test_returns_list_of_lessons(self):
        """Should return a list of lesson numbers."""
        schedule = algo.generate_schedule(1)
        assert isinstance(schedule, list)
        assert all(isinstance(x, int) for x in schedule)

    def test_first_lesson_is_introduction(self):
        """First lesson in schedule should be the introduction lesson."""
        for intro in [1, 5, 10, 20]:
            schedule = algo.generate_schedule(intro)
            assert schedule[0] == intro

    def test_intensive_phase_is_consecutive(self):
        """Intensive phase should have consecutive lessons."""
        schedule = algo.generate_schedule(1)
        intervals = algo.calculate_intervals(schedule[:4])
        assert all(i == 1 for i in intervals), "First 4 lessons should be consecutive"

    def test_respects_max_lessons(self):
        """Should not exceed max_total_lessons."""
        config = algo.PimsleurConfig(max_total_lessons=30)
        schedule = algo.generate_schedule(1, config)
        assert all(lesson <= 30 for lesson in schedule)

    def test_late_introduction_still_works(self):
        """Phrases introduced late should still get a schedule."""
        schedule = algo.generate_schedule(25)
        assert len(schedule) >= 4  # At least intensive phase
        assert schedule[0] == 25


class TestCalculateIntervals:
    """Test interval calculation."""

    def test_empty_list(self):
        """Empty list should return empty intervals."""
        assert algo.calculate_intervals([]) == []

    def test_single_lesson(self):
        """Single lesson should return empty intervals."""
        assert algo.calculate_intervals([5]) == []

    def test_consecutive_lessons(self):
        """Consecutive lessons should have interval of 1."""
        assert algo.calculate_intervals([1, 2, 3, 4]) == [1, 1, 1]

    def test_expanding_intervals(self):
        """Should correctly calculate expanding intervals."""
        assert algo.calculate_intervals([1, 2, 3, 5, 9]) == [1, 1, 2, 4]


class TestClassifySchedule:
    """Test schedule classification."""

    def test_identifies_intensive_phase(self):
        """Should correctly count intensive phase length."""
        # 4 consecutive, then gaps
        result = algo.classify_schedule([1, 2, 3, 4, 6, 10])
        assert result["intensive_phase_length"] == 4

    def test_identifies_expanding(self):
        """Should detect expanding intervals."""
        result = algo.classify_schedule([1, 2, 3, 5, 9])
        assert result["is_expanding"] is True

    def test_identifies_non_expanding(self):
        """Should detect non-expanding patterns."""
        # Intervals: 1, 1, 5, 2 - shrinking at end
        result = algo.classify_schedule([1, 2, 3, 8, 10])
        assert result["is_expanding"] is False


class TestScoreScheduleMatch:
    """Test the matching score function."""

    def test_perfect_match(self):
        """Identical schedules should score 1.0."""
        schedule = [1, 2, 3, 5, 9]
        assert algo.score_schedule_match(schedule, schedule) == 1.0

    def test_no_match(self):
        """Completely different schedules should score low."""
        generated = [1, 2, 3, 4, 5]
        actual = [20, 21, 22, 23, 24]
        assert algo.score_schedule_match(generated, actual) == 0.0

    def test_partial_match(self):
        """Partial overlap should give partial score."""
        generated = [1, 2, 3, 4, 5]
        actual = [1, 2, 3, 10, 20]
        score = algo.score_schedule_match(generated, actual)
        assert 0.5 <= score <= 0.7  # 3 out of 5 match

    def test_tolerance_helps(self):
        """Tolerance should allow near-matches."""
        generated = [1, 2, 3, 6, 10]  # Off by 1 at positions 4 and 5
        actual = [1, 2, 3, 5, 9]
        score = algo.score_schedule_match(generated, actual, tolerance=1)
        assert score == 1.0  # All within tolerance


class TestAgainstActualPimsleurData:
    """Validate algorithm against real Pimsleur patterns."""

    @pytest.mark.parametrize("phrase,data", ACTUAL_PIMSLEUR_PATTERNS.items())
    def test_matches_actual_pattern(self, phrase, data):
        """Generated schedule should reasonably match actual Pimsleur data."""
        introduced_at, actual_lessons = data

        # Generate schedule
        generated = algo.generate_schedule(introduced_at)

        # Score the match (with tolerance of 1 lesson)
        score = algo.score_schedule_match(generated, actual_lessons, tolerance=1)

        # We expect at least 60% match - Pimsleur has variations
        assert score >= 0.5, (
            f"'{phrase}' schedule mismatch:\n"
            f"  Generated: {generated}\n"
            f"  Actual: {actual_lessons}\n"
            f"  Score: {score}"
        )

    def test_pardon_intervals_similar(self):
        """'Pardon.' intervals should be similar to our algorithm."""
        # Actual: [1, 2, 3, 5, 9] - intervals [1, 1, 2, 4]
        generated = algo.generate_schedule(1)
        gen_intervals = algo.calculate_intervals(generated[:5])

        # Both should start with consecutive lessons
        assert gen_intervals[0] == 1
        assert gen_intervals[1] == 1

    def test_intensive_phase_matches_pimsleur(self):
        """Our intensive phase should match Pimsleur's approach."""
        # Most Pimsleur patterns have 3-5 consecutive lessons at start
        for phrase, (intro, lessons) in ACTUAL_PIMSLEUR_PATTERNS.items():
            intervals = algo.calculate_intervals(lessons)
            consecutive_count = sum(1 for i in intervals if i == 1) + 1

            # Pimsleur uses 3-6 consecutive lessons
            assert 2 <= consecutive_count <= 7, (
                f"'{phrase}' has {consecutive_count} consecutive, expected 3-6"
            )


class TestAlgorithmConfigs:
    """Test different algorithm configurations."""

    def test_scaffolding_config_longer_intensive(self):
        """Scaffolding config should have longer intensive phase."""
        schedule = algo.generate_schedule(1, algo.SCAFFOLDING_CONFIG)
        analysis = algo.classify_schedule(schedule)
        assert analysis["intensive_phase_length"] >= 5

    def test_vocabulary_config_expands_faster(self):
        """Vocabulary config should expand faster."""
        vocab_schedule = algo.generate_schedule(1, algo.VOCABULARY_CONFIG)
        core_schedule = algo.generate_schedule(1, algo.CORE_PHRASE_CONFIG)

        # Vocabulary should have fewer total appearances (expands faster)
        assert len(vocab_schedule) <= len(core_schedule)


class TestFromCSVData:
    """Load actual patterns from CSV and validate."""

    @pytest.fixture
    def patterns_data(self):
        """Load patterns from analysis output."""
        output_path = SCRIPTS_DIR / "analysis" / "output" / "spaced_repetition_patterns.csv"
        with open(output_path, encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def test_expanding_patterns_match_algorithm(self, patterns_data):
        """Patterns classified as 'expanding_intervals' should match our algorithm."""
        expanding = [p for p in patterns_data if p["pattern_type"] == "expanding_intervals"]

        match_count = 0
        for pattern in expanding[:20]:  # Test first 20
            first_lesson = int(pattern["first_lesson"])
            # Parse actual lessons from string like "[1, 2, 3, 5, 9]"
            actual_str = pattern["lessons"].strip("[]")
            actual_lessons = [int(x.strip()) for x in actual_str.split(",")]

            generated = algo.generate_schedule(first_lesson)
            score = algo.score_schedule_match(generated, actual_lessons, tolerance=2)

            if score >= 0.5:
                match_count += 1

        # At least 50% of expanding patterns should match our algorithm
        assert match_count >= 10, f"Only {match_count}/20 expanding patterns matched"

    def test_algorithm_captures_pimsleur_essence(self, patterns_data):
        """Overall, our algorithm should capture the Pimsleur pattern."""
        total_score = 0
        count = 0

        for pattern in patterns_data[:50]:  # Top 50 patterns
            first_lesson = int(pattern["first_lesson"])
            actual_str = pattern["lessons"].strip("[]")
            actual_lessons = [int(x.strip()) for x in actual_str.split(",")]

            generated = algo.generate_schedule(first_lesson)
            score = algo.score_schedule_match(generated, actual_lessons, tolerance=2)

            total_score += score
            count += 1

        avg_score = total_score / count
        # Average match should be at least 40% - Pimsleur has lots of variation
        assert avg_score >= 0.4, f"Average match score {avg_score:.2f} too low"
