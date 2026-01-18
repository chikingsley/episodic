"""Parse Pimsleur transcript files into structured data."""

import re
from datetime import timedelta
from pathlib import Path

from .models import Lesson, Utterance


def parse_timestamp(ts: str) -> timedelta:
    """Parse timestamp like '00:01:23,456' into timedelta."""
    match = re.match(r"(\d{2}):(\d{2}):(\d{2}),(\d{3})", ts)
    if not match:
        raise ValueError(f"Invalid timestamp: {ts}")
    hours, minutes, seconds, millis = map(int, match.groups())
    return timedelta(hours=hours, minutes=minutes, seconds=seconds, milliseconds=millis)


def parse_timestamped_transcript(path: Path) -> Lesson:
    """Parse a timestamped transcript file.

    Format:
        00:00:00,099 --> 00:00:05,339 [Narrator]
        This is Unit One of Pimsleur's French One.
    """
    # Extract language/level/unit from filename
    # e.g., French01_Unit_01_sentencelevel.txt
    match = re.match(r"([A-Za-z]+)(\d+)_Unit_(\d+)", path.stem)
    if not match:
        raise ValueError(f"Cannot parse filename: {path.name}")

    language = match.group(1)
    level = int(match.group(2))
    unit = int(match.group(3))

    utterances = []
    content = path.read_text(encoding="utf-8")

    # Pattern: timestamp --> timestamp [Speaker]\nText
    pattern = re.compile(
        r"(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})\s*\[([^\]]+)\]\s*\n(.+?)(?=\n\n|\n\d{2}:\d{2}|\Z)",
        re.DOTALL
    )

    for match in pattern.finditer(content):
        start_ts, end_ts, speaker, text = match.groups()
        utterances.append(Utterance(
            speaker=speaker.strip(),
            text=text.strip(),
            start_time=parse_timestamp(start_ts),
            end_time=parse_timestamp(end_ts),
        ))

    return Lesson(
        language=language,
        level=level,
        unit=unit,
        utterances=utterances,
    )


def parse_plain_transcript(path: Path) -> Lesson:
    """Parse a plain transcript file (no timestamps).

    Format:
        [Narrator]
        This is Unit One of Pimsleur's French One.
    """
    # Extract language/level/unit from filename
    # e.g., French01_Unit_01_human_eval.txt
    match = re.match(r"([A-Za-z]+)(\d+)_Unit_(\d+)", path.stem)
    if not match:
        raise ValueError(f"Cannot parse filename: {path.name}")

    language = match.group(1)
    level = int(match.group(2))
    unit = int(match.group(3))

    utterances = []
    content = path.read_text(encoding="utf-8")

    # Pattern: [Speaker]\nText
    pattern = re.compile(
        r"\[([^\]]+)\]\s*\n(.+?)(?=\n\[|\Z)",
        re.DOTALL
    )

    for match in pattern.finditer(content):
        speaker, text = match.groups()
        utterances.append(Utterance(
            speaker=speaker.strip(),
            text=text.strip(),
        ))

    return Lesson(
        language=language,
        level=level,
        unit=unit,
        utterances=utterances,
    )


def parse_transcript(path: Path) -> Lesson:
    """Auto-detect format and parse transcript."""
    content = path.read_text(encoding="utf-8")

    # Check if it has timestamps
    if re.search(r"\d{2}:\d{2}:\d{2},\d{3}\s*-->", content):
        return parse_timestamped_transcript(path)
    else:
        return parse_plain_transcript(path)


def load_all_lessons(data_dir: Path, language: str | None = None) -> list[Lesson]:
    """Load all lessons from a data directory."""
    lessons = []

    if language:
        lang_dirs = [data_dir / language]
    else:
        lang_dirs = [d for d in data_dir.iterdir() if d.is_dir() and not d.name.startswith(".")]

    for lang_dir in lang_dirs:
        # Prefer timestamped if available
        ts_dir = lang_dir / "timestamped-transcripts" / "sentence-level"
        if ts_dir.exists():
            for f in sorted(ts_dir.glob("*.txt")):
                lessons.append(parse_transcript(f))
        else:
            # Fall back to plain transcripts
            for f in sorted(lang_dir.glob("*_human_eval.txt")) or sorted(lang_dir.glob("*_raw.*")):
                lessons.append(parse_transcript(f))

    return sorted(lessons, key=lambda lesson: (lesson.language, lesson.level, lesson.unit))
