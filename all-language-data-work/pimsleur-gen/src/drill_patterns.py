"""Pimsleur drill pattern formalization.

This module defines the structure and sequencing of drills within a Pimsleur lesson.

A Pimsleur lesson follows a predictable 8-phase structure:
1. LISTEN:      Present target conversation (the learner's goal)
2. BREAKDOWN:   Isolate smallest components
3. BACKCHAIN:   Build complex words syllable-by-syllable (end-to-start)
4. COMBINE:     Join words into phrases
5. EXPAND:      Add elements to phrases
6. DRILL:       Practice variations (person, tense, question forms)
7. RECONSTRUCT: Build full sentences
8. ROLEPLAY:    Produce the target conversation

Each phase uses specific prompt types to guide the learner.
"""

from dataclasses import dataclass
from enum import Enum, auto


class DrillPhase(Enum):
    """The 8 phases of a Pimsleur drill sequence."""

    LISTEN = auto()       # Present target conversation
    BREAKDOWN = auto()    # Isolate smallest components
    BACKCHAIN = auto()    # Syllable-by-syllable building
    COMBINE = auto()      # Join words into phrases
    EXPAND = auto()       # Add elements to phrases
    DRILL = auto()        # Practice variations
    RECONSTRUCT = auto()  # Build full sentences
    ROLEPLAY = auto()     # Produce the conversation


class PromptType(Enum):
    """Types of prompts used in Pimsleur drills."""

    # Listening prompts
    LISTEN_TO_CONVERSATION = auto()  # "Listen to this conversation"
    LISTEN_AND_REPEAT = auto()       # "Listen and repeat"
    LISTEN_AGAIN = auto()            # "Listen again"

    # Production prompts
    SAY = auto()                     # "Say X"
    HOW_DO_YOU_SAY = auto()          # "How do you say X?"
    TRY_TO_SAY = auto()              # "Try to say X"
    SAY_TOGETHER = auto()            # "Say X and Y together"

    # Question prompts
    ASK = auto()                     # "Ask X"
    ASK_IF = auto()                  # "Ask if X"
    HOW_WOULD_YOU_ASK = auto()       # "How would you ask X?"

    # Response prompts
    ANSWER = auto()                  # "Answer X"
    RESPOND = auto()                 # "Respond to X"

    # Comprehension prompts
    WHAT_DOES_MEAN = auto()          # "What does X mean?"
    DO_YOU_REMEMBER = auto()         # "Do you remember how to say X?"

    # Target language prompts (L22+)
    TARGET_SAY = auto()              # "Diga" (Spanish), "Dites" (French)
    TARGET_ASK = auto()              # "Pregunte" (Spanish), "Demandez" (French)
    TARGET_LISTEN_REPEAT = auto()    # "Escuche y repita" (Spanish)


@dataclass
class DrillStep:
    """A single step in a drill sequence."""

    phase: DrillPhase
    prompt_type: PromptType
    english_prompt: str
    target_response: str
    notes: str = ""


# Prompt patterns observed across languages
ENGLISH_PROMPTS = {
    PromptType.LISTEN_TO_CONVERSATION: [
        "Listen to this conversation",
        "Listen to this",
        "Now listen to",
    ],
    PromptType.LISTEN_AND_REPEAT: [
        "Listen and repeat",
        "Repeat after the speaker",
        "Repeat each part",
    ],
    PromptType.SAY: [
        "Say",
        "Now say",
        "Say again",
    ],
    PromptType.HOW_DO_YOU_SAY: [
        "How do you say",
        "How would you say",
    ],
    PromptType.TRY_TO_SAY: [
        "Try to say",
        "Try saying",
    ],
    PromptType.ASK: [
        "Ask",
        "Now ask",
        "Ask her",
        "Ask him",
    ],
    PromptType.ANSWER: [
        "Answer",
        "Respond",
        "Reply",
    ],
    PromptType.WHAT_DOES_MEAN: [
        "What does",
        "What is the word for",
    ],
    PromptType.DO_YOU_REMEMBER: [
        "Do you remember",
        "Remember how to say",
    ],
}

# Target language instruction markers (L22+)
TARGET_LANGUAGE_MARKERS = {
    "french": {
        "say": ["Dites", "Dites que"],
        "ask": ["Demandez", "Demandez si"],
        "listen_repeat": ["Écoutez et répétez"],
        "answer": ["Répondez"],
    },
    "german": {
        "say": ["Sagen Sie"],
        "ask": ["Fragen Sie"],
        "listen_repeat": ["Hören Sie und wiederholen Sie"],
    },
    "spanish": {
        "say": ["Diga", "Diga que"],
        "ask": ["Pregunte", "Pregunte si"],
        "listen_repeat": ["Escuche y repita"],
        "answer": ["Responda"],
    },
    "italian": {
        "say": ["Dica", "Mi dica"],
        "ask": ["Domandi", "Mi domandi"],
        "listen_repeat": ["Ascolti e ripeta"],
    },
    "japanese": {
        "say": ["と言ってください", "と、言ってください"],
        "ask": ["と、たずねてください"],
        "listen_repeat": ["聞いて、繰り返してください", "聞いて繰り返してください"],
        "answer": ["と答えてください"],
    },
    "polish": {
        "say": ["Proszę powiedzieć"],
        "ask": ["Proszę zapytać"],
        "listen_repeat": ["Proszę posłuchać i powtórzyć"],
        "answer": ["Proszę odpowiedzieć"],
    },
    "russian": {
        "say": ["Скажите", "Сейчас скажите"],
        "ask": ["Спросите"],
        "listen_repeat": ["Слушайте и повторяйте"],
        "answer": ["Отвечайте"],
    },
}


