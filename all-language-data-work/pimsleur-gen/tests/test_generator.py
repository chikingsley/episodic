"""Tests for the Pimsleur-style lesson generator."""

import pytest

from src.generator import (
    CourseGenerator,
    DrillMode,
    TeachingMode,
    VocabEntry,
    assign_vocabulary_to_lessons,
    build_review_schedule,
    generate_drill_sequence,
    generate_sample_course,
    get_backchaining_count,
    get_drill_mode,
    get_english_pct,
    get_has_reading,
    get_teaching_mode,
)

# --- Teaching Mode Tests ---


class TestTeachingMode:
    def test_level_1_is_bootstrap(self):
        assert get_teaching_mode(1) == TeachingMode.BOOTSTRAP

    def test_level_2_is_scaffold(self):
        assert get_teaching_mode(2) == TeachingMode.SCAFFOLD

    def test_levels_3_5_are_immersion(self):
        for level in (3, 4, 5):
            assert get_teaching_mode(level) == TeachingMode.IMMERSION


class TestDrillMode:
    def test_level_1_eight_phase(self):
        assert get_drill_mode(1) == DrillMode.EIGHT_PHASE

    def test_level_2_four_phase(self):
        assert get_drill_mode(2) == DrillMode.FOUR_PHASE_SCAFFOLD

    def test_level_3_three_phase(self):
        assert get_drill_mode(3) == DrillMode.THREE_PHASE_IMMERSION

    def test_level_4_two_phase(self):
        assert get_drill_mode(4) == DrillMode.TWO_PHASE_ADVANCED

    def test_level_5_one_phase(self):
        assert get_drill_mode(5) == DrillMode.ONE_PHASE_NATIVE


# --- English Percentage Tests ---


class TestEnglishPercentage:
    def test_l1_foundation_is_100_percent(self):
        """Level 1, lessons 1-8: 100% English instructions."""
        for lesson in range(1, 9):
            assert get_english_pct(1, lesson) == 1.0

    def test_l1_multimodal_decreases(self):
        """Level 1, lessons 9-21: English decreases."""
        pct_9 = get_english_pct(1, 9)
        pct_21 = get_english_pct(1, 21)
        assert pct_9 > pct_21
        assert 0.4 < pct_9 < 0.8
        assert 0.3 < pct_21 < 0.7

    def test_l1_flip_is_low(self):
        """Level 1, lessons 22+: ~20% English after instruction flip."""
        assert get_english_pct(1, 22) == pytest.approx(0.2)

    def test_l2_is_moderate(self):
        """Level 2: 40-60% English."""
        pct = get_english_pct(2, 15)
        assert 0.3 < pct < 0.7

    def test_l5_is_minimal(self):
        """Level 5: ~10% English."""
        assert get_english_pct(5, 15) == pytest.approx(0.1)

    def test_english_decreases_with_level(self):
        """Higher levels should have less English."""
        pcts = [get_english_pct(level, 15) for level in range(1, 6)]
        for i in range(len(pcts) - 1):
            assert pcts[i] >= pcts[i + 1]


# --- Backchaining Tests ---


class TestBackchaining:
    def test_l1_lesson1_heavy_backchaining(self):
        """Level 1, Lesson 1 should have heavy backchaining (7)."""
        assert get_backchaining_count(1, 1) == 7

    def test_l1_backchaining_decreases(self):
        """Level 1 backchaining should decrease over time."""
        counts = [get_backchaining_count(1, i) for i in range(1, 9)]
        assert counts[0] > counts[-1]

    def test_l2_backchaining_is_rare(self):
        """Level 2 should have rare backchaining (1 per lesson)."""
        assert get_backchaining_count(2, 15) == 1

    def test_l3_plus_backchaining_is_zero(self):
        """Levels 3+ should have essentially no backchaining."""
        for level in (3, 4, 5):
            assert get_backchaining_count(level, 15) == 0


# --- Reading Section Tests ---


