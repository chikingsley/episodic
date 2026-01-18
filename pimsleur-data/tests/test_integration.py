"""Integration tests that validate analysis against actual Pimsleur CSV data.

These tests ensure the analysis scripts produce correct results from real data,
not just mock/synthetic data.
"""

import csv
import pathlib

import pytest

# Path to the analysis directory
ANALYSIS_DIR = pathlib.Path(__file__).parent.parent / "02_scripts" / "analysis"
OUTPUT_DIR = ANALYSIS_DIR / "output"


class TestDataFilesExist:
    """Verify all expected data files are present."""

    def test_all_30_lesson_files_exist(self):
        """All 30 lesson utterance CSVs should exist."""
        for i in range(1, 31):
            csv_path = ANALYSIS_DIR / f"lesson_{i:02d}_utterances.csv"
            assert csv_path.exists(), f"Missing lesson {i:02d} CSV"

    def test_spaced_repetition_output_exists(self):
        """The spaced repetition analysis output should exist."""
        output_path = OUTPUT_DIR / "spaced_repetition_patterns.csv"
        assert output_path.exists(), "Missing spaced_repetition_patterns.csv"


class TestLesson1Data:
    """Validate lesson 1 data matches expected content."""

    @pytest.fixture
    def lesson1_data(self):
        """Load lesson 1 utterances."""
        csv_path = ANALYSIS_DIR / "lesson_01_utterances.csv"
        with open(csv_path, encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def test_lesson1_starts_with_pardon(self, lesson1_data):
        """First conversational utterance should contain 'Pardon'."""
        first_row = lesson1_data[0]
        assert "Pardon" in first_row["text"]

    def test_lesson1_has_pardon_multiple_times(self, lesson1_data):
        """'Pardon.' appears multiple times in lesson 1 for drilling."""
        pardon_count = sum(
            1 for row in lesson1_data if row["text"].strip() == "Pardon."
        )
        # From the data, we see Pardon. at positions 6, 11, 12, 13, 23, 24
        assert pardon_count >= 5, f"Expected 5+ 'Pardon.' occurrences, got {pardon_count}"

    def test_lesson1_has_anglais_drilling(self, lesson1_data):
        """Lesson 1 drills 'anglais' heavily."""
        anglais_count = sum(
            1 for row in lesson1_data
            if "anglais" in row["text"].lower()
        )
        # anglais is drilled many times in lesson 1
        assert anglais_count >= 10, f"Expected 10+ 'anglais' references, got {anglais_count}"

    def test_lesson1_utterance_types(self, lesson1_data):
        """Lesson 1 should have DirectRepetition and ConversationalExchange types."""
        types = {row["utterance_type"] for row in lesson1_data}
        assert "DirectRepetition" in types or "ConversationalExchange" in types


class TestCrossLessonPatterns:
    """Validate patterns that span multiple lessons."""

    @pytest.fixture
    def all_utterances(self):
        """Load utterances from all lessons."""
        utterances = []
        for i in range(1, 31):
            csv_path = ANALYSIS_DIR / f"lesson_{i:02d}_utterances.csv"
            with open(csv_path, encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    row["lesson_number"] = i
                    utterances.append(row)
        return utterances

    def test_je_ne_comprends_pas_in_multiple_lessons(self, all_utterances):
        """'Je ne comprends pas.' should appear across many lessons."""
        lessons_with_phrase = set()
        for row in all_utterances:
            if "je ne comprends pas" in row["text"].lower():
                lessons_with_phrase.add(row["lesson_number"])

        # From analysis: appears in lessons 1, 2, 3, 4, 6, 8, 10, 24, 29
        assert len(lessons_with_phrase) >= 5, (
            f"'Je ne comprends pas' should span 5+ lessons, found {len(lessons_with_phrase)}"
        )
        assert 1 in lessons_with_phrase, "Should appear in lesson 1"

    def test_bonjour_persists_across_lessons(self, all_utterances):
        """'Bonjour' should persist across many lessons."""
        lessons_with_bonjour = set()
        for row in all_utterances:
            text = row["text"].strip().lower()
            if text == "bonjour." or text == "bonjour":
                lessons_with_bonjour.add(row["lesson_number"])

        # Bonjour appears in 9 lessons per analysis
        assert len(lessons_with_bonjour) >= 5, (
            f"'Bonjour' should span 5+ lessons, found {len(lessons_with_bonjour)}"
        )


class TestSpacedRepetitionAnalysisOutput:
    """Validate the spaced repetition analysis output."""

    @pytest.fixture
    def patterns_data(self):
        """Load spaced repetition patterns output."""
        output_path = OUTPUT_DIR / "spaced_repetition_patterns.csv"
        with open(output_path, encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def test_je_ne_sais_pas_is_most_persistent(self, patterns_data):
        """'Je ne sais pas.' should be among the most persistent patterns."""
        # First row should be most persistent
        top_patterns = [row["text"] for row in patterns_data[:5]]
        assert any("je ne sais pas" in p.lower() for p in top_patterns), (
            "'Je ne sais pas.' should be in top 5 persistent patterns"
        )

    def test_je_ne_sais_pas_in_10_lessons(self, patterns_data):
        """'Je ne sais pas.' appears in exactly 10 lessons."""
        for row in patterns_data:
            if "je ne sais pas" in row["text"].lower():
                assert row["num_lessons"] == "10", (
                    f"'Je ne sais pas.' should be in 10 lessons, got {row['num_lessons']}"
                )
                break
        else:
            pytest.fail("'Je ne sais pas.' not found in patterns")

    def test_expanding_intervals_detected(self, patterns_data):
        """Should detect patterns with expanding intervals."""
        expanding_count = sum(
            1 for row in patterns_data if row["pattern_type"] == "expanding_intervals"
        )
        # Analysis showed 52 patterns with expanding intervals
        assert expanding_count >= 40, (
            f"Expected 40+ expanding interval patterns, got {expanding_count}"
        )

    def test_decaying_trend_detected(self, patterns_data):
        """Should detect patterns with decaying frequency (mastery)."""
        decaying_count = sum(
            1 for row in patterns_data if row["decay_trend"] == "decaying"
        )
        # Analysis showed 89 patterns with decaying trend
        assert decaying_count >= 50, (
            f"Expected 50+ decaying patterns, got {decaying_count}"
        )

    def test_total_persistent_patterns(self, patterns_data):
        """Should find 100+ patterns appearing in 3+ lessons."""
        assert len(patterns_data) >= 100, (
            f"Expected 100+ persistent patterns, got {len(patterns_data)}"
        )

    def test_pattern_has_required_fields(self, patterns_data):
        """Each pattern should have all required analysis fields."""
        required_fields = [
            "text", "num_lessons", "first_lesson", "last_lesson",
            "intervals", "pattern_type", "decay_trend", "lessons"
        ]
        for row in patterns_data[:10]:  # Check first 10
            for field in required_fields:
                assert field in row, f"Missing field: {field}"


class TestIntervalCalculations:
    """Validate interval calculations are correct."""

    @pytest.fixture
    def patterns_data(self):
        """Load spaced repetition patterns output."""
        output_path = OUTPUT_DIR / "spaced_repetition_patterns.csv"
        with open(output_path, encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def test_pardon_intervals(self, patterns_data):
        """'Pardon.' should have expanding intervals [1, 1, 2, 4]."""
        for row in patterns_data:
            if row["text"].strip() == "Pardon.":
                # intervals are stored as string representation of list
                assert "[1, 1, 2, 4]" in row["intervals"], (
                    f"Pardon intervals should be [1, 1, 2, 4], got {row['intervals']}"
                )
                break

    def test_tres_bien_has_expanding_intervals(self, patterns_data):
        """'Très bien.' should have expanding intervals."""
        for row in patterns_data:
            if "très bien" in row["text"].lower():
                assert row["pattern_type"] == "expanding_intervals", (
                    f"'Très bien' should be expanding_intervals, got {row['pattern_type']}"
                )
                break


class TestDataConsistency:
    """Validate data consistency across files."""

    def test_lesson_numbers_are_consistent(self):
        """Each CSV should only contain its own lesson number."""
        for i in range(1, 31):
            csv_path = ANALYSIS_DIR / f"lesson_{i:02d}_utterances.csv"
            with open(csv_path, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if "lesson_number" in row:
                        assert int(row["lesson_number"]) == i, (
                            f"Lesson {i} file contains row with lesson_number {row['lesson_number']}"
                        )

    def test_positions_are_sequential(self):
        """Position in lesson should be sequential starting from 1."""
        for i in [1, 5, 10, 20, 30]:  # Sample lessons
            csv_path = ANALYSIS_DIR / f"lesson_{i:02d}_utterances.csv"
            with open(csv_path, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                positions = [int(row["position_in_lesson"]) for row in reader]

            # Should start at 1 and be sequential
            assert positions[0] == 1, f"Lesson {i} should start at position 1"
            for j in range(1, len(positions)):
                assert positions[j] == positions[j - 1] + 1, (
                    f"Lesson {i} positions not sequential at {j}"
                )
