"""Display Pimsleur French course analysis from structured data."""

import json
from pathlib import Path


def main():
    """Load and display course metrics from JSON."""
    metrics_path = Path("data/french_lesson_metrics.json")

    if not metrics_path.exists():
        print("Error: data/french_lesson_metrics.json not found")
        print("Run manual analysis first to generate this file.")
        return

    with open(metrics_path) as f:
        data = json.load(f)

    print("=" * 80)
    print("PIMSLEUR FRENCH LEVEL 1 - MANUAL ANALYSIS SUMMARY")
    print("=" * 80)
    print()

    # Summary stats
    summary = data["summary"]
    print(f"Total lessons: {summary['total_lessons']}")
    print(f"Total vocabulary items: {summary['total_vocabulary_items']}")
    print()

    # Phases
    print("COURSE PHASES")
    print("-" * 40)
    for phase in summary["phases"]:
        print(f"\n{phase['name']} (L{phase['lessons']})")
        print(f"  Themes: {', '.join(phase['theme_focus'])}")
        for char in phase["characteristics"]:
            print(f"  - {char}")

    print()
    print("=" * 80)
    print("KEY TRANSITIONS")
    print("=" * 80)
    for transition in summary["key_transitions"]:
        print(f"  L{transition['lesson']:2d}: {transition['change']}")

    print()
    print("=" * 80)
    print("LESSON METRICS")
    print("=" * 80)
    print()
    print(f"{'Unit':<6} {'Back':<6} {'FR Instr':<10} {'Conv':<6} {'Read':<6} {'Theme'}")
    print("-" * 70)

    for lesson in data["lessons"]:
        unit = lesson["unit"]
        back = lesson.get("backchaining_count", 0)
        fr_instr = lesson.get("french_instructions_count", 0)
        conv = "Yes" if lesson.get("has_opening_conversation") else "No"
        read = "Yes" if lesson.get("has_reading_section") else "No"
        theme = lesson.get("theme", "")[:20]

        print(f"{unit:<6} {back:<6} {fr_instr:<10} {conv:<6} {read:<6} {theme}")

    print()
    print("=" * 80)
    print("SPACED REPETITION PATTERNS")
    print("=" * 80)

    if "spaced_repetition" in data:
        sr = data["spaced_repetition"]
        print(f"\nMethodology: {sr['methodology']}")
        print()
        for phrase_data in sr["tracked_phrases"][:5]:
            print(f"  '{phrase_data['phrase']}'")
            print(f"    Pattern: {phrase_data['pattern']}")
            print(f"    Appears in: {phrase_data['total_lessons_appearing']} lessons")
            if "notes" in phrase_data:
                print(f"    Notes: {phrase_data['notes']}")
            print()

        print("Key findings:")
        for finding in sr.get("key_findings", []):
            print(f"  - {finding}")

    print()
    print("=" * 80)
    print("VOCABULARY THEMES")
    print("=" * 80)

    if "vocabulary_themes" in data:
        for theme, info in data["vocabulary_themes"].items():
            lessons = info.get("lessons", [])
            words = info.get("words", [])[:5]
            print(f"  {theme}: L{lessons} -> {', '.join(words)}")


if __name__ == "__main__":
    main()
