"""Tests for the drill patterns module.

These tests verify that the formalized drill patterns match observed Pimsleur structure.
"""

from src.drill_patterns import (
    TARGET_LANGUAGE_MARKERS,
    DrillPhase,
    LessonStructure,
    PromptType,
    get_phase_for_prompt,
    identify_prompt_type,
)


class TestPromptTypeIdentification:
    """Tests for identifying prompt types from text."""

    def test_listen_and_repeat(self):
        """Test identification of listen and repeat prompts."""
        assert identify_prompt_type("Listen and repeat") == PromptType.LISTEN_AND_REPEAT
        assert identify_prompt_type("Repeat after the speaker") == PromptType.LISTEN_AND_REPEAT

    def test_say_prompts(self):
        """Test identification of say prompts."""
        assert identify_prompt_type("Say hello") == PromptType.SAY
        assert identify_prompt_type("Now say goodbye") == PromptType.SAY

    def test_how_do_you_say(self):
        """Test identification of 'how do you say' prompts."""
        result = identify_prompt_type("How do you say 'thank you'?")
        assert result == PromptType.HOW_DO_YOU_SAY

    def test_try_to_say(self):
        """Test identification of 'try to say' prompts."""
        assert identify_prompt_type("Try to say 'hello'") == PromptType.TRY_TO_SAY

    def test_ask_prompts(self):
        """Test identification of ask prompts."""
        assert identify_prompt_type("Ask her if she understands") == PromptType.ASK
        assert identify_prompt_type("Now ask where the restaurant is") == PromptType.ASK

    def test_answer_prompts(self):
        """Test identification of answer prompts."""
        assert identify_prompt_type("Answer yes") == PromptType.ANSWER

    def test_do_you_remember(self):
        """Test identification of recall prompts."""
        result = identify_prompt_type("Do you remember how to say goodbye?")
        assert result == PromptType.DO_YOU_REMEMBER

    def test_listen_to_conversation(self):
        """Test identification of conversation listening prompts."""
        result = identify_prompt_type("Listen to this conversation")
        assert result == PromptType.LISTEN_TO_CONVERSATION

    def test_unknown_prompt(self):
        """Test that unknown prompts return None."""
        assert identify_prompt_type("Some random text") is None


class TestTargetLanguagePrompts:
    """Tests for target language prompt identification."""

    def test_french_target_prompts(self):
        """Test French target language prompts."""
        assert identify_prompt_type("Dites bonjour", "french") == PromptType.TARGET_SAY
        assert identify_prompt_type("Demandez si", "french") == PromptType.TARGET_ASK

    def test_spanish_target_prompts(self):
        """Test Spanish target language prompts."""
        assert identify_prompt_type("Diga hola", "spanish") == PromptType.TARGET_SAY
        assert identify_prompt_type("Pregunte", "spanish") == PromptType.TARGET_ASK
        result = identify_prompt_type("Escuche y repita", "spanish")
        assert result == PromptType.TARGET_LISTEN_REPEAT

    def test_german_target_prompts(self):
        """Test German target language prompts."""
        assert identify_prompt_type("Sagen Sie", "german") == PromptType.TARGET_SAY

    def test_italian_target_prompts(self):
        """Test Italian target language prompts."""
        assert identify_prompt_type("Dica", "italian") == PromptType.TARGET_SAY
        assert identify_prompt_type("Mi domandi", "italian") == PromptType.TARGET_ASK

    def test_japanese_target_prompts(self):
        """Test Japanese target language prompts."""
        result = identify_prompt_type("と言ってください", "japanese")
        assert result == PromptType.TARGET_SAY
        result = identify_prompt_type("聞いて繰り返してください", "japanese")
        assert result == PromptType.TARGET_LISTEN_REPEAT

    def test_polish_target_prompts(self):
        """Test Polish target language prompts."""
        result = identify_prompt_type("Proszę powiedzieć", "polish")
        assert result == PromptType.TARGET_SAY
        result = identify_prompt_type("Proszę zapytać", "polish")
        assert result == PromptType.TARGET_ASK

    def test_russian_target_prompts(self):
        """Test Russian target language prompts."""
        assert identify_prompt_type("Скажите", "russian") == PromptType.TARGET_SAY
        result = identify_prompt_type("Слушайте и повторяйте", "russian")
        assert result == PromptType.TARGET_LISTEN_REPEAT


