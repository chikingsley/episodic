"""Cross-language verification tests for Pimsleur model predictions.

These tests verify that the core Pimsleur predictions hold across ALL 7 languages:
- French, German, Spanish, Italian, Japanese, Polish, Russian

The tests validate universal patterns (not language-specific content).
"""

from pathlib import Path

import pytest

# Path to research data
RESEARCH_DATA = Path(__file__).parent.parent / "research-data"

# Language configurations
LANGUAGES = {
    "french": {
        "l1_file": "french/timestamped-transcripts/sentence-level/French01_Unit_01_sentencelevel.txt",
        "l22_file": "french/timestamped-transcripts/sentence-level/French01_Unit_22_sentencelevel.txt",
        "backchain_words": ["Don", "Par", "Pardon"],
        "l22_markers": ["Pas de conversation", "instructions in French", "français"],
    },
    "german": {
        "l1_file": "german/German01_Unit_01_raw.md",
        "l22_file": "german/German01_Unit_22_raw.md",
        "backchain_words": ["Schuld", "Schuldigen", "Entschuldigen"],
        "l22_markers": ["Starting with this lesson", "instructions in German"],
    },
    "spanish": {
        "l1_file": "spanish/Spanish01_Unit_01_raw.md",
        "l22_file": "spanish/Spanish01_Unit_22_raw.md",
        "backchain_words": ["Rita", "Señorita", "perdón", "llano", "castellano"],
        "l22_markers": ["Pregunte", "Diga", "Escuche y repita"],
    },
    "italian": {
        "l1_file": "italian/Italian01_Unit_01_raw.md",
        "l22_file": "italian/Italian01_Unit_22_raw.md",
        "backchain_words": ["Zee", "Scusi", "scu", "PISSE", "Capisci"],
        "l22_markers": ["In questa lezione non c'è conversazione", "Mi dica", "Mi domandi"],
    },
    "japanese": {
        "l1_file": "japanese/Japanese01_Unit_01_2021_raw.txt",
        "l22_file": "japanese/Japanese01_Unit_22_2021_raw.txt",
        "backchain_words": ["千", "ません", "すみません", "語", "英語"],
        "l22_markers": ["From now on", "instructions in Japanese", "と言ってください"],
    },
    "polish": {
        "l1_file": "polish/Polish01_Unit_01_raw.md",
        "l22_file": "polish/Polish01_Unit_22_raw.md",
        "backchain_words": ["Szam", "Pra", "Przepraszam", "Sku", "Polsku"],
        "l22_markers": ["Starting with this lesson", "instructions in Polish", "Proszę powiedzieć"],
    },
    "russian": {
        "l1_file": "russian/Russian01_Unit_01_raw.md",
        "l22_file": "russian/Russian01_Unit_22_raw.md",
        "backchain_words": ["Те", "Ните", "Извините", "Ски", "Русски"],
        "l22_markers": ["Слушайте и повторяйте", "Слушайте"],
    },
}


def read_transcript(path: Path) -> str:
    """Read transcript file content."""
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


class TestL1Backchaining:
    """Prediction: L1 uses backchaining (end-to-start syllable building) for new vocabulary.

    This is a UNIVERSAL pattern across all 7 languages.
    """

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l1_has_backchaining_fragments(self, language):
        """Test that L1 contains backchaining syllable fragments."""
        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l1_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)
        backchain_words = config["backchain_words"]

        # At least one backchaining fragment should appear
        found = any(word in content for word in backchain_words)
        assert found, (
            f"{language.title()} L1 should contain backchaining fragments. "
            f"Expected one of: {backchain_words}"
        )

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l1_mentions_part_by_part(self, language):
        """Test that L1 mentions the 'part by part' backchaining instruction."""
        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l1_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)

        # Most languages mention "part by part" or equivalent
        part_by_part_markers = [
            "part by part",
            "starting from the end",
            "repeat each part",
        ]

        found = any(marker.lower() in content.lower() for marker in part_by_part_markers)
        assert found, f"{language.title()} L1 should explain the backchaining technique"


class TestL22InstructionFlip:
    """Prediction: L22 announces that instructions will now be given in target language.

    This is a UNIVERSAL pattern across all 7 languages.
    """

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l22_has_instruction_markers(self, language):
        """Test that L22 contains target language instruction markers."""
        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l22_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)
        l22_markers = config["l22_markers"]

        # At least one L22 marker should appear
        found = any(marker in content for marker in l22_markers)
        assert found, (
            f"{language.title()} L22 should contain instruction flip markers. "
            f"Expected one of: {l22_markers}"
        )

    @pytest.mark.parametrize("language", ["french", "german", "polish", "japanese"])
    def test_l22_explicit_announcement(self, language):
        """Test that L22 has explicit announcement about instruction language change.

        Some languages explicitly announce the switch (French, German, Polish, Japanese).
        Others use target language instructions without announcement (Spanish, Italian, Russian).
        """
        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l22_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)

        announcement_phrases = [
            "starting with this lesson",
            "from now on",
            "pas de conversation",
            "in questa lezione",
        ]

        content_lower = content.lower()
        found = any(phrase in content_lower for phrase in announcement_phrases)
        assert found, f"{language.title()} L22 should have explicit instruction flip announcement"


