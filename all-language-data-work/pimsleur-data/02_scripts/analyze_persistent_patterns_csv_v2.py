#!/usr/bin/env python3
"""
Analyze persistent utterance patterns using LLM to extract pedagogical elements.
Focuses on utterances appearing in 3+ lessons as these are the core learning targets.
CSV Version: Works on CSV files from analysis directory instead of database.
"""

import argparse
import csv
import json
import os
import pathlib
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Any

from alive_progress import alive_bar
from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()

# ----- Configuration -------------------------------------------------------
MODEL_CASCADE = [
    "mistral-medium-latest",
    "mistral-large-latest",
    "mistral-small-latest",
]
RETRY_DELAY = 5  # seconds


# ----- Lesson Range Parsing ------------------------------------------------
def parse_lesson_range(lessons_arg: list[str]) -> list[int]:
    """Parse lesson arguments supporting ranges like 1-5 or individual numbers."""
    lesson_numbers = []

    for arg in lessons_arg:
        if "-" in arg:
            # Handle range like "1-5"
            start, end = map(int, arg.split("-"))
            lesson_numbers.extend(range(start, end + 1))
        else:
            # Handle individual number
            lesson_numbers.append(int(arg))

    return sorted(set(lesson_numbers))  # Remove duplicates and sort


# ----- CSV Reading ---------------------------------------------------------
@dataclass
class UtteranceData:
    """Represents utterance data from CSV."""

    lesson_number: int
    position_in_lesson: int
    speaker: str
    text: str
    utterance_type: str
    narrator_cue: str
    core_lemmas: str


def read_lesson_csvs(lesson_numbers: list[int], analysis_dir: pathlib.Path) -> list[UtteranceData]:
    """Read utterance data from CSV files for specified lessons."""
    all_utterances = []

    for lesson_num in lesson_numbers:
        csv_path = analysis_dir / f"lesson_{lesson_num:02d}_utterances.csv"

        if not csv_path.exists():
            print(f"⚠️  CSV file not found: {csv_path}")
            continue

        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:
                all_utterances.append(
                    UtteranceData(
                        lesson_number=int(row["lesson_number"]),
                        position_in_lesson=int(row["position_in_lesson"]),
                        speaker=row["speaker"],
                        text=row["text"],
                        utterance_type=row["utterance_type"],
                        narrator_cue=row.get("narrator_cue", ""),
                        core_lemmas=row.get("core_lemmas", ""),
                    )
                )

    return all_utterances


def find_persistent_patterns(
    utterances: list[UtteranceData], min_lessons: int = 3
) -> dict[str, dict]:
    """Find utterances that appear in multiple lessons."""

    # Group utterances by text
    utterance_groups = defaultdict(
        lambda: {"lessons": set(), "total_count": 0, "lesson_counts": defaultdict(int)}
    )

    for utt in utterances:
        # Only consider Male/Female Speaker utterances
        if utt.speaker not in ["Male Speaker", "Female Speaker"]:
            continue

        text = utt.text.strip()
        utterance_groups[text]["lessons"].add(utt.lesson_number)
        utterance_groups[text]["total_count"] += 1
        utterance_groups[text]["lesson_counts"][utt.lesson_number] += 1

    # Filter to patterns appearing in min_lessons or more
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


@dataclass
class PedagogicalElement:
    """Represents a pedagogical element extracted from utterances."""

    utterance_text: str
    vocabulary_words: list[str]
    multi_word_phrases: list[str]
    grammatical_pattern: str
    tier_category: str  # scaffolding, core_conversational, spaced_repetition, contextual_building
    lifecycle_stage: str
    total_lessons: int
    lesson_distribution: dict[int, int]
    # Experimental pattern columns
    simple_structure: str = ""  # Simple: PRONOUN + VERB + ADVERB
    functional_category: str = ""  # greeting, question, response, etc.
    template_pattern: str = ""  # [PRONOUN] [VERB] [OBJECT]


# ----- API Setup -----------------------------------------------------------
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("MISTRAL_API_KEY not found.")
    print("Please create a .env file in the 'pimsleur-data' directory and add your key:")
    print('MISTRAL_API_KEY="your_mistral_api_key"')
    exit(1)

MISTRAL_CLIENT = Mistral(api_key=MISTRAL_API_KEY)


