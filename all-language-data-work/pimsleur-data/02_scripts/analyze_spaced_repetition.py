#!/usr/bin/env python3
"""Analyze spaced repetition patterns across all 30 Pimsleur lessons.

This script extracts:
1. Persistent patterns (utterances appearing in 3+ lessons)
2. Repetition intervals between lesson appearances
3. Decay patterns (count changes over time)
4. Pattern classification (scaffolding, intensive, maintenance, etc.)

No LLM calls required - pure algorithmic analysis.
"""

import csv
import pathlib
import re
from collections import defaultdict
from dataclasses import dataclass, field


@dataclass
class UtterancePattern:
    """Pattern of an utterance across lessons."""

    text: str
    lessons: list[int] = field(default_factory=list)
    lesson_counts: dict[int, int] = field(default_factory=dict)
    total_count: int = 0

    @property
    def first_lesson(self) -> int:
        return min(self.lessons) if self.lessons else 0

    @property
    def last_lesson(self) -> int:
        return max(self.lessons) if self.lessons else 0

    @property
    def span(self) -> int:
        return self.last_lesson - self.first_lesson + 1 if self.lessons else 0

    @property
    def coverage(self) -> float:
        """Percentage of span where utterance appears."""
        return len(self.lessons) / self.span if self.span > 0 else 0

    def intervals(self) -> list[int]:
        """Calculate intervals between lesson appearances."""
        sorted_lessons = sorted(self.lessons)
        return [sorted_lessons[i + 1] - sorted_lessons[i] for i in range(len(sorted_lessons) - 1)]

    def decay_trend(self) -> str:
        """Analyze if counts decay over time (sign of mastery)."""
        if len(self.lesson_counts) < 2:
            return "insufficient_data"

        sorted_counts = [self.lesson_counts[k] for k in sorted(self.lesson_counts.keys())]

        # Check if counts are decreasing
        decreasing = all(sorted_counts[i] >= sorted_counts[i + 1] for i in range(len(sorted_counts) - 1))
        increasing = all(sorted_counts[i] <= sorted_counts[i + 1] for i in range(len(sorted_counts) - 1))

        if decreasing:
            return "decaying"  # Sign of mastery - less practice needed
        elif increasing:
            return "growing"  # Being reinforced more
        else:
            return "variable"

    def classify_pattern(self) -> str:
        """Classify the repetition pattern type."""
        intervals = self.intervals()

        if len(self.lessons) == 1:
            return "single_lesson"

        if len(self.lessons) == 2 and self.span <= 2:
            return "clustered"

        if not intervals:
            return "unknown"

        # Check for expanding intervals (classic spaced repetition)
        if len(intervals) >= 2:
            is_expanding = all(intervals[i] <= intervals[i + 1] for i in range(len(intervals) - 1))
            if is_expanding and intervals[-1] > intervals[0]:
                return "expanding_intervals"  # True spaced repetition

        # High coverage = persistent scaffolding
        if self.coverage >= 0.7:
            return "persistent_scaffolding"

        # Appears in many lessons but with gaps
        if len(self.lessons) >= 5:
            return "recurring_review"

        return "intermediate"


def extract_lesson_number(filename: str) -> int:
    """Extract lesson number from filename."""
    match = re.search(r"lesson_(\d+)", filename)
    if match:
        return int(match.group(1))
    raise ValueError(f"Could not extract lesson number from: {filename}")


def normalize_text(text: str) -> str:
    """Normalize text for comparison."""
    # Remove trailing punctuation, lowercase, strip whitespace
    normalized = re.sub(r"[.!?,:;]+$", "", text.strip()).lower()
    return normalized


def load_all_utterances(analysis_dir: pathlib.Path) -> dict[str, UtterancePattern]:
    """Load all utterances from lesson CSVs and group by normalized text."""
    patterns: dict[str, UtterancePattern] = {}

    csv_files = sorted(analysis_dir.glob("lesson_*_utterances.csv"))
    print(f"Found {len(csv_files)} lesson files")

    for csv_path in csv_files:
        lesson_num = extract_lesson_number(csv_path.name)

        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:
                text = row.get("text", "").strip()
                if not text:
                    continue

                # Only count Male/Female Speaker utterances
                speaker = row.get("speaker", "")
                if speaker not in ["Male Speaker", "Female Speaker"]:
                    continue

                normalized = normalize_text(text)

                if normalized not in patterns:
                    patterns[normalized] = UtterancePattern(text=text)

                pattern = patterns[normalized]
                if lesson_num not in pattern.lessons:
                    pattern.lessons.append(lesson_num)
                pattern.lesson_counts[lesson_num] = pattern.lesson_counts.get(lesson_num, 0) + 1
                pattern.total_count += 1

    return patterns


