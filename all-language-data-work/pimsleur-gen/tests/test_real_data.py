"""Tests that verify parsing of actual transcript files.

These tests ensure we're correctly extracting data from the real transcripts.
They serve as regression tests to catch parsing bugs.
"""

from datetime import timedelta
from pathlib import Path

import pytest

from src.parser import load_all_lessons, parse_transcript

# Path to research data
RESEARCH_DATA = Path(__file__).parent.parent / "research-data"
FRENCH_TIMESTAMPED = RESEARCH_DATA / "french" / "timestamped-transcripts" / "sentence-level"


@pytest.fixture
def french_lesson_01():
    """Load French lesson 1."""
    path = FRENCH_TIMESTAMPED / "French01_Unit_01_sentencelevel.txt"
    if not path.exists():
        pytest.skip(f"Test data not found: {path}")
    return parse_transcript(path)


@pytest.fixture
def french_lesson_22():
    """Load French lesson 22 (the transition lesson)."""
    path = FRENCH_TIMESTAMPED / "French01_Unit_22_sentencelevel.txt"
    if not path.exists():
        pytest.skip(f"Test data not found: {path}")
    return parse_transcript(path)


@pytest.fixture
def all_french_lessons():
    """Load all French lessons."""
    if not FRENCH_TIMESTAMPED.exists():
        pytest.skip(f"Test data directory not found: {FRENCH_TIMESTAMPED}")
    return load_all_lessons(RESEARCH_DATA, language="french")


class TestFrenchLesson01:
    """Tests for French lesson 1 - Foundation phase."""

    def test_lesson_metadata(self, french_lesson_01):
        """Test basic metadata is correct."""
        assert french_lesson_01.language == "French"
        assert french_lesson_01.level == 1
        assert french_lesson_01.unit == 1

    def test_has_utterances(self, french_lesson_01):
        """Test that lesson has a reasonable number of utterances."""
        # Lesson 1 should have many utterances (heavy instruction)
        assert len(french_lesson_01.utterances) > 100

    def test_first_utterance_is_narrator(self, french_lesson_01):
        """Test that lesson starts with narrator."""
        first = french_lesson_01.utterances[0]
        assert first.speaker == "Narrator"
        assert "Unit One" in first.text

    def test_has_timestamps(self, french_lesson_01):
        """Test that utterances have timestamps."""
        for u in french_lesson_01.utterances[:10]:
            assert u.start_time is not None
            assert u.end_time is not None

    def test_opening_conversation_present(self, french_lesson_01):
        """Test that opening conversation is present."""
        # The opening conversation includes "Pardon, est-ce que vous comprenez l'anglais?"
        texts = [u.text for u in french_lesson_01.utterances[:20]]
        found_pardon = any("Pardon" in t for t in texts)
        assert found_pardon, "Opening conversation should contain 'Pardon'"

    def test_backchaining_example_present(self, french_lesson_01):
        """Test that backchaining is present in L1."""
        # L1 has heavy backchaining - we should see syllable fragments
        texts = [u.text.strip() for u in french_lesson_01.utterances]
        # "Don" and "Par" are part of backchaining "Pardon"
        has_don = any(t == "Don." or t == "Don" for t in texts)
        has_par = any(t == "Par." or t == "Par" for t in texts)
        assert has_don or has_par, "L1 should have backchaining fragments (Don, Par)"

    def test_speaker_distribution(self, french_lesson_01):
        """Test that we have all expected speaker types."""
        speakers = {u.speaker for u in french_lesson_01.utterances}
        assert "Narrator" in speakers
        assert "Male Speaker" in speakers
        assert "Female Speaker" in speakers


class TestFrenchLesson22:
    """Tests for French lesson 22 - The transition lesson."""

    def test_lesson_metadata(self, french_lesson_22):
        """Test basic metadata is correct."""
        assert french_lesson_22.language == "French"
        assert french_lesson_22.level == 1
        assert french_lesson_22.unit == 22

    def test_has_utterances(self, french_lesson_22):
        """Test that lesson has utterances."""
        assert len(french_lesson_22.utterances) > 50

    def test_transition_announcement_present(self, french_lesson_22):
        """Test that the L22 transition announcement is present.

        The narrator explicitly says instructions will now be in French.
        """
        all_text = " ".join(u.text for u in french_lesson_22.utterances[:50])
        # The announcement mentions "instructions in French"
        has_announcement = (
            "instructions in French" in all_text or "Pas de conversation" in all_text
        )
        assert has_announcement, "L22 should have the transition announcement"

    def test_no_opening_conversation(self, french_lesson_22):
        """Test that L22 has no opening conversation.

        L22 explicitly starts with 'Pas de conversation dans cette leçon'.
        """
        first_texts = [u.text for u in french_lesson_22.utterances[:10]]
        all_first = " ".join(first_texts)
        # Should NOT have a typical conversation opening
        assert "Pas de conversation" in all_first, "L22 should announce no conversation"