class TestCrossLanguageConsistency:
    """Tests for structural consistency across all languages."""

    def test_all_languages_have_l1_data(self):
        """Test that L1 transcript exists for all 7 languages."""
        for language, config in LANGUAGES.items():
            path = RESEARCH_DATA / config["l1_file"]
            assert path.exists(), f"Missing L1 data for {language}: {path}"

    def test_all_languages_have_l22_data(self):
        """Test that L22 transcript exists for all 7 languages."""
        for language, config in LANGUAGES.items():
            path = RESEARCH_DATA / config["l22_file"]
            assert path.exists(), f"Missing L22 data for {language}: {path}"

    def test_l1_has_excuse_me_equivalent(self):
        """Test that all L1 lessons teach 'excuse me' equivalent.

        This is the universal first phrase taught in Pimsleur L1.
        """
        excuse_me_words = {
            "french": ["Pardon", "pardon"],
            "german": ["Entschuldigen", "entschuldigen", "Entschuldigung"],
            "spanish": ["perdón", "Perdón", "Disculpe"],
            "italian": ["Scusi", "scusi"],
            "japanese": ["すみません", "sumimasen"],
            "polish": ["Przepraszam", "przepraszam"],
            "russian": ["Извините", "извините"],
        }

        for language, config in LANGUAGES.items():
            path = RESEARCH_DATA / config["l1_file"]
            if not path.exists():
                continue

            content = read_transcript(path)
            words = excuse_me_words[language]

            found = any(word in content for word in words)
            assert found, f"{language.title()} L1 should teach 'excuse me' ({words})"

    def test_l1_has_understand_equivalent(self):
        """Test that all L1 lessons teach 'understand' equivalent.

        This is taught alongside 'excuse me' in Pimsleur L1.
        """
        understand_words = {
            "french": ["comprenez", "comprends", "comprend"],
            "german": ["verstehen", "verstehe"],
            "spanish": ["entiende", "entiendo", "comprende"],
            "italian": ["capisce", "capisco", "capisci"],
            "japanese": ["わかります", "わかりません", "wakarimasu"],
            "polish": ["rozumie", "rozumiem"],
            "russian": ["понимаете", "понимаю"],
        }

        for language, config in LANGUAGES.items():
            path = RESEARCH_DATA / config["l1_file"]
            if not path.exists():
                continue

            content = read_transcript(path)
            words = understand_words[language]

            found = any(word in content for word in words)
            assert found, f"{language.title()} L1 should teach 'understand' ({words})"


class TestUniversalPatterns:
    """Tests for patterns that should be truly universal across all Pimsleur courses."""

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l1_starts_with_conversation(self, language):
        """Test that L1 starts with a target conversation to be learned."""
        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l1_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)

        # All L1 lessons start with "Listen to this conversation" or equivalent
        listen_markers = [
            "Listen to this conversation",
            "Listen to this",
            "Hören Sie diese",  # German
            "会話を聞いて",  # Japanese
            "Слушайте",  # Russian
        ]

        # Check first 500 characters for the listen instruction
        first_part = content[:500]
        found = any(marker in first_part for marker in listen_markers)
        assert found, f"{language.title()} L1 should start with 'listen to this conversation'"

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l1_has_yes_no_equivalents(self, language):
        """Test that L1 teaches yes/no equivalents."""
        yes_no_words = {
            "french": ["Oui", "Non"],
            "german": ["Ja", "Nein"],
            "spanish": ["Sí", "No"],
            "italian": ["Sì", "No"],
            "japanese": ["はい", "いいえ"],
            "polish": ["Tak", "Nie"],
            "russian": ["Да", "Нет"],
        }

        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l1_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)
        words = yes_no_words[language]

        # Both yes and no should appear
        for word in words:
            assert word in content, f"{language.title()} L1 should teach '{word}'"

    @pytest.mark.parametrize("language", LANGUAGES.keys())
    def test_l1_teaches_american_identity(self, language):
        """Test that L1 teaches how to say 'I am American'."""
        american_words = {
            "french": ["américain", "Américain"],
            "german": ["Amerikaner", "amerikaner"],
            "spanish": ["americano", "Americano", "norteamericano"],
            "italian": ["americano", "Americano"],
            "japanese": ["アメリカ", "アメリカ人"],
            "polish": ["Amerykaninem", "amerykaninem", "Amerykanin"],
            "russian": ["американец", "Американец"],
        }

        config = LANGUAGES[language]
        path = RESEARCH_DATA / config["l1_file"]

        if not path.exists():
            pytest.skip(f"Test data not found: {path}")

        content = read_transcript(path)
        words = american_words[language]

        found = any(word in content for word in words)
        assert found, f"{language.title()} L1 should teach 'American' ({words})"
