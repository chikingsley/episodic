"""Pimsleur-style lesson generator.

Generates lesson plans based on the reverse-engineered Pimsleur method.
Handles three modes:
  - Bootstrap (Level 1): Full 8-phase drill model
  - Scaffold (Level 2): 4-phase scaffold model
  - Immersion (Levels 3-5): Simplified immersive model

Input: vocabulary list, grammar points, target level
Output: lesson structure with scaffolding schedule, drill sequences, SRS timing

Usage:
    from src.generator import CourseGenerator, VocabEntry

    vocab = [
        VocabEntry(word="pardon", translation="excuse me", theme="meta_communication"),
        VocabEntry(word="comprenez", translation="you understand", theme="meta_communication"),
        ...
    ]
    generator = CourseGenerator(vocabulary=vocab, target_level=1, language="french")
    course = generator.generate()
    for lesson in course.lessons:
        print(lesson)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum, auto

from src.spaced_repetition import expected_occurrences

# --- Enums ---


class TeachingMode(Enum):
    """The three teaching modes corresponding to the three-stage system."""

    BOOTSTRAP = auto()   # Level 1: full 8-phase drill, heavy scaffolding
    SCAFFOLD = auto()    # Level 2: 4-phase, mixed English/target instructions
    IMMERSION = auto()   # Levels 3-5: simplified, target-language dominant


class DrillMode(Enum):
    """Drill structure mode for the lesson."""

    EIGHT_PHASE = auto()        # L1: full 8-phase model
    FOUR_PHASE_SCAFFOLD = auto()  # L2: conversation → highlight → drill-cycle → scenario
    THREE_PHASE_IMMERSION = auto()  # L3: conversation → drill-cycle → scenarios
    TWO_PHASE_ADVANCED = auto()    # L4: conversation → drill-scenario
    ONE_PHASE_NATIVE = auto()      # L5: immersive practice


class VocabTheme(Enum):
    """Vocabulary theme categories following the progressive context expansion."""

    META_COMMUNICATION = "meta_communication"  # L1-3: excuse me, understand, etc.
    GREETINGS = "greetings"                     # L2: hello, goodbye, how are you
    IDENTITY = "identity"                       # L1-3: nationality, name
    LOCATIONS = "locations"                     # L4: where is, street, here, there
    FOOD_AND_DRINK = "food_and_drink"           # L5-8: eat, drink, restaurant
    TIME = "time"                               # L10-11: hours, today, tomorrow
    MONEY = "money"                             # L12-16: numbers, prices, currency
    COMMUNICATION = "communication"             # L17: speak, understand, fast
    FAMILY = "family"                           # L18-21: husband, wife, children
    TRAVEL = "travel"                           # L22-24: car, gas, directions
    SHOPPING = "shopping"                       # L25: store, open, closed
    PLANS = "plans"                             # L26-27: see, take, friends, leave
    REGISTER = "register"                       # L28: tu/vous, informal
    PAST = "past"                               # L29-30: yesterday, bought, ate
    NUMBERS = "numbers"                         # Spread across L8-L27
    CUSTOM = "custom"                           # User-defined themes


# Theme ordering follows progressive context expansion: self → place → time → people → world
THEME_ORDER = [
    VocabTheme.META_COMMUNICATION,
    VocabTheme.GREETINGS,
    VocabTheme.IDENTITY,
    VocabTheme.LOCATIONS,
    VocabTheme.FOOD_AND_DRINK,
    VocabTheme.TIME,
    VocabTheme.MONEY,
    VocabTheme.COMMUNICATION,
    VocabTheme.FAMILY,
    VocabTheme.TRAVEL,
    VocabTheme.SHOPPING,
    VocabTheme.PLANS,
    VocabTheme.REGISTER,
    VocabTheme.PAST,
]


# --- Data Models ---


@dataclass
class VocabEntry:
    """A vocabulary item for the course."""

    word: str
    translation: str
    theme: str = "custom"
    grammar_note: str = ""
    backchain: bool = False  # Whether this word needs backchaining
    handle_construction: str = ""  # Which handle construction this plugs into


@dataclass
class DrillStep:
    """A single step in a lesson's drill sequence."""

    instruction: str       # What the narrator says
    expected_response: str  # What the learner should say
    instruction_language: str = "english"  # "english" or "target"
    drill_type: str = "produce"  # "listen", "produce", "backchain", "recall"
    notes: str = ""