class TestTargetLanguageMarkers:
    """Tests for target language marker completeness."""

    def test_all_seven_languages_have_markers(self):
        """Test that all 7 languages have target language markers."""
        expected_languages = [
            "french", "german", "spanish", "italian",
            "japanese", "polish", "russian"
        ]
        for lang in expected_languages:
            assert lang in TARGET_LANGUAGE_MARKERS, f"Missing markers for {lang}"

    def test_each_language_has_say_marker(self):
        """Test that each language has 'say' markers."""
        for lang, markers in TARGET_LANGUAGE_MARKERS.items():
            assert "say" in markers, f"{lang} missing 'say' marker"
            assert len(markers["say"]) > 0, f"{lang} has empty 'say' markers"

    def test_each_language_has_listen_repeat_marker(self):
        """Test that each language has 'listen_repeat' markers."""
        for lang, markers in TARGET_LANGUAGE_MARKERS.items():
            assert "listen_repeat" in markers, f"{lang} missing 'listen_repeat' marker"


class TestDrillPhaseMapping:
    """Tests for mapping prompt types to drill phases."""

    def test_listen_prompts_map_to_listen_phase(self):
        """Test that listening prompts map to LISTEN phase."""
        assert get_phase_for_prompt(PromptType.LISTEN_TO_CONVERSATION) == DrillPhase.LISTEN

    def test_repeat_prompts_map_to_backchain_phase(self):
        """Test that repeat prompts map to BACKCHAIN phase."""
        assert get_phase_for_prompt(PromptType.LISTEN_AND_REPEAT) == DrillPhase.BACKCHAIN
        assert get_phase_for_prompt(PromptType.TARGET_LISTEN_REPEAT) == DrillPhase.BACKCHAIN

    def test_production_prompts_map_to_drill_phase(self):
        """Test that production prompts map to DRILL phase."""
        assert get_phase_for_prompt(PromptType.SAY) == DrillPhase.DRILL
        assert get_phase_for_prompt(PromptType.HOW_DO_YOU_SAY) == DrillPhase.DRILL
        assert get_phase_for_prompt(PromptType.ASK) == DrillPhase.DRILL

    def test_combine_prompts_map_to_combine_phase(self):
        """Test that combining prompts map to COMBINE phase."""
        assert get_phase_for_prompt(PromptType.SAY_TOGETHER) == DrillPhase.COMBINE


class TestLessonStructure:
    """Tests for lesson structure expectations."""

    def test_foundation_phase_lessons_1_to_8(self):
        """Test that lessons 1-8 are foundation phase."""
        for lesson in range(1, 9):
            structure = LessonStructure.for_lesson(lesson)
            assert structure.phase == "foundation"
            assert structure.has_opening_conversation is True
            assert structure.has_reading_section is False
            assert structure.uses_target_language_instructions is False

    def test_multimodal_phase_lessons_9_to_21(self):
        """Test that lessons 9-21 are multimodal phase."""
        for lesson in range(9, 22):
            structure = LessonStructure.for_lesson(lesson)
            assert structure.phase == "multimodal"
            assert structure.has_reading_section is True
            assert structure.uses_target_language_instructions is False

    def test_instruction_flip_phase_lessons_22_to_27(self):
        """Test that lessons 22-27 are instruction flip phase."""
        for lesson in range(22, 28):
            structure = LessonStructure.for_lesson(lesson)
            assert structure.phase == "instruction_flip"
            assert structure.uses_target_language_instructions is True

    def test_l22_has_no_opening_conversation(self):
        """Test that L22 has no opening conversation."""
        structure = LessonStructure.for_lesson(22)
        assert structure.has_opening_conversation is False

    def test_register_tense_phase_lessons_28_to_30(self):
        """Test that lessons 28-30 are register/tense phase."""
        for lesson in range(28, 31):
            structure = LessonStructure.for_lesson(lesson)
            assert structure.phase == "register_tense"
            assert structure.uses_target_language_instructions is True
            assert structure.backchaining_count == 0

    def test_backchaining_decreases_in_foundation(self):
        """Test that backchaining count decreases through foundation phase."""
        l1 = LessonStructure.for_lesson(1)
        l5 = LessonStructure.for_lesson(5)
        l8 = LessonStructure.for_lesson(8)

        # Backchaining should decrease over time
        assert l1.backchaining_count > l5.backchaining_count
        assert l5.backchaining_count >= l8.backchaining_count

    def test_all_lessons_have_roleplay(self):
        """Test that all lessons have roleplay."""
        for lesson in range(1, 31):
            structure = LessonStructure.for_lesson(lesson)
            assert structure.has_roleplay is True


class TestDrillPhases:
    """Tests for drill phase ordering."""

    def test_all_eight_phases_exist(self):
        """Test that all 8 drill phases are defined."""
        phases = [
            DrillPhase.LISTEN,
            DrillPhase.BREAKDOWN,
            DrillPhase.BACKCHAIN,
            DrillPhase.COMBINE,
            DrillPhase.EXPAND,
            DrillPhase.DRILL,
            DrillPhase.RECONSTRUCT,
            DrillPhase.ROLEPLAY,
        ]
        assert len(phases) == 8

    def test_phases_are_distinct(self):
        """Test that all phases have unique values."""
        phases = list(DrillPhase)
        values = [p.value for p in phases]
        assert len(values) == len(set(values))