class TestAllFrenchLessons:
    """Tests for loading all French lessons."""

    def test_load_all_30_lessons(self, all_french_lessons):
        """Test that we load all 30 French lessons."""
        assert len(all_french_lessons) == 30

    def test_lessons_in_order(self, all_french_lessons):
        """Test that lessons are in unit order."""
        units = [lesson.unit for lesson in all_french_lessons]
        assert units == list(range(1, 31))

    def test_all_lessons_have_utterances(self, all_french_lessons):
        """Test that every lesson has utterances."""
        for lesson in all_french_lessons:
            assert len(lesson.utterances) > 0, f"L{lesson.unit} has no utterances"

    def test_all_lessons_have_timestamps(self, all_french_lessons):
        """Test that all lessons have timestamped utterances."""
        for lesson in all_french_lessons:
            has_timestamps = any(u.start_time is not None for u in lesson.utterances)
            assert has_timestamps, f"L{lesson.unit} has no timestamps"

    def test_all_lessons_start_with_narrator(self, all_french_lessons):
        """Test that all lessons start with narrator (or narrator-like speaker).

        Note: Some transcripts have typos like 'Narrative' instead of 'Narrator'.
        """
        narrator_variants = {"Narrator", "Narrative"}  # Known variations in data
        for lesson in all_french_lessons:
            first_speaker = lesson.utterances[0].speaker
            assert first_speaker in narrator_variants, (
                f"L{lesson.unit} starts with '{first_speaker}', not narrator"
            )

    def test_lesson_durations_reasonable(self, all_french_lessons):
        """Test that lesson durations are ~30 minutes."""
        for lesson in all_french_lessons:
            duration = lesson.total_duration
            if duration:
                # Lessons should be roughly 25-35 minutes
                minutes = duration.total_seconds() / 60
                assert 20 < minutes < 40, f"L{lesson.unit} duration {minutes:.1f}m is unusual"


class TestKnownDataIssues:
    """Tests that document known data quality issues.

    These tests verify that known issues in the transcript data are still present.
    If these start failing, it means the underlying data was corrected.
    """

    def test_l6_has_narrative_typo(self, all_french_lessons):
        """L6 has 'Narrative' instead of 'Narrator' at the start."""
        l6 = next(lesson for lesson in all_french_lessons if lesson.unit == 6)
        # This is a known typo - if it's fixed, update test_all_lessons_start_with_narrator
        assert l6.utterances[0].speaker == "Narrative"

    def test_l1_has_french_narrator(self, all_french_lessons):
        """L1 has 'French Narrator' speaker for reading section."""
        l1 = next(lesson for lesson in all_french_lessons if lesson.unit == 1)
        speakers = {u.speaker for u in l1.utterances}
        # This is a known speaker type - used for French reading in later lessons
        assert "French Narrator" in speakers

    def test_l9_has_lowercase_female_speaker(self, all_french_lessons):
        """L9 has 'Female speaker' with lowercase 's'."""
        l9 = next(lesson for lesson in all_french_lessons if lesson.unit == 9)
        speakers = {u.speaker for u in l9.utterances}
        # This is a known typo
        assert "Female speaker" in speakers


class TestDataIntegrity:
    """Tests for data integrity across lessons."""

    def test_speakers_consistent(self, all_french_lessons):
        """Test that speaker names are consistent across all lessons.

        Note: Some transcripts have variations like 'Narrative', 'French Narrator'.
        We allow these known variations but fail on truly unexpected speakers.
        """
        # Known speaker variations in the transcripts
        allowed_speakers = {
            "Narrator",
            "Narrative",  # Typo in L6
            "Male Speaker",
            "Female Speaker",
            "Female speaker",  # Lowercase typo in L9
            "French Narrator",  # Used in L1 for reading section
        }

        for lesson in all_french_lessons:
            speakers = {u.speaker for u in lesson.utterances}
            unexpected = speakers - allowed_speakers
            assert not unexpected, f"L{lesson.unit} has unexpected speakers: {unexpected}"

    def test_timestamps_sequential(self, all_french_lessons):
        """Test that timestamps are sequential within each lesson."""
        for lesson in all_french_lessons:
            prev_end = timedelta(0)
            for i, u in enumerate(lesson.utterances):
                if u.start_time is not None:
                    # Start time should generally be >= previous end
                    # (allow small overlaps for transcription imprecision)
                    assert u.start_time >= prev_end - timedelta(seconds=1), (
                        f"L{lesson.unit} utterance {i}: start_time {u.start_time} "
                        f"is before prev_end {prev_end}"
                    )
                if u.end_time is not None:
                    prev_end = u.end_time

    def test_no_empty_texts(self, all_french_lessons):
        """Test that no utterances have empty text."""
        for lesson in all_french_lessons:
            for i, u in enumerate(lesson.utterances):
                assert u.text.strip(), f"L{lesson.unit} utterance {i} has empty text"
