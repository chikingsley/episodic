"""Tests for pattern analysis and cross-lesson tracking."""

from collections import defaultdict


def normalize_utterance_text(text: str) -> str:
    """Normalize utterance text for comparison."""
    import re

    normalized = re.sub(r"[.!?,:;]+$", "", text.strip()).lower()
    return normalized


def calculate_persistence_score(lesson_counts: dict[int, int], total_lessons: int) -> float:
    """Calculate how persistent an utterance is across lessons."""
    lessons_with_utterance = len(lesson_counts)
    return lessons_with_utterance / total_lessons if total_lessons > 0 else 0.0


def classify_pattern_type(
    lesson_counts: dict[int, int], first_lesson: int, last_lesson: int
) -> str:
    """Classify the pattern type based on lesson distribution."""
    lesson_span = last_lesson - first_lesson + 1
    total_lessons_with_utterance = len(lesson_counts)

    if total_lessons_with_utterance == 1:
        return "single_lesson"
    elif lesson_span <= 2:
        return "clustered"
    elif total_lessons_with_utterance >= lesson_span * 0.7:
        return "persistent"
    else:
        return "recurring"


def find_persistent_patterns(utterances: list[dict], min_lessons: int = 3) -> dict[str, dict]:
    """Find utterances that appear in multiple lessons."""
    utterance_groups = defaultdict(
        lambda: {"lessons": set(), "total_count": 0, "lesson_counts": defaultdict(int)}
    )

    for utt in utterances:
        text = utt["text"].strip()
        lesson = utt["lesson_number"]
        utterance_groups[text]["lessons"].add(lesson)
        utterance_groups[text]["total_count"] += 1
        utterance_groups[text]["lesson_counts"][lesson] += 1

    persistent_patterns = {}
    for text, data in utterance_groups.items():
        if len(data["lessons"]) >= min_lessons:
            persistent_patterns[text] = {
                "total_lessons": len(data["lessons"]),
                "lesson_counts": dict(data["lesson_counts"]),
                "first_lesson": min(data["lessons"]),
                "last_lesson": max(data["lessons"]),
                "total_count": data["total_count"],
            }

    return persistent_patterns


class TestTextNormalization:
    """Test text normalization for pattern matching."""

    def test_removes_trailing_punctuation(self):
        """Trailing punctuation should be removed."""
        assert normalize_utterance_text("Bonjour!") == "bonjour"
        assert normalize_utterance_text("Comment allez-vous?") == "comment allez-vous"
        assert normalize_utterance_text("Très bien.") == "très bien"

    def test_case_insensitive(self):
        """Normalization should be case-insensitive."""
        assert normalize_utterance_text("BONJOUR") == "bonjour"
        assert normalize_utterance_text("Bonjour") == "bonjour"
        assert normalize_utterance_text("bonjour") == "bonjour"

    def test_preserves_internal_punctuation(self):
        """Internal punctuation should be preserved."""
        assert normalize_utterance_text("Comment allez-vous?") == "comment allez-vous"
        assert normalize_utterance_text("S'il vous plaît.") == "s'il vous plaît"

    def test_strips_whitespace(self):
        """Leading/trailing whitespace should be stripped."""
        assert normalize_utterance_text("  Bonjour  ") == "bonjour"


class TestPersistenceScore:
    """Test persistence score calculation."""

    def test_full_persistence(self):
        """Phrase appearing in all lessons = 1.0 persistence."""
        lesson_counts = {1: 5, 2: 3, 3: 2, 4: 1, 5: 1}
        score = calculate_persistence_score(lesson_counts, total_lessons=5)
        assert score == 1.0

    def test_partial_persistence(self):
        """Phrase appearing in some lessons."""
        lesson_counts = {1: 5, 3: 2, 5: 1}
        score = calculate_persistence_score(lesson_counts, total_lessons=5)
        assert score == 0.6  # 3/5

    def test_single_lesson(self):
        """Phrase appearing in one lesson."""
        lesson_counts = {1: 10}
        score = calculate_persistence_score(lesson_counts, total_lessons=5)
        assert score == 0.2  # 1/5

    def test_zero_lessons(self):
        """Edge case: zero total lessons."""
        lesson_counts = {}
        score = calculate_persistence_score(lesson_counts, total_lessons=0)
        assert score == 0.0


