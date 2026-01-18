"""Tests for Pydantic models."""

from datetime import timedelta

import pytest

from src.models import Lesson, Utterance


class TestUtterance:
    """Tests for Utterance model."""

    def test_utterance_creation_minimal(self):
        """Test creating utterance with minimal fields."""
        u = Utterance(speaker="Narrator", text="Hello world")
        assert u.speaker == "Narrator"
        assert u.text == "Hello world"
        assert u.start_time is None
        assert u.end_time is None

    def test_utterance_creation_with_timestamps(self):
        """Test creating utterance with timestamps."""
        u = Utterance(
            speaker="Male Speaker",
            text="Bonjour",
            start_time=timedelta(seconds=5),
            end_time=timedelta(seconds=8),
        )
        assert u.speaker == "Male Speaker"
        assert u.start_time == timedelta(seconds=5)
        assert u.end_time == timedelta(seconds=8)

    def test_duration_with_timestamps(self):
        """Test duration calculation with timestamps."""
        u = Utterance(
            speaker="Male Speaker",
            text="Test",
            start_time=timedelta(seconds=10),
            end_time=timedelta(seconds=15),
        )
        assert u.duration == timedelta(seconds=5)

    def test_duration_without_timestamps(self):
        """Test duration is None when timestamps missing."""
        u = Utterance(speaker="Narrator", text="Test")
        assert u.duration is None

    def test_duration_with_partial_timestamps(self):
        """Test duration is None with only start_time."""
        u = Utterance(
            speaker="Narrator",
            text="Test",
            start_time=timedelta(seconds=10),
        )
        assert u.duration is None

    def test_is_instruction_narrator(self):
        """Test is_instruction is True for Narrator."""
        u = Utterance(speaker="Narrator", text="Say hello")
        assert u.is_instruction is True

    def test_is_instruction_speaker(self):
        """Test is_instruction is False for speakers."""
        u = Utterance(speaker="Male Speaker", text="Bonjour")
        assert u.is_instruction is False

    def test_is_target_language_male_speaker(self):
        """Test is_target_language for Male Speaker."""
        u = Utterance(speaker="Male Speaker", text="Bonjour")
        assert u.is_target_language is True

    def test_is_target_language_female_speaker(self):
        """Test is_target_language for Female Speaker."""
        u = Utterance(speaker="Female Speaker", text="Merci")
        assert u.is_target_language is True

    def test_is_target_language_narrator(self):
        """Test is_target_language is False for Narrator."""
        u = Utterance(speaker="Narrator", text="How do you say...")
        assert u.is_target_language is False


class TestLesson:
    """Tests for Lesson model."""

    @pytest.fixture
    def sample_utterances(self) -> list[Utterance]:
        """Create sample utterances for testing."""
        return [
            Utterance(
                speaker="Narrator",
                text="This is Unit One.",
                start_time=timedelta(seconds=0),
                end_time=timedelta(seconds=5),
            ),
            Utterance(
                speaker="Male Speaker",
                text="Bonjour",
                start_time=timedelta(seconds=5),
                end_time=timedelta(seconds=7),
            ),
            Utterance(
                speaker="Female Speaker",
                text="Bonjour",
                start_time=timedelta(seconds=7),
                end_time=timedelta(seconds=9),
            ),
            Utterance(
                speaker="Narrator",
                text="Say hello.",
                start_time=timedelta(seconds=9),
                end_time=timedelta(seconds=11),
            ),
            Utterance(
                speaker="Male Speaker",
                text="Au revoir",
                start_time=timedelta(seconds=11),
                end_time=timedelta(seconds=14),
            ),
        ]

    def test_lesson_creation(self, sample_utterances: list[Utterance]):
        """Test creating a lesson."""
        lesson = Lesson(
            language="French",
            level=1,
            unit=1,
            utterances=sample_utterances,
        )
        assert lesson.language == "French"
        assert lesson.level == 1
        assert lesson.unit == 1
        assert len(lesson.utterances) == 5

    def test_total_duration(self, sample_utterances: list[Utterance]):
        """Test total_duration from last utterance."""
        lesson = Lesson(
            language="French",
            level=1,
            unit=1,
            utterances=sample_utterances,
        )
        assert lesson.total_duration == timedelta(seconds=14)

    def test_total_duration_empty_lesson(self):
        """Test total_duration for empty lesson."""
        lesson = Lesson(language="French", level=1, unit=1, utterances=[])
        assert lesson.total_duration is None

    def test_instruction_count(self, sample_utterances: list[Utterance]):
        """Test counting narrator instructions."""
        lesson = Lesson(
            language="French",
            level=1,
            unit=1,
            utterances=sample_utterances,
        )
        assert lesson.instruction_count == 2

    def test_target_language_count(self, sample_utterances: list[Utterance]):
        """Test counting target language utterances."""
        lesson = Lesson(
            language="French",
            level=1,
            unit=1,
            utterances=sample_utterances,
        )
        assert lesson.target_language_count == 3

    def test_get_unique_phrases(self, sample_utterances: list[Utterance]):
        """Test getting unique target language phrases."""
        lesson = Lesson(
            language="French",
            level=1,
            unit=1,
            utterances=sample_utterances,
        )
        phrases = lesson.get_unique_phrases()
        # "Bonjour" appears twice but should only be counted once
        assert phrases == ["Bonjour", "Au revoir"]

    def test_get_unique_phrases_preserves_order(self):
        """Test unique phrases preserves first-seen order."""
        utterances = [
            Utterance(speaker="Male Speaker", text="A"),
            Utterance(speaker="Male Speaker", text="B"),
            Utterance(speaker="Male Speaker", text="A"),  # duplicate
            Utterance(speaker="Male Speaker", text="C"),
            Utterance(speaker="Male Speaker", text="B"),  # duplicate
        ]
        lesson = Lesson(language="French", level=1, unit=1, utterances=utterances)
        assert lesson.get_unique_phrases() == ["A", "B", "C"]
