#!/usr/bin/env python3
"""
Analyze persistent utterance patterns using LLM to extract pedagogical elements.
Focuses on utterances appearing in 3+ lessons as these are the core learning targets.
"""

import argparse
import json
import os
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Any

from alive_progress import alive_bar
from database_writer import DatabaseWriter
from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()

# ----- Configuration -------------------------------------------------------
MODEL_CASCADE = [
    "mistral-medium-latest",
    "mistral-large-latest",
    "magistral-medium-latest",
    "magistral-medium-latest",
    "magistral-small-latest",
    "mistral-small-latest",
]
RETRY_DELAY = 5  # seconds


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


def analyze_leftovers():
    """Find utterances that exist in utterances table but not in utterance_patterns (leftovers)."""

    with DatabaseWriter() as db, db.conn.cursor() as cur:
        print("🔍 Analyzing leftovers (utterances not in patterns)...")

        # Find utterances that are not in utterance_patterns
        cur.execute("""
                SELECT DISTINCT u.text, l.lesson_number, COUNT(*) as occurrences
                FROM utterances u
                JOIN lessons l ON u.lesson_id = l.id
                WHERE u.speaker IN ('Male Speaker', 'Female Speaker')
                  AND u.text IS NOT NULL
                  AND LENGTH(TRIM(u.text)) > 0
                  AND u.text NOT IN (SELECT utterance_text FROM utterance_patterns)
                GROUP BY u.text, l.lesson_number
                ORDER BY u.text, l.lesson_number
            """)

        leftovers = cur.fetchall()

        if leftovers:
            print(f"🔍 Found {len(leftovers)} leftover utterance-lesson combinations")

            # Group leftovers by text
            leftover_groups = defaultdict(list)
            for text, lesson_num, count in leftovers:
                leftover_groups[text].append((lesson_num, count))

            print(f"📊 {len(leftover_groups)} unique leftover utterances")

            # Show some examples
            print("\n🧩 Sample Leftover Utterances:")
            print("-" * 50)
            for i, (text, lesson_data) in enumerate(list(leftover_groups.items())[:10]):
                lessons_str = ", ".join([f"L{lesson}:{count}" for lesson, count in lesson_data])
                print(f"   {i+1}. '{text}'")
                print(f"      Lessons: {lessons_str}")

            if len(leftover_groups) > 10:
                print(f"   ... and {len(leftover_groups) - 10} more leftovers")

            return leftover_groups
        else:
            print("✅ No leftovers found - all utterances are captured in patterns!")
            return {}


