#!/usr/bin/env python3
"""Convert explicit_phrases CSVs to utterances format for missing lessons.

explicit_phrases format: phrase,teaching_cue,context,speaker_response
utterances format: lesson_number,position_in_lesson,speaker,text,utterance_type,narrator_cue,core_lemmas

Note: explicit_phrases contains unique phrases only (no repetitions tracked).
This is a best-effort conversion for cross-lesson pattern analysis.
"""

import csv
import pathlib
import re

# Map context to utterance_type
CONTEXT_TO_TYPE = {
    "vocabulary_introduction": "VocabularyIntro",
    "phrase_construction": "PhraseConstruction",
    "vocabulary_review": "PromptedRecall",
    "question": "PromptedRecall",
    "question_formation": "PhraseConstruction",
    "negation": "PromptedRecall",
    "pronunciation_practice": "DirectRepetition",
}


def extract_lesson_number(filename: str) -> int:
    """Extract lesson number from filename."""
    match = re.search(r"Lesson_(\d+)", filename)
    if match:
        return int(match.group(1))
    match = re.search(r"lesson_(\d+)", filename)
    if match:
        return int(match.group(1))
    raise ValueError(f"Could not extract lesson number from: {filename}")


def convert_explicit_phrases_csv(input_path: pathlib.Path, output_path: pathlib.Path) -> int:
    """Convert explicit_phrases CSV to utterances format. Returns row count."""
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
            context = row.get("context", "").strip()
            utterance_type = CONTEXT_TO_TYPE.get(context, "DirectRepetition")

            writer.writerow(
                {
                    "lesson_number": lesson_number,
                    "position_in_lesson": position,
                    "speaker": row.get("speaker_response", ""),
                    "text": row.get("phrase", ""),
                    "utterance_type": utterance_type,
                    "narrator_cue": row.get("teaching_cue", ""),
                    "core_lemmas": "",  # Not available in explicit_phrases
                }
            )
            row_count += 1

    return row_count


def main():
    archive_dir = pathlib.Path(
        "99_archive/v1_archive/analysis_outputs_v1/explicit_phrases"
    )
    output_dir = pathlib.Path("02_scripts/analysis")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find explicit_phrases files (exclude _fixed variants)
    input_files = sorted(
        f for f in archive_dir.glob("*_explicit_phrases.csv") if "fixed" not in f.name
    )

    print(f"Found {len(input_files)} explicit_phrases files")

    converted_count = 0
    skipped_count = 0

    for input_path in input_files:
        lesson_num = extract_lesson_number(input_path.name)
        output_path = output_dir / f"lesson_{lesson_num:02d}_utterances.csv"

        # Skip if already exists
        if output_path.exists():
            skipped_count += 1
            continue

        row_count = convert_explicit_phrases_csv(input_path, output_path)
        print(f"  Converted lesson {lesson_num:02d}: {row_count} phrases")
        converted_count += 1

    print(f"\nConverted {converted_count} lessons, skipped {skipped_count} (already exist)")

    # Summary
    existing = sorted(output_dir.glob("lesson_*_utterances.csv"))
    lesson_nums = [extract_lesson_number(f.name) for f in existing]
    print(f"Available lessons: {lesson_nums}")

    all_lessons = set(range(1, 31))
    missing = sorted(all_lessons - set(lesson_nums))
    if missing:
        print(f"Missing lessons: {missing}")
    else:
        print("All 30 lessons now available!")


if __name__ == "__main__":
    main()