@dataclass
class LessonPlan:
    """A generated lesson plan."""

    lesson_number: int
    level: int
    teaching_mode: TeachingMode
    drill_mode: DrillMode
    theme: str

    # Vocabulary
    new_vocabulary: list[VocabEntry] = field(default_factory=list)
    review_vocabulary: list[VocabEntry] = field(default_factory=list)

    # Structure
    opening_conversation: list[str] = field(default_factory=list)
    drill_sequence: list[DrillStep] = field(default_factory=list)
    scenario_description: str = ""

    # Metadata
    estimated_new_items: int = 0
    estimated_review_items: int = 0
    english_instruction_pct: float = 1.0
    backchaining_count: int = 0
    has_reading_section: bool = False

    def summary(self) -> str:
        """Return a human-readable summary of this lesson plan."""
        lines = [
            f"=== Lesson {self.lesson_number} (Level {self.level}) ===",
            f"Mode: {self.teaching_mode.name} | Drill: {self.drill_mode.name}",
            f"Theme: {self.theme}",
            f"New vocabulary: {self.estimated_new_items} items",
            f"Review vocabulary: {self.estimated_review_items} items",
            f"English instructions: {self.english_instruction_pct:.0%}",
            f"Backchaining: {self.backchaining_count} items",
            f"Reading section: {self.has_reading_section}",
        ]
        if self.new_vocabulary:
            lines.append("New words:")
            for v in self.new_vocabulary:
                lines.append(f"  - {v.word} ({v.translation})")
        if self.review_vocabulary:
            lines.append(f"Review words: {len(self.review_vocabulary)} items")
        if self.opening_conversation:
            lines.append("Opening conversation:")
            for line in self.opening_conversation:
                lines.append(f"  {line}")
        if self.scenario_description:
            lines.append(f"Scenario: {self.scenario_description}")
        return "\n".join(lines)


@dataclass
class CoursePlan:
    """A complete generated course plan."""

    language: str
    level: int
    total_lessons: int
    lessons: list[LessonPlan] = field(default_factory=list)

    def summary(self) -> str:
        """Return a human-readable summary of the entire course."""
        lines = [
            f"{'=' * 60}",
            f"COURSE: {self.language.title()} Level {self.level}",
            f"Total lessons: {self.total_lessons}",
            f"{'=' * 60}",
        ]
        for lesson in self.lessons:
            lines.append("")
            lines.append(lesson.summary())
        return "\n".join(lines)


# --- Generator ---


def get_teaching_mode(level: int) -> TeachingMode:
    """Determine teaching mode from level number."""
    if level == 1:
        return TeachingMode.BOOTSTRAP
    elif level == 2:
        return TeachingMode.SCAFFOLD
    else:
        return TeachingMode.IMMERSION


def get_drill_mode(level: int) -> DrillMode:
    """Determine drill mode from level number."""
    return {
        1: DrillMode.EIGHT_PHASE,
        2: DrillMode.FOUR_PHASE_SCAFFOLD,
        3: DrillMode.THREE_PHASE_IMMERSION,
        4: DrillMode.TWO_PHASE_ADVANCED,
        5: DrillMode.ONE_PHASE_NATIVE,
    }.get(level, DrillMode.ONE_PHASE_NATIVE)


def get_english_pct(level: int, lesson_in_level: int) -> float:
    """Calculate English instruction percentage based on level and lesson position.

    Level 1: 100% → 20% (drops at L9, flips at L22)
    Level 2: 60% → 40%
    Level 3: ~30%
    Level 4: ~20%
    Level 5: ~10-15%
    """
    if level == 1:
        if lesson_in_level <= 8:
            return 1.0
        elif lesson_in_level <= 21:
            return 0.7 - (lesson_in_level - 9) * 0.02
        else:
            return 0.2
    elif level == 2:
        return 0.6 - (lesson_in_level / 30) * 0.2
    elif level == 3:
        return 0.3
    elif level == 4:
        return 0.2
    else:
        return 0.1