class TestReadingSection:
    def test_l1_no_reading_before_l9(self):
        """Level 1: no reading before lesson 9."""
        for lesson in range(1, 9):
            assert not get_has_reading(1, lesson)

    def test_l1_reading_from_l9(self):
        """Level 1: reading from lesson 9 onward."""
        for lesson in range(9, 31):
            assert get_has_reading(1, lesson)

    def test_l2_plus_always_has_reading(self):
        """Levels 2+ always have reading."""
        for level in (2, 3, 4, 5):
            for lesson in (1, 15, 30):
                assert get_has_reading(level, lesson)


# --- Vocabulary Assignment Tests ---


class TestVocabularyAssignment:
    @pytest.fixture()
    def sample_vocab(self) -> list[VocabEntry]:
        """Create a sample vocabulary list."""
        return [
            VocabEntry("pardon", "excuse me", "meta_communication"),
            VocabEntry("comprenez", "you understand", "meta_communication"),
            VocabEntry("bonjour", "hello", "greetings"),
            VocabEntry("merci", "thank you", "greetings"),
            VocabEntry("où est", "where is", "locations"),
            VocabEntry("restaurant", "restaurant", "locations"),
            VocabEntry("manger", "to eat", "food_and_drink"),
            VocabEntry("boire", "to drink", "food_and_drink"),
        ]

    def test_assigns_vocab_to_lessons(self, sample_vocab: list[VocabEntry]):
        """Vocabulary should be assigned across lessons."""
        assignments = assign_vocabulary_to_lessons(sample_vocab, total_lessons=5, target_per_lesson=3)
        assert len(assignments) == 5
        total = sum(len(a) for a in assignments)
        assert total == len(sample_vocab)

    def test_respects_target_per_lesson(self, sample_vocab: list[VocabEntry]):
        """Most lessons should not exceed target_per_lesson."""
        assignments = assign_vocabulary_to_lessons(
            sample_vocab, total_lessons=5, target_per_lesson=3,
        )
        # At least some lessons should be at or under target
        under_target = [a for a in assignments if len(a) <= 3]
        assert len(under_target) >= 2

    def test_themes_are_grouped(self, sample_vocab: list[VocabEntry]):
        """Items from the same theme should tend to be in the same or adjacent lessons."""
        assignments = assign_vocabulary_to_lessons(sample_vocab, total_lessons=5, target_per_lesson=3)
        # Meta-communication should come before locations
        meta_lessons = set()
        location_lessons = set()
        for i, lesson_vocab in enumerate(assignments):
            for v in lesson_vocab:
                if v.theme == "meta_communication":
                    meta_lessons.add(i)
                elif v.theme == "locations":
                    location_lessons.add(i)
        if meta_lessons and location_lessons:
            assert min(meta_lessons) <= min(location_lessons)

    def test_empty_vocabulary(self):
        """Empty vocabulary should produce empty lessons."""
        assignments = assign_vocabulary_to_lessons([], total_lessons=5)
        assert all(len(a) == 0 for a in assignments)


# --- Review Schedule Tests ---


class TestReviewSchedule:
    def test_no_review_in_first_lesson(self):
        """Lesson 1 should have no review vocabulary."""
        vocab = [VocabEntry("test", "test", "custom")]
        assignments = [[vocab[0]], [], [], []]
        review = build_review_schedule(assignments, 1)
        assert len(review) == 0

    def test_review_in_second_lesson(self):
        """Lesson 2 should review lesson 1 vocabulary."""
        vocab = [VocabEntry("pardon", "excuse me", "meta_communication")]
        assignments = [vocab, [], [], []]
        review = build_review_schedule(assignments, 2)
        # L1 items have 6 occurrences expected in L2 (relative lesson 2)
        assert len(review) > 0

    def test_gap_lessons_have_no_review(self):
        """Lessons in the gap (relative L6-8) should have no review of L1 items."""
        vocab = [VocabEntry("pardon", "excuse me", "meta_communication")]
        assignments = [vocab] + [[] for _ in range(9)]
        # Relative lesson 6 = intro lesson 1, current lesson 6
        review = build_review_schedule(assignments, 6)
        # Gap: expected_occurrences(6, 1) = CROSS_LESSON_PATTERN[6] = 0
        assert len(review) == 0

    def test_review_returns_after_gap(self):
        """Lesson 9 (relative) should bring back L1 items."""
        vocab = [VocabEntry("pardon", "excuse me", "meta_communication")]
        assignments = [vocab] + [[] for _ in range(9)]
        review = build_review_schedule(assignments, 9)
        # Relative lesson 9 from intro lesson 1 = CROSS_LESSON_PATTERN[9] = 3
        assert len(review) > 0


