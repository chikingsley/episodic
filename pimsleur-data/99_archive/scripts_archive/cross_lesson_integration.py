#!/usr/bin/env python3
"""
Cross-lesson integration pipeline for Pimsleur French data analysis.
Phase 1: Lessons 1-5 with CSV-based processing.
Phase 2: Supabase database integration.
"""

import csv
import json
import re
from collections import defaultdict
from dataclasses import dataclass, field
from typing import List, Optional
from pathlib import Path
import os
import psycopg2  # type: ignore
from dotenv import load_dotenv
import psycopg2.extras

# Optional spaCy
try:
    import spacy
    from spacy.language import Language as SpacyLanguage

    nlp: Optional[SpacyLanguage] = spacy.load("fr_core_news_sm")
except ImportError:
    print(
        "Warning: spaCy not available. Install with: pip install spacy && python -m spacy download fr_core_news_sm"
    )
    nlp = None

# Optional Lingua
try:
    from lingua import Language, LanguageDetector, LanguageDetectorBuilder

    detector: Optional[LanguageDetector] = LanguageDetectorBuilder.from_languages(
        Language.ENGLISH, Language.FRENCH
    ).build()
except ImportError:
    print(
        "Warning: lingua not available. Install with: pip install lingua-language-detector"
    )
    detector = None


def connect_to_db():
    """Establishes a connection to the Supabase Postgres database."""
    load_dotenv()
    try:
        conn = psycopg2.connect(
            user=os.getenv("user"),
            password=os.getenv("password"),
            host=os.getenv("host"),
            port=os.getenv("port"),
            dbname=os.getenv("dbname"),
        )
        print("Successfully connected to Supabase DB.")
        return conn
    except psycopg2.OperationalError as e:
        print(f"Error connecting to the database: {e}")
        return None


@dataclass
class UnifiedUtterance:
    """Unified data structure for both utterances and explicit phrases."""

    id: int
    lesson: int
    position: int
    text: str
    normalized_text: str
    speaker: str
    utterance_type: Optional[str] = None
    pedagogical_function: Optional[str] = None
    teaching_cue: Optional[str] = None
    template_pattern: Optional[str] = None
    core_lemmas: List[str] = field(default_factory=list)
    is_explicit_teaching: bool = False
    source: str = "utterance"  # "utterance" or "explicit"


class TextNormalizer:
    """Handles text normalization at different levels."""

    @staticmethod
    def normalize_exact(text: str) -> str:
        """Return text as-is for exact matching."""
        return text.strip()

    @staticmethod
    def normalize_standard(text: str) -> str:
        """Lowercase and remove punctuation."""
        # Remove punctuation except apostrophes in contractions
        text = re.sub(r"[^\w\s'-]", "", text.lower())
        # Normalize whitespace
        text = " ".join(text.split())
        return text.strip()

    @staticmethod
    def normalize_lemmatized(text: str) -> str:
        """Lemmatize using spaCy."""
        if not nlp:
            return TextNormalizer.normalize_standard(text)

        doc = nlp(text.lower())
        lemmas = [token.lemma_ for token in doc if not token.is_punct]
        return " ".join(lemmas)


class TemplateExtractor:
    """Extracts template patterns from phrases."""

    # Common French question patterns
    QUESTION_PATTERNS = [
        (r"est-ce que\s+(\w+)\s+(\w+)", "est-ce que + [PRONOUN] + [VERB]"),
        (r"qu'est-ce que\s+(\w+)\s+(\w+)", "qu'est-ce que + [PRONOUN] + [VERB]"),
        (r"où est\s+(\w+)", "où est + [NOUN]"),
        (r"comment\s+(\w+)-(\w+)", "comment + [VERB]-[PRONOUN]"),
        (r"à quelle heure", "à quelle heure + [CONTEXT]"),
    ]

    # Common verb patterns
    VERB_PATTERNS = [
        (r"je\s+(\w+)", "je + [VERB]"),
        (r"vous\s+(\w+)", "vous + [VERB]"),
        (r"je voudrais\s+(\w+)", "je voudrais + [INFINITIVE]"),
        (r"est-ce que vous\s+(\w+)", "est-ce que vous + [VERB]"),
    ]

    @classmethod
    def extract_template(cls, text: str) -> Optional[str]:
        """Extract template pattern from text."""
        normalized = text.lower()

        # Check question patterns first
        for pattern, template in cls.QUESTION_PATTERNS:
            if re.search(pattern, normalized):
                return template

        # Check verb patterns
        for pattern, template in cls.VERB_PATTERNS:
            if re.search(pattern, normalized):
                return template

        # Check for number patterns
        if re.search(
            r"\b(un|une|deux|trois|quatre|cinq|six|sept|huit|neuf)\s+heures?\b",
            normalized,
        ):
            return "[NUMBER] + heure(s)"

        return None


