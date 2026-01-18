#!/usr/bin/env python3
"""
Database writer utility for direct Supabase operations.
Replaces CSV outputs with direct database writing for production use.
"""

import os
from dataclasses import dataclass
from typing import Any

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv()


@dataclass
class UtteranceRecord:
    """Database record for utterances."""

    lesson_number: int
    position_in_lesson: int
    speaker: str
    text: str
    language: str = "fr"
    utterance_type: str | None = None
    narrator_cue: str | None = None
    core_lemmas: str | None = None


@dataclass
class PhraseRecord:
    """Database record for phrases."""

    text: str
    lesson_number: int
    position_in_lesson: int
    speaker_response: str | None = None
    context: str | None = None
    teaching_cue: str | None = None


class DatabaseWriter:
    """Handles direct database operations for production pipeline."""

    def __init__(self):
        """Initialize database connection."""
        self.database_url = os.getenv("DATABASE_URL")

        if not self.database_url:
            raise ValueError("DATABASE_URL not found in environment variables")

        self.conn = psycopg2.connect(self.database_url)
        self.conn.autocommit = True

        # Cache lesson IDs
        self._lesson_cache = {}
        self._phrase_cache = {}

    def ensure_lesson_exists(self, lesson_number: int) -> int:
        """Ensure lesson exists and return its ID."""
        if lesson_number in self._lesson_cache:
            return self._lesson_cache[lesson_number]

        with self.conn.cursor() as cur:
            # Check if lesson exists
            cur.execute("SELECT id FROM lessons WHERE lesson_number = %s", (lesson_number,))
            result = cur.fetchone()

            if result:
                lesson_id = result[0]
            else:
                # Create lesson
                cur.execute(
                    "INSERT INTO lessons (lesson_number, title) VALUES (%s, %s) RETURNING id",
                    (lesson_number, f"French I - Lesson {lesson_number:02d}"),
                )
                lesson_id = cur.fetchone()[0]

            self._lesson_cache[lesson_number] = lesson_id
            return lesson_id

    def write_utterances(
        self, utterances: list[UtteranceRecord], clear_lesson: bool = False
    ) -> int:
        """Write utterances directly to database."""
        if not utterances:
            return 0

        # Prepare records with lesson IDs
        db_records = []
        for utterance in utterances:
            lesson_id = self.ensure_lesson_exists(utterance.lesson_number)

            db_records.append(
                (
                    lesson_id,
                    utterance.position_in_lesson,
                    utterance.speaker,
                    utterance.text,
                    utterance.language,
                    utterance.utterance_type,
                    utterance.narrator_cue,
                    utterance.core_lemmas,
                )
            )

        with self.conn.cursor() as cur:
            # Only clear existing utterances if explicitly requested
            if clear_lesson:
                lesson_ids = {self.ensure_lesson_exists(u.lesson_number) for u in utterances}
                for lesson_id in lesson_ids:
                    cur.execute("DELETE FROM utterances WHERE lesson_id = %s", (lesson_id,))

            # Insert new utterances
            execute_values(
                cur,
                """INSERT INTO utterances (lesson_id, position_in_lesson, speaker, text, language, utterance_type, narrator_cue, core_lemmas)
                   VALUES %s""",
                db_records,
            )

            return len(db_records)

    def ensure_phrase_exists(self, phrase_text: str) -> int:
        """Ensure phrase exists and return its ID."""
        if phrase_text in self._phrase_cache:
            return self._phrase_cache[phrase_text]

        with self.conn.cursor() as cur:
            # Check if phrase exists
            cur.execute("SELECT id FROM phrases WHERE text = %s", (phrase_text,))
            result = cur.fetchone()

            if result:
                phrase_id = result[0]
            else:
                # Create phrase
                cur.execute(
                    "INSERT INTO phrases (text) VALUES (%s) RETURNING id",
                    (phrase_text,),
                )
                phrase_id = cur.fetchone()[0]

            self._phrase_cache[phrase_text] = phrase_id
            return phrase_id

    def write_phrases(self, phrases: list[PhraseRecord]) -> int:
        """Write phrases directly to database."""
        if not phrases:
            return 0

        # Ensure all phrases exist in phrases table
        for phrase in phrases:
            self.ensure_phrase_exists(phrase.text)

        return len(phrases)

    def update_cognitive_load(self, lesson_number: int, metrics: dict[str, Any]):
        """Update cognitive load metrics for a lesson."""
        lesson_id = self.ensure_lesson_exists(lesson_number)

        with self.conn.cursor() as cur:
            # Delete existing cognitive load for this lesson
            cur.execute("DELETE FROM cognitive_load WHERE lesson_id = %s", (lesson_id,))

            # Insert new metrics
            cur.execute(
                """INSERT INTO cognitive_load
                   (lesson_id, load_score, novelty_ratio, repetition_density, core_introductions, derived_phrases)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    lesson_id,
                    metrics.get("cognitive_load_score"),
                    metrics.get("novelty_ratio"),
                    metrics.get("repetition_density"),
                    metrics.get("new_items"),
                    metrics.get("review_items", 0) + metrics.get("reinforcement_items", 0),
                ),
            )

    def get_lesson_utterances(self, lesson_number: int) -> list[dict[str, Any]]:
        """Get all utterances for a lesson from database."""
        lesson_id = self.ensure_lesson_exists(lesson_number)

        with self.conn.cursor() as cur:
            cur.execute(
                """SELECT position_in_lesson, speaker, text, language
                   FROM utterances
                   WHERE lesson_id = %s
                   ORDER BY position_in_lesson""",
                (lesson_id,),
            )

            results = cur.fetchall()
            return [
                {
                    "position_in_lesson": pos,
                    "speaker": speaker,
                    "text": text,
                    "language": lang,
                    "lesson_number": lesson_number,
                }
                for pos, speaker, text, lang in results
            ]

    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()


# Convenience functions for backward compatibility
def write_utterances_to_db(utterances: list[UtteranceRecord]) -> int:
    """Write utterances to database (convenience function)."""
    with DatabaseWriter() as db:
        return db.write_utterances(utterances)


def write_phrases_to_db(phrases: list[PhraseRecord]) -> int:
    """Write phrases to database (convenience function)."""
    with DatabaseWriter() as db:
        return db.write_phrases(phrases)


def update_lesson_metrics(lesson_number: int, metrics: dict[str, Any]):
    """Update cognitive load metrics for a lesson (convenience function)."""
    with DatabaseWriter() as db:
        db.update_cognitive_load(lesson_number, metrics)