# --- Drill Sequence Tests ---


class TestDrillSequence:
    @pytest.fixture()
    def new_vocab(self) -> list[VocabEntry]:
        return [
            VocabEntry("pardon", "excuse me", "meta_communication", backchain=True),
            VocabEntry("comprenez", "you understand", "meta_communication", backchain=True),
            VocabEntry("bonjour", "hello", "greetings"),
        ]

    @pytest.fixture()
    def review_vocab(self) -> list[VocabEntry]:
        return [VocabEntry("merci", "thank you", "greetings")]

    def test_eight_phase_has_listen_step(self, new_vocab, review_vocab):
        """8-phase model should start with a LISTEN step."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.EIGHT_PHASE, 1.0, 2,
        )
        assert drills[0].drill_type == "listen"

    def test_eight_phase_has_backchaining(self, new_vocab, review_vocab):
        """8-phase model should include backchaining for marked items."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.EIGHT_PHASE, 1.0, 2,
        )
        backchain_steps = [d for d in drills if d.drill_type == "backchain"]
        assert len(backchain_steps) == 2  # pardon and comprenez

    def test_eight_phase_has_roleplay(self, new_vocab, review_vocab):
        """8-phase model should end with roleplay."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.EIGHT_PHASE, 1.0, 2,
        )
        assert drills[-1].notes.startswith("ROLEPLAY")

    def test_eight_phase_has_recall(self, new_vocab, review_vocab):
        """8-phase model should include recall of review items."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.EIGHT_PHASE, 1.0, 2,
        )
        recall_steps = [d for d in drills if d.drill_type == "recall"]
        assert len(recall_steps) >= 1

    def test_four_phase_scaffold(self, new_vocab, review_vocab):
        """4-phase scaffold should have conversation, highlight, drill-cycle, scenario."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.FOUR_PHASE_SCAFFOLD, 0.5, 1,
        )
        types = [d.notes.split(":")[0] for d in drills]
        assert "CONVERSATION" in types
        assert "HIGHLIGHT" in types
        assert "DRILL-CYCLE" in types
        assert "SCENARIO" in types

    def test_immersion_has_conversation(self, new_vocab, review_vocab):
        """Immersion mode should start with conversation."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.THREE_PHASE_IMMERSION, 0.3, 0,
        )
        assert drills[0].drill_type == "listen"

    def test_immersion_uses_target_instructions(self, new_vocab, review_vocab):
        """Low english_pct should produce target language instructions."""
        drills = generate_drill_sequence(
            new_vocab, review_vocab, DrillMode.ONE_PHASE_NATIVE, 0.1, 0,
        )
        target_instructions = [d for d in drills if d.instruction_language == "target"]
        assert len(target_instructions) > 0


# --- Course Generator Integration Tests ---