class CrossLessonAnalyzer:
    """Main analyzer for cross-lesson integration."""

    def __init__(self, lessons_to_analyze: Optional[List[int]] = None):
        self.conn = connect_to_db()
        if not self.conn:
            raise ConnectionError("Could not establish database connection.")
        self.lessons = lessons_to_analyze or list(range(1, 6))  # Default to lessons 1-5
        self.utterances: List[UnifiedUtterance] = []
        self.normalizer = TextNormalizer()
        self.template_extractor = TemplateExtractor()

    def __del__(self):
        """Ensure the database connection is closed when the object is destroyed."""
        if self.conn:
            self.conn.close()
            print("Database connection closed.")

    def load_data_from_db(self):
        """Load utterance and lesson data from the Supabase database."""
        print("Loading data from database...")
        cursor = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        try:
            query = """
                SELECT u.id, u.text, u.speaker, u.position_in_lesson, l.lesson_number
                FROM utterances u
                JOIN lessons l ON u.lesson_id = l.id
                WHERE l.lesson_number = ANY(%s)
                ORDER BY l.lesson_number, u.position_in_lesson;
            """
            cursor.execute(query, (self.lessons,))

            for row in cursor.fetchall():
                utterance = UnifiedUtterance(
                    id=row["id"],
                    lesson=row["lesson_number"],
                    position=row["position_in_lesson"],
                    text=row["text"],
                    normalized_text=self.normalizer.normalize_standard(row["text"]),
                    speaker=row["speaker"],
                    source="utterance",
                )
                utterance.template_pattern = self.template_extractor.extract_template(
                    utterance.text
                )
                self.utterances.append(utterance)

            print(f"Loaded {len(self.utterances)} utterances from the database.")

        except psycopg2.Error as e:
            print(f"Database error: {e}")
        finally:
            cursor.close()

    def build_phrase_occurrences(self):
        """Build comprehensive phrase occurrence tracking using the database."""
        print("Building phrase occurrence index...")

        cursor = self.conn.cursor()
        try:
            # Process all utterances loaded from the DB
            for item in self.utterances:
                normalized_key = self.normalizer.normalize_standard(item.text)

                # Check if phrase exists
                cursor.execute(
                    "SELECT id FROM phrases WHERE text = %s;", (normalized_key,)
                )
                result = cursor.fetchone()

                is_new_phrase = result is None
                if is_new_phrase:
                    # Insert new phrase and get its ID
                    cursor.execute(
                        "INSERT INTO phrases (text) VALUES (%s) RETURNING id;",
                        (normalized_key,),
                    )
                    phrase_id = cursor.fetchone()[0]
                else:
                    phrase_id = result[0]

                # Record the occurrence in the junction table
                cursor.execute(
                    """
                    INSERT INTO phrase_occurrences (phrase_id, utterance_id, is_new, is_review)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (phrase_id, utterance_id) DO NOTHING;
                    """,
                    (phrase_id, item.id, is_new_phrase, not is_new_phrase),
                )

            self.conn.commit()
            print("Phrase index built and new phrases saved to DB.")

        except psycopg2.Error as e:
            print(f"Database error during phrase indexing: {e}")
            self.conn.rollback()
        finally:
            cursor.close()

    def calculate_lifecycle_stages(self):
        """Calculate lifecycle stage for each phrase."""
        for phrase_id, occurrence in self.phrase_occurrences.items():
            lessons = sorted(occurrence.lesson_positions.keys())
            first_lesson = lessons[0]
            last_lesson = lessons[-1]
            num_lessons = len(lessons)

            # Simple lifecycle rules for now
            if num_lessons == 1:
                occurrence.lifecycle_stage = "introduction"
            elif last_lesson - first_lesson <= 2 and occurrence.total_occurrences >= 5:
                occurrence.lifecycle_stage = "intensive_practice"
            elif num_lessons >= 3 and occurrence.total_occurrences >= 10:
                occurrence.lifecycle_stage = "consolidation"
            elif last_lesson - first_lesson >= 3 and occurrence.total_occurrences < 5:
                occurrence.lifecycle_stage = "maintenance"
            else:
                occurrence.lifecycle_stage = "active"

    def generate_cross_lesson_report(self):
        """Generate comprehensive cross-lesson analysis report."""
        print("Generating cross-lesson report...")

        # Calculate lifecycle stages
        self.calculate_lifecycle_stages()

        # Prepare report data
        report = {
            "summary": {
                "total_utterances": len(self.utterances),
                "total_explicit_phrases": len(self.explicit_phrases),
                "unique_phrases": len(self.phrase_occurrences),
                "lessons_analyzed": self.lessons,
            },
            "lifecycle_distribution": defaultdict(int),
            "template_patterns": defaultdict(int),
            "high_frequency_phrases": [],
            "cross_lesson_phrases": [],
            "introduction_sequence": [],
        }

        # Analyze lifecycle distribution
        for occurrence in self.phrase_occurrences.values():
            report["lifecycle_distribution"][occurrence.lifecycle_stage] += 1

            # Track template patterns
            if occurrence.template_pattern:
                report["template_patterns"][occurrence.template_pattern] += 1

        # Find high frequency phrases (top 20)
        sorted_phrases = sorted(
            self.phrase_occurrences.values(),
            key=lambda x: x.total_occurrences,
            reverse=True,
        )[:20]

        for phrase in sorted_phrases:
            report["high_frequency_phrases"].append(
                {
                    "phrase": phrase.canonical_form,
                    "occurrences": phrase.total_occurrences,
                    "lessons": list(phrase.lesson_positions.keys()),
                    "lifecycle": phrase.lifecycle_stage,
                    "template": phrase.template_pattern,
                }
            )

        # Find phrases that appear across multiple lessons
        cross_lesson = [
            p for p in self.phrase_occurrences.values() if len(p.lesson_positions) >= 3
        ]

        for phrase in sorted(
            cross_lesson, key=lambda x: len(x.lesson_positions), reverse=True
        )[:20]:
            report["cross_lesson_phrases"].append(
                {
                    "phrase": phrase.canonical_form,
                    "num_lessons": len(phrase.lesson_positions),
                    "lessons": list(phrase.lesson_positions.keys()),
                    "total_occurrences": phrase.total_occurrences,
                    "contexts": list(phrase.teaching_contexts),
                }
            )

        # Track introduction sequence
        introductions = sorted(
            [
                p
                for p in self.phrase_occurrences.values()
                if p.lifecycle_stage == "introduction"
            ],
            key=lambda x: (x.first_lesson, x.first_position),
        )[:30]

        for phrase in introductions:
            report["introduction_sequence"].append(
                {
                    "lesson": phrase.first_lesson,
                    "position": phrase.first_position,
                    "phrase": phrase.canonical_form,
                    "template": phrase.template_pattern,
                }
            )

        # Save report
        output_path = Path("cross_lesson_analysis_phase1.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"Report saved to {output_path}")

        # Also create CSV for phrase occurrences
        self.save_phrase_occurrences_csv()

        return report

    def save_phrase_occurrences_csv(self):
        """Save detailed phrase occurrences to CSV."""
        output_path = Path("phrase_occurrences_lessons_1-5.csv")

        with open(output_path, "w", encoding="utf-8", newline="") as f:
            fieldnames = [
                "phrase",
                "normalized_form",
                "first_lesson",
                "first_position",
                "total_occurrences",
                "num_lessons",
                "lessons",
                "lifecycle_stage",
                "template_pattern",
                "teaching_contexts",
            ]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

            for occurrence in sorted(
                self.phrase_occurrences.values(),
                key=lambda x: x.total_occurrences,
                reverse=True,
            ):
                writer.writerow(
                    {
                        "phrase": occurrence.canonical_form,
                        "normalized_form": occurrence.normalized_form,
                        "first_lesson": occurrence.first_lesson,
                        "first_position": occurrence.first_position,
                        "total_occurrences": occurrence.total_occurrences,
                        "num_lessons": len(occurrence.lesson_positions),
                        "lessons": ",".join(
                            map(str, sorted(occurrence.lesson_positions.keys()))
                        ),
                        "lifecycle_stage": occurrence.lifecycle_stage,
                        "template_pattern": occurrence.template_pattern or "",
                        "teaching_contexts": "|".join(occurrence.teaching_contexts),
                    }
                )

        print(f"Phrase occurrences saved to {output_path}")


def main():
    """Run Phase 1 analysis on lessons 1-5."""
    analyzer = CrossLessonAnalyzer(lessons_to_analyze=[1, 2, 3, 4, 5])

    # Load data
    analyzer.load_data_from_db()

    # Build phrase index
    analyzer.build_phrase_occurrences()

    # Generate report
    report = analyzer.generate_cross_lesson_report()

    # Print summary
    print("\n=== Cross-Lesson Analysis Summary ===")
    print(f"Total utterances analyzed: {report['summary']['total_utterances']}")
    print(f"Total explicit phrases: {report['summary']['total_explicit_phrases']}")
    print(f"Unique phrases found: {report['summary']['unique_phrases']}")

    print("\n=== Lifecycle Distribution ===")
    for stage, count in report["lifecycle_distribution"].items():
        print(f"{stage}: {count} phrases")

    print("\n=== Top Template Patterns ===")
    for pattern, count in sorted(
        report["template_patterns"].items(), key=lambda x: x[1], reverse=True
    )[:10]:
        print(f"{pattern}: {count} instances")

    print("\n=== Top 10 High-Frequency Phrases ===")
    for phrase_info in report["high_frequency_phrases"][:10]:
        print(
            f"{phrase_info['phrase']} - {phrase_info['occurrences']} times in lessons {phrase_info['lessons']}"
        )


if __name__ == "__main__":
    main()