def identify_prompt_type(text: str, language: str = "english") -> PromptType | None:
    """Identify the prompt type from text.

    Args:
        text: The prompt text
        language: The language of the prompt ("english" or target language)

    Returns:
        The identified PromptType, or None if not recognized
    """
    text_lower = text.lower()

    # Check English prompts in SPECIFICITY ORDER (most specific first)
    # This prevents "Say" from matching before "How do you say"
    prompt_order = [
        PromptType.LISTEN_TO_CONVERSATION,  # "Listen to this conversation"
        PromptType.LISTEN_AND_REPEAT,       # "Listen and repeat"
        PromptType.HOW_DO_YOU_SAY,          # "How do you say" (before SAY)
        PromptType.TRY_TO_SAY,              # "Try to say" (before SAY)
        PromptType.DO_YOU_REMEMBER,         # "Do you remember" (before SAY)
        PromptType.WHAT_DOES_MEAN,          # "What does"
        PromptType.SAY,                     # "Say" (generic, checked last)
        PromptType.ASK,                     # "Ask"
        PromptType.ANSWER,                  # "Answer"
    ]

    for prompt_type in prompt_order:
        if prompt_type in ENGLISH_PROMPTS:
            for pattern in ENGLISH_PROMPTS[prompt_type]:
                if pattern.lower() in text_lower:
                    return prompt_type

    # Check target language markers
    if language in TARGET_LANGUAGE_MARKERS:
        marker_to_prompt = {
            "say": PromptType.TARGET_SAY,
            "ask": PromptType.TARGET_ASK,
            "listen_repeat": PromptType.TARGET_LISTEN_REPEAT,
            "answer": PromptType.ANSWER,
        }
        markers = TARGET_LANGUAGE_MARKERS[language]
        for marker_type, patterns in markers.items():
            for pattern in patterns:
                if pattern in text and marker_type in marker_to_prompt:
                    return marker_to_prompt[marker_type]

    return None


def get_phase_for_prompt(prompt_type: PromptType) -> DrillPhase:
    """Determine which drill phase a prompt type belongs to.

    Args:
        prompt_type: The type of prompt

    Returns:
        The drill phase this prompt type typically appears in
    """
    phase_mapping = {
        # LISTEN phase
        PromptType.LISTEN_TO_CONVERSATION: DrillPhase.LISTEN,
        PromptType.LISTEN_AGAIN: DrillPhase.LISTEN,

        # BACKCHAIN/COMBINE phase
        PromptType.LISTEN_AND_REPEAT: DrillPhase.BACKCHAIN,

        # DRILL phase
        PromptType.SAY: DrillPhase.DRILL,
        PromptType.HOW_DO_YOU_SAY: DrillPhase.DRILL,
        PromptType.TRY_TO_SAY: DrillPhase.DRILL,
        PromptType.SAY_TOGETHER: DrillPhase.COMBINE,
        PromptType.ASK: DrillPhase.DRILL,
        PromptType.ASK_IF: DrillPhase.DRILL,
        PromptType.HOW_WOULD_YOU_ASK: DrillPhase.DRILL,
        PromptType.ANSWER: DrillPhase.DRILL,
        PromptType.RESPOND: DrillPhase.DRILL,

        # RECALL phase (within DRILL)
        PromptType.DO_YOU_REMEMBER: DrillPhase.DRILL,
        PromptType.WHAT_DOES_MEAN: DrillPhase.DRILL,

        # Target language prompts (L22+)
        PromptType.TARGET_SAY: DrillPhase.DRILL,
        PromptType.TARGET_ASK: DrillPhase.DRILL,
        PromptType.TARGET_LISTEN_REPEAT: DrillPhase.BACKCHAIN,
    }

    return phase_mapping.get(prompt_type, DrillPhase.DRILL)


@dataclass
class LessonStructure:
    """Represents the structure of a Pimsleur lesson."""

    has_opening_conversation: bool
    has_roleplay: bool
    has_reading_section: bool
    uses_target_language_instructions: bool
    backchaining_count: int
    drill_count: int
    phase: str  # "foundation", "multimodal", "instruction_flip", "register_tense"

    @classmethod
    def for_lesson(cls, lesson_number: int) -> "LessonStructure":
        """Create expected structure for a given lesson number.

        Args:
            lesson_number: The lesson number (1-30)

        Returns:
            Expected LessonStructure for that lesson
        """
        # Determine phase
        if lesson_number <= 8:
            phase = "foundation"
        elif lesson_number <= 21:
            phase = "multimodal"
        elif lesson_number <= 27:
            phase = "instruction_flip"
        else:
            phase = "register_tense"

        # Foundation phase (L1-8)
        if phase == "foundation":
            return cls(
                has_opening_conversation=True,
                has_roleplay=True,
                has_reading_section=False,
                uses_target_language_instructions=False,
                backchaining_count=7 - lesson_number + 1,  # Decreases over time
                drill_count=40,
                phase=phase,
            )

        # Multimodal phase (L9-21)
        elif phase == "multimodal":
            return cls(
                has_opening_conversation=True,
                has_roleplay=True,
                has_reading_section=lesson_number >= 9,
                uses_target_language_instructions=False,
                backchaining_count=2,
                drill_count=50,
                phase=phase,
            )

        # Instruction flip phase (L22-27)
        elif phase == "instruction_flip":
            return cls(
                has_opening_conversation=lesson_number != 22,  # L22 has no convo
                has_roleplay=True,
                has_reading_section=True,
                uses_target_language_instructions=True,
                backchaining_count=1,
                drill_count=60,
                phase=phase,
            )

        # Register & tense phase (L28-30)
        else:
            return cls(
                has_opening_conversation=True,
                has_roleplay=True,
                has_reading_section=True,
                uses_target_language_instructions=True,
                backchaining_count=0,
                drill_count=60,
                phase=phase,
            )
