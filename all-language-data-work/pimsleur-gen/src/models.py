"""Pydantic models for Pimsleur lesson structure."""

from datetime import timedelta

from pydantic import BaseModel


class Utterance(BaseModel):
    """A single spoken segment in a lesson."""
    speaker: str  # "Narrator", "Male Speaker", "Female Speaker"
    text: str
    start_time: timedelta | None = None
    end_time: timedelta | None = None

    @property
    def duration(self) -> timedelta | None:
        if self.start_time and self.end_time:
            return self.end_time - self.start_time
        return None

    @property
    def is_instruction(self) -> bool:
        """True if this is narrator instruction (English)."""
        return self.speaker == "Narrator"

    @property
    def is_target_language(self) -> bool:
        """True if this is target language content."""
        return self.speaker in ("Male Speaker", "Female Speaker")


class Lesson(BaseModel):
    """A complete Pimsleur lesson."""
    language: str
    level: int
    unit: int
    utterances: list[Utterance]

    @property
    def total_duration(self) -> timedelta | None:
        """Total lesson duration based on timestamps."""
        if not self.utterances:
            return None
        last = self.utterances[-1]
        if last.end_time:
            return last.end_time
        return None

    @property
    def instruction_count(self) -> int:
        """Number of narrator instructions."""
        return sum(1 for u in self.utterances if u.is_instruction)

    @property
    def target_language_count(self) -> int:
        """Number of target language utterances."""
        return sum(1 for u in self.utterances if u.is_target_language)

    def get_unique_phrases(self) -> list[str]:
        """Get unique target language phrases."""
        seen = set()
        phrases = []
        for u in self.utterances:
            if u.is_target_language and u.text not in seen:
                seen.add(u.text)
                phrases.append(u.text)
        return phrases