def analyze_patterns(patterns: dict[str, UtterancePattern], min_lessons: int = 3):
    """Analyze patterns appearing in multiple lessons."""
    persistent = {k: v for k, v in patterns.items() if len(v.lessons) >= min_lessons}

    # Sort by number of lessons (desc) then by first appearance
    sorted_patterns = sorted(
        persistent.values(),
        key=lambda p: (-len(p.lessons), p.first_lesson),
    )

    return sorted_patterns


def generate_report(patterns: list[UtterancePattern], output_dir: pathlib.Path):
    """Generate analysis reports."""

    output_dir.mkdir(parents=True, exist_ok=True)

    # ----- Summary Statistics -----
    print("\n" + "=" * 70)
    print("PIMSLEUR SPACED REPETITION ANALYSIS")
    print("=" * 70)

    print(f"\nPatterns appearing in 3+ lessons: {len(patterns)}")

    # Classify patterns
    classification_counts = defaultdict(int)
    decay_counts = defaultdict(int)

    for p in patterns:
        classification_counts[p.classify_pattern()] += 1
        decay_counts[p.decay_trend()] += 1

    print("\n--- Pattern Classifications ---")
    for cls, count in sorted(classification_counts.items(), key=lambda x: -x[1]):
        print(f"  {cls}: {count}")

    print("\n--- Decay Trends ---")
    for trend, count in sorted(decay_counts.items(), key=lambda x: -x[1]):
        print(f"  {trend}: {count}")

    # ----- Top Persistent Patterns -----
    print("\n--- Top 20 Most Persistent Phrases ---")
    for i, p in enumerate(patterns[:20], 1):
        intervals = p.intervals()
        interval_str = " → ".join(str(i) for i in intervals) if intervals else "N/A"
        print(f"{i:2}. [{len(p.lessons)} lessons] {p.text}")
        print(f"      Lessons: {sorted(p.lessons)}")
        print(f"      Intervals: {interval_str}")
        print(f"      Pattern: {p.classify_pattern()}, Decay: {p.decay_trend()}")

    # ----- Spaced Repetition Patterns -----
    expanding = [p for p in patterns if p.classify_pattern() == "expanding_intervals"]
    print(f"\n--- Phrases with Expanding Intervals (True Spaced Repetition): {len(expanding)} ---")
    for p in expanding[:10]:
        intervals = p.intervals()
        print(f"  • {p.text}")
        print(f"    Intervals: {intervals} (lessons {sorted(p.lessons)})")

    # ----- CSV Output -----
    csv_path = output_dir / "spaced_repetition_patterns.csv"
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "text",
            "num_lessons",
            "first_lesson",
            "last_lesson",
            "span",
            "coverage",
            "total_count",
            "intervals",
            "pattern_type",
            "decay_trend",
            "lessons",
        ])

        for p in patterns:
            writer.writerow([
                p.text,
                len(p.lessons),
                p.first_lesson,
                p.last_lesson,
                p.span,
                round(p.coverage, 2),
                p.total_count,
                str(p.intervals()),
                p.classify_pattern(),
                p.decay_trend(),
                str(sorted(p.lessons)),
            ])

    print(f"\n✓ Saved detailed patterns to: {csv_path}")

    # ----- Interval Statistics -----
    all_intervals = []
    for p in patterns:
        all_intervals.extend(p.intervals())

    if all_intervals:
        avg_interval = sum(all_intervals) / len(all_intervals)
        print("\n--- Interval Statistics ---")
        print(f"  Total intervals measured: {len(all_intervals)}")
        print(f"  Average interval: {avg_interval:.2f} lessons")
        print(f"  Min interval: {min(all_intervals)}")
        print(f"  Max interval: {max(all_intervals)}")

        # Distribution
        interval_dist = defaultdict(int)
        for i in all_intervals:
            interval_dist[i] += 1

        print("\n  Interval distribution:")
        for interval in sorted(interval_dist.keys()):
            count = interval_dist[interval]
            bar = "█" * (count // 5)
            print(f"    {interval:2} lessons: {count:4} {bar}")


def main():
    project_root = pathlib.Path(__file__).parent.parent
    analysis_dir = project_root / "02_scripts" / "analysis"
    output_dir = analysis_dir / "output"

    print("Loading utterances from all lessons...")
    patterns = load_all_utterances(analysis_dir)
    print(f"Total unique phrases: {len(patterns)}")

    print("\nAnalyzing persistent patterns...")
    persistent = analyze_patterns(patterns, min_lessons=3)

    generate_report(persistent, output_dir)

    print("\n" + "=" * 70)
    print("Analysis complete!")


if __name__ == "__main__":
    main()