def calculate_lifecycle_stage(
    lesson_counts: dict[int, int], first_lesson: int, last_lesson: int
) -> str:
    """Determine the lifecycle stage based on usage pattern."""
    lessons_list = sorted(lesson_counts.keys())
    total_uses = sum(lesson_counts.values())

    # Check for gaps
    expected_lessons = set(range(first_lesson, last_lesson + 1))
    actual_lessons = set(lessons_list)
    gaps = expected_lessons - actual_lessons

    # Introduction phase: High usage in first 2 lessons
    if len(lessons_list) <= 2 and total_uses >= 10:
        return "introduction"

    # Intensive practice: High frequency in lessons 2-3 after intro
    if len(lessons_list) <= 4 and total_uses >= 20:
        return "intensive_practice"

    # Consolidation: Regular appearance across 3-5 lessons
    if 3 <= len(lessons_list) <= 5 and len(gaps) <= 1:
        return "consolidation"

    # Maintenance: Periodic review after 5+ lessons
    if len(lessons_list) >= 5 and total_uses / len(lessons_list) < 5:
        return "maintenance"

    # Dormant: Gaps of 5+ lessons
    if len(gaps) >= 5:
        return "dormant"

    # Reactivation: Return after dormancy
    if len(gaps) >= 3 and last_lesson in lesson_counts:
        return "reactivation"

    return "active"