class TestPatternClassification:
    """Test pattern type classification."""

    def test_single_lesson_pattern(self):
        """Phrases in exactly one lesson are single_lesson."""
        assert classify_pattern_type({1: 5}, 1, 1) == "single_lesson"

    def test_clustered_pattern(self):
        """Phrases in adjacent lessons are clustered."""
        assert classify_pattern_type({1: 5, 2: 3}, 1, 2) == "clustered"

    def test_persistent_pattern(self):
        """Phrases in 70%+ of span are persistent."""
        # Span is 1-5 (5 lessons), appears in 4 = 80%
        lesson_counts = {1: 5, 2: 3, 3: 2, 5: 1}
        assert classify_pattern_type(lesson_counts, 1, 5) == "persistent"

    def test_recurring_pattern(self):
        """Phrases in <70% of span are recurring."""
        # Span is 1-5 (5 lessons), appears in 2 = 40%
        lesson_counts = {1: 5, 5: 1}
        assert classify_pattern_type(lesson_counts, 1, 5) == "recurring"


class TestFindPersistentPatterns:
    """Test finding patterns across multiple lessons."""

    def test_finds_patterns_in_3_plus_lessons(self):
        """Should find patterns appearing in 3+ lessons by default."""
        utterances = [
            {"text": "Bonjour", "lesson_number": 1},
            {"text": "Bonjour", "lesson_number": 2},
            {"text": "Bonjour", "lesson_number": 3},
            {"text": "Au revoir", "lesson_number": 1},
            {"text": "Au revoir", "lesson_number": 2},
            {"text": "Merci", "lesson_number": 1},
        ]

        patterns = find_persistent_patterns(utterances, min_lessons=3)

        assert "Bonjour" in patterns
        assert "Au revoir" not in patterns  # Only in 2 lessons
        assert "Merci" not in patterns  # Only in 1 lesson

    def test_counts_occurrences_correctly(self):
        """Should count total occurrences per lesson."""
        utterances = [
            {"text": "Bonjour", "lesson_number": 1},
            {"text": "Bonjour", "lesson_number": 1},
            {"text": "Bonjour", "lesson_number": 1},
            {"text": "Bonjour", "lesson_number": 2},
            {"text": "Bonjour", "lesson_number": 3},
        ]

        patterns = find_persistent_patterns(utterances, min_lessons=3)

        assert patterns["Bonjour"]["total_count"] == 5
        assert patterns["Bonjour"]["lesson_counts"][1] == 3
        assert patterns["Bonjour"]["lesson_counts"][2] == 1
        assert patterns["Bonjour"]["lesson_counts"][3] == 1

    def test_empty_input(self):
        """Should handle empty input."""
        patterns = find_persistent_patterns([], min_lessons=3)
        assert len(patterns) == 0

    def test_custom_min_lessons(self):
        """Should respect custom min_lessons parameter."""
        utterances = [
            {"text": "Bonjour", "lesson_number": 1},
            {"text": "Bonjour", "lesson_number": 2},
        ]

        patterns_strict = find_persistent_patterns(utterances, min_lessons=3)
        patterns_lenient = find_persistent_patterns(utterances, min_lessons=2)

        assert "Bonjour" not in patterns_strict
        assert "Bonjour" in patterns_lenient


class TestSpacedRepetitionIntervals:
    """Tests for deriving spaced repetition intervals from Pimsleur data."""

    def test_interval_calculation(self):
        """Calculate intervals between appearances."""
        lesson_counts = {1: 9, 2: 5, 3: 2, 4: 1, 5: 1}

        # Lessons where phrase appears
        lessons = sorted(lesson_counts.keys())

        # Calculate intervals between appearances
        intervals = [lessons[i + 1] - lessons[i] for i in range(len(lessons) - 1)]

        assert intervals == [1, 1, 1, 1], "Consecutive lessons = interval of 1"

    def test_spaced_intervals(self):
        """Detect spaced repetition patterns."""
        # "Je comprends" might appear in lessons 1, 3, 7 (expanding intervals)
        lesson_counts = {1: 5, 3: 2, 7: 1}
        lessons = sorted(lesson_counts.keys())
        intervals = [lessons[i + 1] - lessons[i] for i in range(len(lessons) - 1)]

        assert intervals == [2, 4], "Expanding intervals: 2 then 4"
        assert intervals[1] > intervals[0], "Intervals should expand"

    def test_decay_pattern(self):
        """Count should decrease as mastery increases."""
        lesson_counts = {1: 9, 2: 5, 3: 2, 5: 1}

        counts = [lesson_counts[k] for k in sorted(lesson_counts.keys())]
        # Verify counts decrease (mastery increasing)
        for i in range(len(counts) - 1):
            assert counts[i] >= counts[i + 1], "Repetitions should decrease over time"
