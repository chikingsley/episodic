"""Tests for transcript parser."""

from datetime import timedelta
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest

from src.parser import (
    load_all_lessons,
    parse_plain_transcript,
    parse_timestamp,
    parse_timestamped_transcript,
    parse_transcript,
)


class TestParseTimestamp:
    """Tests for timestamp parsing."""

    def test_parse_zero_timestamp(self):
        """Test parsing zero timestamp."""
        result = parse_timestamp("00:00:00,000")
        assert result == timedelta(0)

    def test_parse_seconds_only(self):
        """Test parsing seconds."""
        result = parse_timestamp("00:00:05,000")
        assert result == timedelta(seconds=5)

    def test_parse_minutes_and_seconds(self):
        """Test parsing minutes and seconds."""
        result = parse_timestamp("00:02:30,000")
        assert result == timedelta(minutes=2, seconds=30)

    def test_parse_with_milliseconds(self):
        """Test parsing with milliseconds."""
        result = parse_timestamp("00:00:00,500")
        assert result == timedelta(milliseconds=500)

    def test_parse_full_timestamp(self):
        """Test parsing full timestamp."""
        result = parse_timestamp("01:23:45,678")
        assert result == timedelta(hours=1, minutes=23, seconds=45, milliseconds=678)

    def test_invalid_timestamp_raises(self):
        """Test that invalid timestamp raises ValueError."""
        with pytest.raises(ValueError, match="Invalid timestamp"):
            parse_timestamp("invalid")

    def test_wrong_format_raises(self):
        """Test that wrong format raises ValueError."""
        with pytest.raises(ValueError, match="Invalid timestamp"):
            parse_timestamp("00:00:00.000")  # dot instead of comma


class TestParseTimestampedTranscript:
    """Tests for timestamped transcript parsing."""

    def test_parse_simple_transcript(self):
        """Test parsing a simple timestamped transcript."""
        content = """00:00:00,099 --> 00:00:05,339 [Narrator]
This is Unit One of Pimsleur's French One.

00:00:05,339 --> 00:00:08,720 [Male Speaker]
Pardon, est-ce que vous comprenez l'anglais?

00:00:08,720 --> 00:00:12,438 [Female Speaker]
Non, Monsieur. Je ne comprends pas l'anglais.
"""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "French01_Unit_01_sentencelevel.txt"
            path.write_text(content)

            lesson = parse_timestamped_transcript(path)

            assert lesson.language == "French"
            assert lesson.level == 1
            assert lesson.unit == 1
            assert len(lesson.utterances) == 3

            # Check first utterance
            assert lesson.utterances[0].speaker == "Narrator"
            assert "Unit One" in lesson.utterances[0].text
            assert lesson.utterances[0].start_time == timedelta(milliseconds=99)
            assert lesson.utterances[0].end_time == timedelta(seconds=5, milliseconds=339)

            # Check second utterance
            assert lesson.utterances[1].speaker == "Male Speaker"
            assert "Pardon" in lesson.utterances[1].text

            # Check third utterance
            assert lesson.utterances[2].speaker == "Female Speaker"
            assert "Monsieur" in lesson.utterances[2].text

    def test_parse_multiline_utterance(self):
        """Test parsing utterance with multiple lines of text."""
        content = """00:00:00,000 --> 00:00:10,000 [Narrator]
This is line one.
This is line two.
This is line three.

00:00:10,000 --> 00:00:15,000 [Male Speaker]
Bonjour.
"""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "French01_Unit_02_sentencelevel.txt"
            path.write_text(content)

            lesson = parse_timestamped_transcript(path)
            assert len(lesson.utterances) == 2
            assert "line one" in lesson.utterances[0].text
            assert "line two" in lesson.utterances[0].text
            assert "line three" in lesson.utterances[0].text

    def test_invalid_filename_raises(self):
        """Test that invalid filename raises ValueError."""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "invalid_filename.txt"
            path.write_text("00:00:00,000 --> 00:00:05,000 [Narrator]\nTest")

            with pytest.raises(ValueError, match="Cannot parse filename"):
                parse_timestamped_transcript(path)


class TestParsePlainTranscript:
    """Tests for plain (no timestamp) transcript parsing."""

    def test_parse_plain_transcript(self):
        """Test parsing plain transcript without timestamps."""
        content = """[Narrator]
This is Unit One.

[Male Speaker]
Bonjour.

[Female Speaker]
Merci.
"""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "French01_Unit_03_human_eval.txt"
            path.write_text(content)

            lesson = parse_plain_transcript(path)

            assert lesson.language == "French"
            assert lesson.level == 1
            assert lesson.unit == 3
            assert len(lesson.utterances) == 3

            assert lesson.utterances[0].speaker == "Narrator"
            assert lesson.utterances[0].start_time is None
            assert lesson.utterances[1].speaker == "Male Speaker"
            assert lesson.utterances[2].speaker == "Female Speaker"


class TestParseTranscript:
    """Tests for auto-detecting transcript format."""

    def test_auto_detect_timestamped(self):
        """Test auto-detecting timestamped format."""
        content = """00:00:00,000 --> 00:00:05,000 [Narrator]
Test content.
"""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "French01_Unit_01_test.txt"
            path.write_text(content)

            lesson = parse_transcript(path)
            assert lesson.utterances[0].start_time is not None

    def test_auto_detect_plain(self):
        """Test auto-detecting plain format."""
        content = """[Narrator]
Test content.
"""
        with TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "French01_Unit_01_test.txt"
            path.write_text(content)

            lesson = parse_transcript(path)
            assert lesson.utterances[0].start_time is None


class TestLoadAllLessons:
    """Tests for loading all lessons from a directory."""

    def test_load_timestamped_lessons(self):
        """Test loading lessons from timestamped directory."""
        with TemporaryDirectory() as tmpdir:
            # Create directory structure
            lang_dir = Path(tmpdir) / "french" / "timestamped-transcripts" / "sentence-level"
            lang_dir.mkdir(parents=True)

            # Create two lesson files
            (lang_dir / "French01_Unit_01_sentencelevel.txt").write_text(
                """00:00:00,000 --> 00:00:05,000 [Narrator]
Unit one content.
"""
            )
            (lang_dir / "French01_Unit_02_sentencelevel.txt").write_text(
                """00:00:00,000 --> 00:00:05,000 [Narrator]
Unit two content.
"""
            )

            lessons = load_all_lessons(Path(tmpdir), language="french")

            assert len(lessons) == 2
            assert lessons[0].unit == 1
            assert lessons[1].unit == 2

    def test_lessons_sorted_by_unit(self):
        """Test that lessons are sorted by language, level, unit."""
        with TemporaryDirectory() as tmpdir:
            lang_dir = Path(tmpdir) / "french" / "timestamped-transcripts" / "sentence-level"
            lang_dir.mkdir(parents=True)

            # Create files in reverse order
            (lang_dir / "French01_Unit_03_sentencelevel.txt").write_text(
                "00:00:00,000 --> 00:00:01,000 [Narrator]\nThree\n"
            )
            (lang_dir / "French01_Unit_01_sentencelevel.txt").write_text(
                "00:00:00,000 --> 00:00:01,000 [Narrator]\nOne\n"
            )
            (lang_dir / "French01_Unit_02_sentencelevel.txt").write_text(
                "00:00:00,000 --> 00:00:01,000 [Narrator]\nTwo\n"
            )

            lessons = load_all_lessons(Path(tmpdir), language="french")

            assert [lesson.unit for lesson in lessons] == [1, 2, 3]