def get_backchaining_count(level: int, lesson_in_level: int) -> int:
    """Calculate expected backchaining count.

    Level 1: Heavy early (7 → 0 by L8), spikes for numbers (L11-17)
    Level 2+: Rare, only for genuinely complex new words
    """
    if level == 1:
        if lesson_in_level <= 1:
            return 7
        elif lesson_in_level <= 3:
            return max(7 - lesson_in_level * 2, 2)
        elif lesson_in_level <= 8:
            return max(3 - (lesson_in_level - 3), 0)
        elif 11 <= lesson_in_level <= 17:
            return min(10, 12 - lesson_in_level)  # Number spike
        else:
            return min(5, max(0, 8 - lesson_in_level // 3))
    elif level == 2:
        return 1  # Rare
    else:
        return 0  # Almost never


def get_has_reading(level: int, lesson_in_level: int) -> bool:
    """Determine if lesson has a reading section."""
    if level == 1:
        return lesson_in_level >= 9
    return True  # All L2+ lessons have reading


def assign_vocabulary_to_lessons(
    vocabulary: list[VocabEntry],
    total_lessons: int = 30,
    target_per_lesson: int = 9,
) -> list[list[VocabEntry]]:
    """Assign vocabulary items to lessons based on theme ordering and load limits.

    Groups vocabulary by theme, then assigns in theme order following
    the progressive context expansion pattern.

    Args:
        vocabulary: All vocabulary items for the course
        total_lessons: Number of lessons (default 30)
        target_per_lesson: Target new items per lesson

    Returns:
        List of lists, where index i contains vocabulary for lesson i+1
    """
    # Group by theme
    theme_groups: dict[str, list[VocabEntry]] = {}
    for entry in vocabulary:
        theme_groups.setdefault(entry.theme, []).append(entry)

    # Order themes following the progressive expansion
    ordered_themes: list[str] = []
    for theme in THEME_ORDER:
        if theme.value in theme_groups:
            ordered_themes.append(theme.value)
    # Add any custom themes at the end
    for theme_name in theme_groups:
        if theme_name not in ordered_themes:
            ordered_themes.append(theme_name)

    # Flatten into ordered list
    ordered_vocab: list[VocabEntry] = []
    for theme_name in ordered_themes:
        ordered_vocab.extend(theme_groups[theme_name])

    # Assign to lessons
    lessons: list[list[VocabEntry]] = [[] for _ in range(total_lessons)]
    lesson_idx = 0

    for entry in ordered_vocab:
        if lesson_idx >= total_lessons:
            # Overflow: add to last lesson
            lessons[-1].append(entry)
            continue

        lessons[lesson_idx].append(entry)

        # Move to next lesson when we hit the target
        if len(lessons[lesson_idx]) >= target_per_lesson:
            lesson_idx += 1

    return lessons


def build_review_schedule(
    lesson_assignments: list[list[VocabEntry]],
    current_lesson: int,
) -> list[VocabEntry]:
    """Build the review vocabulary list for a given lesson using SRS.

    Uses the cross-lesson pattern from spaced_repetition.py.

    Args:
        lesson_assignments: Vocabulary assigned to each lesson
        current_lesson: The current lesson number (1-indexed)

    Returns:
        List of vocabulary items that should be reviewed in this lesson
    """
    review_items: list[VocabEntry] = []

    for intro_lesson_idx in range(current_lesson - 1):
        intro_lesson = intro_lesson_idx + 1  # 1-indexed
        if intro_lesson == current_lesson:
            continue

        occurrences = expected_occurrences(current_lesson, intro_lesson)
        if occurrences > 0:
            # Add items from that lesson for review
            for entry in lesson_assignments[intro_lesson_idx]:
                review_items.append(entry)

    return review_items


def generate_drill_sequence(
    new_vocab: list[VocabEntry],
    review_vocab: list[VocabEntry],
    drill_mode: DrillMode,
    english_pct: float,
    backchaining_count: int,
) -> list[DrillStep]:
    """Generate a drill sequence for a lesson.

    Args:
        new_vocab: New vocabulary for this lesson
        review_vocab: Review vocabulary for this lesson
        drill_mode: The drill mode to use
        english_pct: Percentage of English instructions
        backchaining_count: Number of items to backchain

    Returns:
        List of DrillStep objects forming the lesson's drill sequence
    """
    steps: list[DrillStep] = []
    instruction_lang = "english" if english_pct > 0.5 else "target"

    if drill_mode == DrillMode.EIGHT_PHASE:
        # Full 8-phase Level 1 model
        # Phase 1: LISTEN
        steps.append(DrillStep(
            instruction="Listen to this conversation.",
            expected_response="[Opening conversation plays]",
            instruction_language="english",
            drill_type="listen",
            notes="LISTEN phase: present target conversation",
        ))

        # Phase 2-3: BREAKDOWN + BACKCHAIN
        backchained = 0
        for entry in new_vocab:
            if entry.backchain and backchained < backchaining_count:
                steps.append(DrillStep(
                    instruction=f"Listen and repeat: {entry.word}",
                    expected_response=entry.word,
                    instruction_language="english",
                    drill_type="backchain",
                    notes=f"BACKCHAIN: {entry.word} (end-to-start syllable building)",
                ))
                backchained += 1

            # BREAKDOWN: isolate and translate
            steps.append(DrillStep(
                instruction=f"The word '{entry.word}' means '{entry.translation}'.",
                expected_response=entry.word,
                instruction_language="english",
                drill_type="produce",
                notes="BREAKDOWN: isolate component",
            ))

        # Phase 4-5: COMBINE + EXPAND
        for entry in new_vocab:
            if entry.handle_construction:
                steps.append(DrillStep(
                    instruction=f"How do you say '{entry.translation}'?",
                    expected_response=entry.word,
                    instruction_language="english",
                    drill_type="produce",
                    notes=f"EXPAND: plug into handle '{entry.handle_construction}'",
                ))

        # Phase 6: DRILL - review interleaved
        for entry in review_vocab[:10]:  # Limit review items per lesson
            steps.append(DrillStep(
                instruction=f"Do you remember how to say '{entry.translation}'?",
                expected_response=entry.word,
                instruction_language="english",
                drill_type="recall",
                notes="DRILL: spaced recall of previous vocabulary",
            ))

        # Phase 7: RECONSTRUCT
        for entry in new_vocab:
            steps.append(DrillStep(
                instruction=f"Try to say '{entry.translation}'.",
                expected_response=entry.word,
                instruction_language=instruction_lang,
                drill_type="produce",
                notes="RECONSTRUCT: full sentence production",
            ))

        # Phase 8: ROLEPLAY
        steps.append(DrillStep(
            instruction="Now take the role in the conversation.",
            expected_response="[Learner participates in roleplay]",
            instruction_language="english",
            drill_type="produce",
            notes="ROLEPLAY: produce target conversation",
        ))

    elif drill_mode == DrillMode.FOUR_PHASE_SCAFFOLD:
        # Level 2: conversation → highlight → drill-cycle → scenario
        steps.append(DrillStep(
            instruction="Listen to this conversation.",
            expected_response="[Extended conversation plays]",
            instruction_language="english",
            drill_type="listen",
            notes="CONVERSATION: extended opening dialogue",
        ))

        # HIGHLIGHT: isolate key phrases
        for entry in new_vocab[:3]:
            steps.append(DrillStep(
                instruction=f"You heard '{entry.word}'. This means '{entry.translation}'.",
                expected_response=entry.word,
                instruction_language="english",
                drill_type="produce",
                notes="HIGHLIGHT: isolate key new phrase",
            ))

        # DRILL-CYCLE: interleaved recall/new/recombine
        all_items = list(review_vocab[:8]) + list(new_vocab)
        for entry in all_items:
            prompt_lang = instruction_lang if english_pct > 0.4 else "target"
            if entry in review_vocab:
                steps.append(DrillStep(
                    instruction=f"How do you say '{entry.translation}'?",
                    expected_response=entry.word,
                    instruction_language=prompt_lang,
                    drill_type="recall",
                    notes="DRILL-CYCLE: recall",
                ))
            else:
                steps.append(DrillStep(
                    instruction=f"Say: {entry.translation}",
                    expected_response=entry.word,
                    instruction_language=prompt_lang,
                    drill_type="produce",
                    notes="DRILL-CYCLE: new item",
                ))

        # SCENARIO
        steps.append(DrillStep(
            instruction="Now suppose you're speaking with a French acquaintance...",
            expected_response="[Extended role-play scenario]",
            instruction_language="english",
            drill_type="produce",
            notes="SCENARIO: extended role-play",
        ))

    elif drill_mode in (
        DrillMode.THREE_PHASE_IMMERSION,
        DrillMode.TWO_PHASE_ADVANCED,
        DrillMode.ONE_PHASE_NATIVE,
    ):
        # Levels 3-5: increasingly immersive
        steps.append(DrillStep(
            instruction="Listen to this conversation.",
            expected_response="[Complex conversation plays]",
            instruction_language="target" if drill_mode != DrillMode.THREE_PHASE_IMMERSION else "english",
            drill_type="listen",
            notes="CONVERSATION: naturalistic dialogue",
        ))

        # Integrated drill-scenario
        all_items = list(review_vocab[:6]) + list(new_vocab)
        for entry in all_items:
            steps.append(DrillStep(
                instruction=f"Say: {entry.translation}" if english_pct > 0.3
                else f"Dites: {entry.translation}",
                expected_response=entry.word,
                instruction_language=instruction_lang,
                drill_type="produce",
                notes="IMMERSIVE: drill within scenario",
            ))

    return steps


class CourseGenerator:
    """Generates a complete Pimsleur-style course plan.

    Args:
        vocabulary: List of VocabEntry items for the course
        target_level: Course level (1-5)
        language: Target language name
        lessons_per_level: Number of lessons per level (default 30)
    """

    def __init__(
        self,
        vocabulary: list[VocabEntry],
        target_level: int = 1,
        language: str = "french",
        lessons_per_level: int = 30,
    ):
        self.vocabulary = vocabulary
        self.target_level = target_level
        self.language = language
        self.lessons_per_level = lessons_per_level
        self.teaching_mode = get_teaching_mode(target_level)
        self.drill_mode = get_drill_mode(target_level)

    def generate(self) -> CoursePlan:
        """Generate the complete course plan.

        Returns:
            CoursePlan with all lessons populated
        """
        # Step 1: Assign vocabulary to lessons
        lesson_assignments = assign_vocabulary_to_lessons(
            self.vocabulary,
            total_lessons=self.lessons_per_level,
        )

        # Step 2: Generate each lesson
        lessons: list[LessonPlan] = []
        for i in range(self.lessons_per_level):
            lesson_number = i + 1
            new_vocab = lesson_assignments[i]

            # Get review items using SRS
            review_vocab = build_review_schedule(lesson_assignments, lesson_number)

            # Calculate lesson parameters
            english_pct = get_english_pct(self.target_level, lesson_number)
            bc_count = get_backchaining_count(self.target_level, lesson_number)
            has_reading = get_has_reading(self.target_level, lesson_number)

            # Generate drill sequence
            drills = generate_drill_sequence(
                new_vocab=new_vocab,
                review_vocab=review_vocab,
                drill_mode=self.drill_mode,
                english_pct=english_pct,
                backchaining_count=bc_count,
            )

            # Determine theme from vocabulary
            theme = "mixed"
            if new_vocab:
                themes = [v.theme for v in new_vocab]
                # Most common theme
                theme = max(set(themes), key=themes.count)

            lesson = LessonPlan(
                lesson_number=lesson_number,
                level=self.target_level,
                teaching_mode=self.teaching_mode,
                drill_mode=self.drill_mode,
                theme=theme,
                new_vocabulary=new_vocab,
                review_vocabulary=review_vocab,
                drill_sequence=drills,
                estimated_new_items=len(new_vocab),
                estimated_review_items=len(review_vocab),
                english_instruction_pct=english_pct,
                backchaining_count=bc_count,
                has_reading_section=has_reading,
            )
            lessons.append(lesson)

        return CoursePlan(
            language=self.language,
            level=self.target_level,
            total_lessons=self.lessons_per_level,
            lessons=lessons,
        )


# --- Convenience: Generate a sample French Level 1 course ---


SAMPLE_FRENCH_L1_VOCAB = [
    # Meta-communication (L1-3)
    VocabEntry("pardon", "excuse me", "meta_communication", backchain=True),
    VocabEntry("comprenez", "you understand", "meta_communication", backchain=True),
    VocabEntry("comprends", "I understand", "meta_communication"),
    VocabEntry("l'anglais", "English", "meta_communication"),
    VocabEntry("le français", "French", "meta_communication"),
    VocabEntry("un peu", "a little", "meta_communication"),
    VocabEntry("est-ce que", "question marker", "meta_communication"),
    VocabEntry("oui", "yes", "meta_communication"),
    VocabEntry("non", "no", "meta_communication"),
    # Greetings (L2)
    VocabEntry("bonjour", "hello", "greetings", backchain=True),
    VocabEntry("au revoir", "goodbye", "greetings"),
    VocabEntry("comment allez-vous", "how are you", "greetings"),
    VocabEntry("merci", "thank you", "greetings"),
    VocabEntry("très bien", "very well", "greetings"),
    VocabEntry("madame", "ma'am", "greetings"),
    VocabEntry("monsieur", "sir", "greetings"),
    VocabEntry("mademoiselle", "miss", "greetings"),
    VocabEntry("je vais bien", "I'm well", "greetings"),
    # Identity (L3)
    VocabEntry("je suis", "I am", "identity"),
    VocabEntry("vous êtes", "you are", "identity"),
    VocabEntry("américain", "American (m)", "identity", grammar_note="gender agreement"),
    VocabEntry("américaine", "American (f)", "identity", grammar_note="gender agreement"),
    VocabEntry("français", "French (m)", "identity"),
    VocabEntry("française", "French (f)", "identity"),
    VocabEntry("s'il vous plaît", "please", "identity"),
    VocabEntry("parlez", "you speak", "identity"),
    VocabEntry("mais", "but", "identity"),
    # Locations (L4)
    VocabEntry("où est", "where is", "locations"),
    VocabEntry("la rue", "the street", "locations"),
    VocabEntry("le restaurant", "the restaurant", "locations", backchain=True),
    VocabEntry("ici", "here", "locations"),
    VocabEntry("là-bas", "over there", "locations"),
    VocabEntry("c'est", "it is", "locations"),
    VocabEntry("ce n'est pas", "it is not", "locations"),
    VocabEntry("le boulevard", "the boulevard", "locations"),
    VocabEntry("la", "the (f)", "locations"),
    # Food & drink (L5-8)
    VocabEntry("je voudrais", "I would like", "food_and_drink",
               handle_construction="je voudrais + inf"),
    VocabEntry("boire", "to drink", "food_and_drink",
               handle_construction="je voudrais + inf"),
    VocabEntry("manger", "to eat", "food_and_drink",
               handle_construction="je voudrais + inf"),
    VocabEntry("quelque chose", "something", "food_and_drink"),
    VocabEntry("maintenant", "now", "food_and_drink", backchain=True),
    VocabEntry("plus tard", "later", "food_and_drink"),
    VocabEntry("du vin", "some wine", "food_and_drink", grammar_note="partitive article"),
    VocabEntry("de la bière", "some beer", "food_and_drink", grammar_note="partitive article"),
    VocabEntry("acheter", "to buy", "food_and_drink",
               handle_construction="je voudrais + inf"),
    # Time (L10-11)
    VocabEntry("quelle heure est-il", "what time is it", "time"),
    VocabEntry("il est", "it is (time)", "time"),
    VocabEntry("aujourd'hui", "today", "time"),
    VocabEntry("demain", "tomorrow", "time"),
    VocabEntry("ce soir", "tonight", "time"),
    VocabEntry("demain soir", "tomorrow evening", "time"),
    VocabEntry("je vais", "I'm going to", "time",
               handle_construction="je vais + inf"),
    VocabEntry("dîner", "to have dinner / dinner", "time"),
    VocabEntry("déjeuner", "to have lunch / lunch", "time"),
]


def generate_sample_course() -> CoursePlan:
    """Generate a sample French Level 1 course for demonstration."""
    generator = CourseGenerator(
        vocabulary=SAMPLE_FRENCH_L1_VOCAB,
        target_level=1,
        language="french",
    )
    return generator.generate()