class TestCourseGenerator:
    def test_generates_30_lessons(self):
        """Generator should produce 30 lessons."""
        course = generate_sample_course()
        assert len(course.lessons) == 30

    def test_course_is_level_1(self):
        """Sample course should be level 1."""
        course = generate_sample_course()
        assert course.level == 1
        assert course.language == "french"

    def test_all_lessons_have_teaching_mode(self):
        """Every lesson should have bootstrap teaching mode for L1."""
        course = generate_sample_course()
        for lesson in course.lessons:
            assert lesson.teaching_mode == TeachingMode.BOOTSTRAP

    def test_early_lessons_have_high_english(self):
        """Lessons 1-8 should have 100% English instructions."""
        course = generate_sample_course()
        for lesson in course.lessons[:8]:
            assert lesson.english_instruction_pct == 1.0

    def test_later_lessons_have_less_english(self):
        """Lessons 22+ should have low English instructions."""
        course = generate_sample_course()
        assert course.lessons[21].english_instruction_pct < 0.3

    def test_early_lessons_have_backchaining(self):
        """Early lessons should have backchaining."""
        course = generate_sample_course()
        assert course.lessons[0].backchaining_count > 0

    def test_no_reading_before_l9(self):
        """Lessons 1-8 should not have reading sections."""
        course = generate_sample_course()
        for lesson in course.lessons[:8]:
            assert not lesson.has_reading_section

    def test_reading_from_l9(self):
        """Lessons 9+ should have reading sections."""
        course = generate_sample_course()
        for lesson in course.lessons[8:]:
            assert lesson.has_reading_section

    def test_vocabulary_is_distributed(self):
        """Vocabulary should be spread across lessons, not all in one."""
        course = generate_sample_course()
        non_empty = [lsn for lsn in course.lessons if lsn.estimated_new_items > 0]
        assert len(non_empty) > 3  # At least 4 lessons have new vocab

    def test_review_builds_over_time(self):
        """Later lessons should have more review vocabulary."""
        course = generate_sample_course()
        # First lesson has no review
        assert course.lessons[0].estimated_review_items == 0
        # Later lessons should have some review
        has_review = any(lsn.estimated_review_items > 0 for lsn in course.lessons[1:])
        assert has_review

    def test_drill_sequences_exist(self):
        """Every lesson should have a drill sequence."""
        course = generate_sample_course()
        for lesson in course.lessons:
            assert len(lesson.drill_sequence) > 0

    def test_summary_is_readable(self):
        """Course summary should be a non-empty string."""
        course = generate_sample_course()
        summary = course.summary()
        assert isinstance(summary, str)
        assert len(summary) > 100
        assert "COURSE: French Level 1" in summary


class TestMultiLevelGeneration:
    """Test generation at different levels."""

    @pytest.fixture()
    def basic_vocab(self) -> list[VocabEntry]:
        return [
            VocabEntry("bonjour", "hello", "greetings"),
            VocabEntry("merci", "thank you", "greetings"),
            VocabEntry("pardon", "excuse me", "meta_communication"),
        ]

    def test_level_2_generation(self, basic_vocab):
        gen = CourseGenerator(basic_vocab, target_level=2, language="french")
        course = gen.generate()
        assert course.level == 2
        assert course.lessons[0].teaching_mode == TeachingMode.SCAFFOLD
        assert course.lessons[0].drill_mode == DrillMode.FOUR_PHASE_SCAFFOLD

    def test_level_3_generation(self, basic_vocab):
        gen = CourseGenerator(basic_vocab, target_level=3, language="french")
        course = gen.generate()
        assert course.level == 3
        assert course.lessons[0].teaching_mode == TeachingMode.IMMERSION
        assert course.lessons[0].drill_mode == DrillMode.THREE_PHASE_IMMERSION

    def test_level_5_generation(self, basic_vocab):
        gen = CourseGenerator(basic_vocab, target_level=5, language="french")
        course = gen.generate()
        assert course.level == 5
        assert course.lessons[0].drill_mode == DrillMode.ONE_PHASE_NATIVE
        assert course.lessons[0].english_instruction_pct == pytest.approx(0.1)

    def test_higher_levels_have_less_english(self, basic_vocab):
        """English percentage should decrease with level."""
        courses = [
            CourseGenerator(basic_vocab, target_level=level).generate()
            for level in range(1, 6)
        ]
        pcts = [c.lessons[14].english_instruction_pct for c in courses]
        for i in range(len(pcts) - 1):
            assert pcts[i] >= pcts[i + 1]

    def test_higher_levels_have_less_backchaining(self, basic_vocab):
        """Backchaining should decrease with level."""
        courses = [
            CourseGenerator(basic_vocab, target_level=level).generate()
            for level in range(1, 6)
        ]
        bc = [c.lessons[0].backchaining_count for c in courses]
        assert bc[0] > bc[-1]