def analyze_persistent_patterns(min_lessons: int = 3, max_utterances: int | None = None):
    """Analyze persistent utterance patterns that appear in multiple lessons."""

    pedagogical_elements = []

    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            # Get persistent utterances
            query = """
                SELECT utterance_text, first_lesson, last_lesson, total_lessons,
                       lesson_counts, persistence_score, pattern_type
                FROM utterance_patterns
                WHERE total_lessons >= %s
                ORDER BY total_lessons DESC, persistence_score DESC
            """

            if max_utterances:
                query += f" LIMIT {max_utterances}"

            cur.execute(query, (min_lessons,))
            persistent_patterns = cur.fetchall()

            print(
                f"🔍 Found {len(persistent_patterns)} persistent patterns (appearing in {min_lessons}+ lessons)"
            )

            # Analyze each pattern
            print("\n🤖 Analyzing patterns with LLM...")
            with alive_bar(
                len(persistent_patterns),
                title="🤖 Analyzing patterns",
                spinner="waves",
                dual_line=True,
                length=40,
                force_tty=True,
                refresh_secs=0.05,  # Faster refresh for smoother animation
            ) as bar:
                for row in persistent_patterns:
                    (
                        text,
                        first_lesson,
                        last_lesson,
                        total_lessons,
                        lesson_counts_json,
                        persistence_score,
                        pattern_type,
                    ) = row

                    # Parse lesson counts
                    if isinstance(lesson_counts_json, str):
                        lesson_counts = json.loads(lesson_counts_json)
                    else:
                        lesson_counts = lesson_counts_json

                    # Convert string keys to int
                    lesson_counts = {int(k): v for k, v in lesson_counts.items()}

                    # Calculate lifecycle stage
                    lifecycle_stage = calculate_lifecycle_stage(
                        lesson_counts, first_lesson, last_lesson
                    )

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

    print("\n" + "=" * 70)
    print("🎯 PERSISTENT PATTERN ANALYSIS REPORT")
    print("=" * 70)

    # Group by tier category
    tier_groups = defaultdict(list)
    for element in elements:
        tier_groups[element.tier_category].append(element)

    print("\n📊 Distribution by Tier Category:")
    print("-" * 40)
    for tier, tier_elements in sorted(tier_groups.items()):
        print(f"\n🏷️  {tier.upper()} ({len(tier_elements)} patterns)")

        # Show top 5 examples
        for i, elem in enumerate(tier_elements[:5]):
            lessons_str = ", ".join(
                [f"L{k}:{v}" for k, v in sorted(elem.lesson_distribution.items())]
            )
            print(f"   {i+1}. '{elem.utterance_text}'")
            print(f"      Lessons: {lessons_str}")
            print(f"      Stage: {elem.lifecycle_stage}")
            if elem.grammatical_pattern:
                print(f"      Pattern: {elem.grammatical_pattern}")

    # Extract templates
    templates = extract_templates_from_patterns(elements)

    print("\n🔧 Grammatical Templates Discovered:")
    print("-" * 40)
    for template, examples in sorted(templates.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        print(f"\n📐 {template} ({len(examples)} instances)")
        for example in examples[:3]:
            print(f"   • {example.utterance_text}")

    # Vocabulary analysis
    all_vocab = set()
    multi_word_phrases = set()

    for element in elements:
        all_vocab.update(element.vocabulary_words)
        multi_word_phrases.update(element.multi_word_phrases)

    print("\n📚 Vocabulary Summary:")
    print(f"   Total unique words: {len(all_vocab)}")
    print(f"   Multi-word phrases: {len(multi_word_phrases)}")

    # Lifecycle distribution
    lifecycle_counts = defaultdict(int)
    for element in elements:
        lifecycle_counts[element.lifecycle_stage] += 1

    print("\n🔄 Lifecycle Stage Distribution:")
    for stage, count in sorted(lifecycle_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(elements)) * 100
        print(f"   {stage}: {count} ({percentage:.1f}%)")

    # Save analysis results
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
            elements, key=lambda x: (-x.total_lessons, min(x.lesson_distribution.keys()))
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
    """Save analysis results to database and markdown report."""

    # Fix lesson distribution ordering for all elements
    for elem in elements:
        elem.lesson_distribution = dict(sorted(elem.lesson_distribution.items()))

    # Export to CSV first
    export_to_csv(elements)

    # Save to database
    with DatabaseWriter() as db, db.conn.cursor() as cur:
        print("\n💾 Saving to database...")

        # Clear existing analysis
        cur.execute("DELETE FROM pattern_analysis")

        # Insert new analysis
        with alive_bar(
            len(elements),
            title="💾 Saving to database",
            spinner="waves",
            dual_line=True,
            length=40,
            force_tty=True,
            refresh_secs=0.05,  # Faster refresh for smoother animation
        ) as bar:
            for elem in elements:
                cur.execute(
                    """
                        INSERT INTO pattern_analysis
                        (utterance_text, vocabulary_words, multi_word_phrases,
                         grammatical_pattern, tier_category, lifecycle_stage,
                         total_lessons, lesson_distribution, simple_structure,
                         functional_category, template_pattern)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (utterance_text) DO UPDATE SET
                            vocabulary_words = EXCLUDED.vocabulary_words,
                            multi_word_phrases = EXCLUDED.multi_word_phrases,
                            grammatical_pattern = EXCLUDED.grammatical_pattern,
                            tier_category = EXCLUDED.tier_category,
                            lifecycle_stage = EXCLUDED.lifecycle_stage,
                            total_lessons = EXCLUDED.total_lessons,
                            lesson_distribution = EXCLUDED.lesson_distribution,
                            simple_structure = EXCLUDED.simple_structure,
                            functional_category = EXCLUDED.functional_category,
                            template_pattern = EXCLUDED.template_pattern,
                            created_at = NOW()
                    """,
                    (
                        elem.utterance_text,
                        elem.vocabulary_words,
                        elem.multi_word_phrases,
                        elem.grammatical_pattern,
                        elem.tier_category,
                        elem.lifecycle_stage,
                        elem.total_lessons,
                        json.dumps(elem.lesson_distribution),  # Already ordered above
                        elem.simple_structure,
                        elem.functional_category,
                        elem.template_pattern,
                    ),
                )
                bar()

    # Generate markdown report
    output_dir = "/Volumes/simons-enjoyment/GitHub/episodic/pimsleur-data/02_scripts/analysis"
    os.makedirs(output_dir, exist_ok=True)

    md_file = os.path.join(output_dir, "persistent_pattern_analysis.md")
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# Persistent Pattern Analysis Report\n\n")
        f.write(f"Generated from {len(elements)} patterns\n\n")

        # Tier distribution
        tier_counts = defaultdict(int)
        for elem in elements:
            tier_counts[elem.tier_category] += 1

        f.write("## Tier Distribution\n\n")
        for tier, count in sorted(tier_counts.items(), key=lambda x: x[1], reverse=True):
            f.write(f"- **{tier}**: {count} patterns\n")

        # Top templates
        f.write("\n## Top Grammatical Templates\n\n")
        sorted_templates = sorted(templates.items(), key=lambda x: len(x[1]), reverse=True)[:10]
        for template, examples in sorted_templates:
            f.write(f"### {template} ({len(examples)} instances)\n")
            for ex in examples[:3]:
                f.write(f'- "{ex.utterance_text}"\n')
            f.write("\n")

        # Lifecycle stages
        lifecycle_counts = defaultdict(int)
        for elem in elements:
            lifecycle_counts[elem.lifecycle_stage] += 1

        f.write("## Lifecycle Stage Distribution\n\n")
        for stage, count in sorted(lifecycle_counts.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(elements)) * 100
            f.write(f"- **{stage}**: {count} ({percentage:.1f}%)\n")

    print(f"📄 Markdown report saved to: {md_file}")
    print("🗄️  Data saved to pattern_analysis table")


def main():
    """Main function for persistent pattern analysis."""
    parser = argparse.ArgumentParser(description="Analyze Persistent Utterance Patterns with LLM")
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
    parser.add_argument(
        "--check-leftovers",
        action="store_true",
        help="Check for utterances not captured in patterns (leftovers)",
    )

    args = parser.parse_args()

    print("🚀 Persistent Pattern Analysis with LLM")
    print("=" * 60)
    print(f"📊 Analyzing patterns appearing in {args.min_lessons}+ lessons")
    if args.max_utterances:
        print(f"🔢 Limiting to {args.max_utterances} utterances")
    if args.check_leftovers:
        print("🧩 Including leftover analysis")
    print("=" * 60)

    # Check leftovers first if requested
    if args.check_leftovers:
        analyze_leftovers()
        print()

    # Analyze patterns
    elements = analyze_persistent_patterns(args.min_lessons, args.max_utterances)

    # Generate report
    generate_analysis_report(elements)

    print("\n✅ Analysis complete!")


if __name__ == "__main__":
    main()