def analyze_utterance_with_llm(utterance: str, lesson_counts: dict[int, int]) -> dict[str, Any]:
    """Use Mistral to analyze a persistent utterance for pedagogical elements with model cascade."""

    system_prompt = "You are an expert in language pedagogy and French linguistics. Be consistent with formatting."

    user_prompt = f"""Analyze this French utterance that appears across multiple Pimsleur lessons:

Utterance: "{utterance}"
Lesson appearances: {json.dumps(lesson_counts, sort_keys=True)}

Extract the following information:

1. vocabulary_words: List all individual French vocabulary words (lemmatized forms)
2. multi_word_phrases: List any multi-word phrases (2+ words that form a unit, like "s'il vous plaît")
3. grammatical_pattern: Identify the main grammatical pattern or template (e.g., "Est-ce que + [SUBJECT] + [VERB]")
4. tier_category: Classify into one of these categories based on the pattern of usage:
   - scaffolding: Foundation vocabulary used consistently (pronouns, basic verbs)
   - core_conversational: Social phrases with peak then maintenance
   - spaced_repetition: Topic-specific vocab with clear decay
   - contextual_building: New concepts introduced in learning modules

5. simple_structure: Provide a simple grammatical structure using format: PART1 + PART2 + PART3 (e.g., "PRONOUN + VERB + ADVERB")
6. functional_category: Classify the communicative function (greeting, question, response, negation, politeness, etc.)
7. template_pattern: Create a template with brackets for variable parts (e.g., "[PRONOUN] [VERB] [OBJECT]")

Respond in JSON format with these exact keys."""

    # Try model cascade
    for attempt, model_name in enumerate(MODEL_CASCADE):
        try:
            response = MISTRAL_CLIENT.chat.complete(
                model=model_name,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.0,
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            if attempt < len(MODEL_CASCADE) - 1:
                next_model = MODEL_CASCADE[attempt + 1]
                print(
                    f"\n🔁 Error with {model_name}: {str(e)[:100]}. Retrying with {next_model}..."
                )
                time.sleep(RETRY_DELAY)
            else:
                print(f"\n❌ All models failed for utterance '{utterance[:50]}...': {str(e)[:100]}")

    # Return fallback if all models fail
    return {
        "vocabulary_words": [],
        "multi_word_phrases": [],
        "grammatical_pattern": "",
        "tier_category": "unknown",
        "simple_structure": "",
        "functional_category": "unknown",
        "template_pattern": "",
    }


def extract_templates_from_patterns(
    elements: list[PedagogicalElement],
) -> dict[str, list[PedagogicalElement]]:
    """Group elements by their grammatical patterns to identify templates."""
    templates = defaultdict(list)

    for element in elements:
        if element.grammatical_pattern:
            templates[element.grammatical_pattern].append(element)

    return dict(templates)


# Removed analyze_leftovers function as it requires database access


def analyze_persistent_patterns_csv(
    lesson_numbers: list[int], min_lessons: int = 3, max_utterances: int | None = None
):
    """Analyze persistent utterance patterns from CSV files."""

    project_root = pathlib.Path(__file__).parent.parent
    analysis_dir = project_root / "02_scripts" / "analysis"

    print(f"📁 Reading CSV files for lessons: {lesson_numbers}")

    # Read utterance data from CSV files
    utterances = read_lesson_csvs(lesson_numbers, analysis_dir)
    print(f"📊 Total utterances loaded: {len(utterances)}")

    # Find persistent patterns
    persistent_patterns = find_persistent_patterns(utterances, min_lessons)
    print(
        f"🔍 Found {len(persistent_patterns)} persistent patterns (appearing in {min_lessons}+ lessons)"
    )

    # Sort patterns by total lessons (desc) then by first appearance
    sorted_patterns = sorted(
        persistent_patterns.items(),
        key=lambda x: (-x[1]["total_lessons"], x[1]["first_lesson"]),
    )

    # Limit if specified
    if max_utterances:
        sorted_patterns = sorted_patterns[:max_utterances]
        print(f"🎯 Limited to top {max_utterances} patterns")

    pedagogical_elements = []

    # Analyze each pattern
    print("\n🤖 Analyzing patterns with LLM...")
    with alive_bar(
        len(sorted_patterns),
        title="🤖 Analyzing patterns",
        spinner="waves",
        dual_line=True,
        length=40,
        force_tty=True,
        refresh_secs=0.05,
    ) as bar:
        for text, pattern_data in sorted_patterns:
            lesson_counts = pattern_data["lesson_counts"]
            first_lesson = pattern_data["first_lesson"]
            last_lesson = pattern_data["last_lesson"]
            total_lessons = pattern_data["total_lessons"]

            # Calculate lifecycle stage
            lifecycle_stage = calculate_lifecycle_stage(lesson_counts, first_lesson, last_lesson)

            # Analyze with LLM
            analysis = analyze_utterance_with_llm(text, lesson_counts)

            # Create pedagogical element
            element = PedagogicalElement(
                utterance_text=text,
                vocabulary_words=analysis.get("vocabulary_words", []),
                multi_word_phrases=analysis.get("multi_word_phrases", []),
                grammatical_pattern=analysis.get("grammatical_pattern", ""),
                tier_category=analysis.get("tier_category", "unknown"),
                lifecycle_stage=lifecycle_stage,
                total_lessons=total_lessons,
                lesson_distribution=lesson_counts,
                simple_structure=analysis.get("simple_structure", ""),
                functional_category=analysis.get("functional_category", "unknown"),
                template_pattern=analysis.get("template_pattern", ""),
            )

            pedagogical_elements.append(element)
            bar()

    return pedagogical_elements


def generate_analysis_report(elements: list[PedagogicalElement]):
    """Generate a comprehensive analysis report."""

    # Extract templates
    templates = extract_templates_from_patterns(elements)

    # Quick summary to terminal
    print("\n📊 Analysis Summary:")
    print(f"   Total patterns: {len(elements)}")
    print(f"   Template types: {len(templates)}")

    # Vocabulary analysis
    all_vocab = set()
    multi_word_phrases = set()

    for element in elements:
        all_vocab.update(element.vocabulary_words)
        multi_word_phrases.update(element.multi_word_phrases)

    print(f"   Unique words: {len(all_vocab)}")
    print(f"   Multi-word phrases: {len(multi_word_phrases)}")

    # Save analysis results to markdown
    save_analysis_results(elements, templates)


def export_to_csv(elements: list[PedagogicalElement]):
    """Export analysis results to CSV."""
    import csv

    output_dir = "/Volumes/simons-enjoyment/GitHub/episodic/pimsleur-data/02_scripts/analysis"
    os.makedirs(output_dir, exist_ok=True)

    csv_file = os.path.join(output_dir, "persistent_patterns.csv")

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)

        # Header - include experimental columns
        writer.writerow(
            [
                "utterance_text",
                "vocabulary_words",
                "tier_category",
                "lifecycle_stage",
                "total_lessons",
                "lesson_distribution",
                "simple_structure",
                "functional_category",
                "template_pattern",
            ]
        )

        # Data rows - sort by total_lessons desc, then by first lesson appearance
        sorted_elements = sorted(
            elements,
            key=lambda x: (-x.total_lessons, min(x.lesson_distribution.keys())),
        )

        for elem in sorted_elements:
            # Order lesson distribution from low to high lesson numbers
            ordered_distribution = dict(sorted(elem.lesson_distribution.items()))
            distribution_str = ", ".join([f"L{k}:{v}" for k, v in ordered_distribution.items()])

            writer.writerow(
                [
                    elem.utterance_text,
                    "; ".join(elem.vocabulary_words) if elem.vocabulary_words else "",
                    elem.tier_category,
                    elem.lifecycle_stage,
                    elem.total_lessons,
                    distribution_str,
                    elem.simple_structure,
                    elem.functional_category,
                    elem.template_pattern,
                ]
            )

    print(f"📊 CSV exported to: {csv_file}")
    return csv_file


