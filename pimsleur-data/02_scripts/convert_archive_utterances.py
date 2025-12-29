#!/usr/bin/env python3
"""Convert archived utterance analysis CSVs to current format.

Archived format: utterance_text,speaker,utterance_type,narrator_cue,core_lemmas
Current format:  lesson_number,position_in_lesson,speaker,text,utterance_type,narrator_cue,core_lemmas
"""

import csv
import pathlib
import re


def extract_lesson_number(filename: str) -> int:
    """Extract lesson number from filename patterns:
    - 'French_I_-_Lesson_06_utterance_analysis.csv' (archived)
    - 'lesson_06_utterances.csv' (current)
    """
    # Try archived format first
    match = re.search(r"Lesson_(\d+)", filename)
    if match:
        return int(match.group(1))
    # Try current format
    match = re.search(r"lesson_(\d+)", filename)
    if match:
        return int(match.group(1))
    raise ValueError(f"Could not extract lesson number from: {filename}")


def convert_utterance_csv(input_path: pathlib.Path, output_path: pathlib.Path) -> int:
    """Convert a single archived CSV to current format. Returns row count."""
    lesson_number = extract_lesson_number(input_path.name)

    with open(input_path, encoding="utf-8") as infile, open(
        output_path, "w", encoding="utf-8", newline=""
    ) as outfile:
        reader = csv.DictReader(infile)
        fieldnames = [
            "lesson_number",
            "position_in_lesson",
            "speaker",
            "text",
            "utterance_type",
            "narrator_cue",
            "core_lemmas",
        ]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        row_count = 0
        for position, row in enumerate(reader, start=1):
            writer.writerow(
                {
                    "lesson_number": lesson_number,
                    "position_in_lesson": position,
                    "speaker": row.get("speaker", ""),
                    "text": row.get("utterance_text", ""),
                    "utterance_type": row.get("utterance_type", ""),
                    "narrator_cue": row.get("narrator_cue", ""),
                    "core_lemmas": row.get("core_lemmas", ""),
                }
            )
            row_count += 1

    return row_count


def main():
    archive_dir = pathlib.Path(
        "99_archive/v1_archive/analysis_outputs_v1/utterances"
    )
    output_dir = pathlib.Path("02_scripts/analysis")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all non-fixed utterance analysis files
    input_files = sorted(
        f for f in archive_dir.glob("*_utterance_analysis.csv") if "fixed" not in f.name
    )

    print(f"Found {len(input_files)} archived utterance files")

    for input_path in input_files:
        lesson_num = extract_lesson_number(input_path.name)
        output_path = output_dir / f"lesson_{lesson_num:02d}_utterances.csv"

        # Skip if already exists (don't overwrite lessons 1-5)
        if output_path.exists():
            print(f"  Skipping lesson {lesson_num:02d} (already exists)")
            continue

        row_count = convert_utterance_csv(input_path, output_path)
        print(f"  Converted lesson {lesson_num:02d}: {row_count} utterances")

    print("\nConversion complete!")

    # List what we have now
    existing = sorted(output_dir.glob("lesson_*_utterances.csv"))
    lesson_nums = [extract_lesson_number(f.name) for f in existing]
    print(f"Available lessons: {lesson_nums}")

    # Find gaps
    all_lessons = set(range(1, 31))
    missing = sorted(all_lessons - set(lesson_nums))
    if missing:
        print(f"Missing lessons: {missing}")


if __name__ == "__main__":
    main()