def save_analysis_results(
    elements: list[PedagogicalElement], templates: dict[str, list[PedagogicalElement]]
):
    """Save analysis results to markdown report."""

    # Fix lesson distribution ordering for all elements
    for elem in elements:
        elem.lesson_distribution = dict(sorted(elem.lesson_distribution.items()))

    # Generate markdown report
    output_dir = "/Volumes/simons-enjoyment/GitHub/episodic/pimsleur-data/02_scripts/analysis"
    os.makedirs(output_dir, exist_ok=True)

    md_file = os.path.join(output_dir, "persistent_pattern_analysis.md")
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# Persistent Pattern Analysis Report\n\n")
        f.write(f"Generated from {len(elements)} patterns\n\n")

        # Group by tier category for detailed output
        tier_groups = defaultdict(list)
        for element in elements:
            tier_groups[element.tier_category].append(element)

        f.write("## Distribution by Tier Category\n\n")
        for tier, tier_elements in sorted(tier_groups.items()):
            f.write(f"### {tier.upper()} ({len(tier_elements)} patterns)\n\n")

            # Show all examples for this tier
            for i, elem in enumerate(tier_elements):
                lessons_str = ", ".join(
                    [f"L{k}:{v}" for k, v in sorted(elem.lesson_distribution.items())]
                )
                f.write(f"{i + 1}. **'{elem.utterance_text}'**\n")
                f.write(f"   - Lessons: {lessons_str}\n")
                f.write(f"   - Stage: {elem.lifecycle_stage}\n")
                if elem.grammatical_pattern:
                    f.write(f"   - Pattern: {elem.grammatical_pattern}\n")
                if elem.functional_category and elem.functional_category != "unknown":
                    f.write(f"   - Function: {elem.functional_category}\n")
                f.write("\n")

        # Top templates
        f.write("## Top Grammatical Templates\n\n")
        sorted_templates = sorted(templates.items(), key=lambda x: len(x[1]), reverse=True)[:15]
        for template, examples in sorted_templates:
            f.write(f"### {template} ({len(examples)} instances)\n\n")
            for ex in examples:
                f.write(f'- "{ex.utterance_text}"\n')
            f.write("\n")

        # Vocabulary analysis
        all_vocab = set()
        multi_word_phrases = set()

        for element in elements:
            all_vocab.update(element.vocabulary_words)
            multi_word_phrases.update(element.multi_word_phrases)

        f.write("## Vocabulary Summary\n\n")
        f.write(f"- **Total unique words**: {len(all_vocab)}\n")
        f.write(f"- **Multi-word phrases**: {len(multi_word_phrases)}\n\n")

        # Lifecycle stages
        lifecycle_counts = defaultdict(int)
        for elem in elements:
            lifecycle_counts[elem.lifecycle_stage] += 1

        f.write("## Lifecycle Stage Distribution\n\n")
        for stage, count in sorted(lifecycle_counts.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(elements)) * 100
            f.write(f"- **{stage}**: {count} ({percentage:.1f}%)\n")

    print(f"📄 Markdown report saved to: {md_file}")
    print("💾 CSV data exported to: analysis/persistent_patterns.csv")


def main():
    """Main function for persistent pattern analysis."""
    parser = argparse.ArgumentParser(
        description="Analyze Persistent Utterance Patterns from CSV files"
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        type=str,
        help="Lesson numbers or ranges to analyze (e.g., --lessons 1 2 3 or --lessons 1-5 or --lessons 1-30)",
    )
    parser.add_argument(
        "--lesson",
        type=str,
        help="Single lesson number or range (e.g., --lesson 1-5). Alternative to --lessons.",
    )
    parser.add_argument(
        "--min-lessons",
        type=int,
        default=3,
        help="Minimum number of lessons for a pattern to be considered persistent (default: 3)",
    )
    parser.add_argument(
        "--max-utterances",
        type=int,
        default=None,
        help="Maximum number of utterances to analyze (default: all)",
    )

    args = parser.parse_args()

    # Parse lesson ranges
    if args.lesson:
        lesson_numbers = parse_lesson_range([args.lesson])
    elif args.lessons:
        lesson_numbers = parse_lesson_range(args.lessons)
    else:
        # Default to lessons 1-5
        lesson_numbers = parse_lesson_range(["1-5"])

    print("🚀 Persistent Pattern Analysis from CSV Files")
    print("=" * 60)
    print(f"📚 Analyzing lessons: {lesson_numbers}")
    print(f"📊 Finding patterns appearing in {args.min_lessons}+ lessons")
    if args.max_utterances:
        print(f"🔢 Limiting to {args.max_utterances} utterances")
    print("=" * 60)

    # Analyze patterns
    elements = analyze_persistent_patterns_csv(
        lesson_numbers, args.min_lessons, args.max_utterances
    )

    # Generate report and save CSV
    generate_analysis_report(elements)
    export_to_csv(elements)

    print("\n✅ Analysis complete!")


if __name__ == "__main__":
    main()
