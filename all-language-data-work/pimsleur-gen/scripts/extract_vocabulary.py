"""Extract French vocabulary from Pimsleur Level 1-5 transcripts.

Identifies French words/phrases from the transcripts and tracks:
- Total unique words per level
- Overlap between consecutive levels
- "Permanent" vocabulary that persists across all levels
- Introduction rate per lesson

Usage:
    uv run python scripts/extract_vocabulary.py
"""

import re
from collections import Counter, defaultdict
from pathlib import Path

# Common French words (articles, pronouns, prepositions, etc.) that appear
# in EVERY level and aren't interesting to track individually
FUNCTION_WORDS = {
    "le", "la", "les", "l", "un", "une", "des", "du", "de", "d",
    "je", "j", "tu", "il", "elle", "nous", "on", "vous", "ils", "elles",
    "me", "m", "te", "t", "se", "s", "lui", "leur", "y", "en",
    "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses",
    "notre", "nos", "votre", "vos",
    "ce", "cette", "ces", "c", "ça",
    "et", "ou", "mais", "donc", "car", "ni", "que", "qu",
    "à", "au", "aux", "dans", "sur", "sous", "avec", "sans", "pour",
    "par", "en", "entre", "vers", "chez", "contre",
    "ne", "pas", "plus", "jamais", "rien", "personne",
    "est", "a", "ai", "as", "ont", "avons", "avez", "suis", "es",
    "êtes", "sommes", "sont", "été", "eu",
    "qui", "que", "quoi", "où", "dont", "comment", "quand", "combien",
    "pourquoi",
    "très", "bien", "aussi", "si", "oui", "non", "merci",
    "tout", "tous", "toute", "toutes",
}

# French word pattern - includes accented characters and hyphens
FRENCH_WORD = re.compile(r"\b[a-zàâäéèêëïîôùûüÿçœæ][a-zàâäéèêëïîôùûüÿçœæ'-]*\b", re.IGNORECASE)

# Patterns that indicate English text (narrator instructions)
ENGLISH_MARKERS = [
    "listen to", "this is unit", "this is the end", "how do you say",
    "how would you", "try to say", "do you remember", "what does",
    "now say", "say that", "ask her", "ask him", "tell her", "tell him",
    "answer", "respond", "she answers", "he answers", "he says", "she says",
    "now suppose", "imagine that", "speaking with", "the man", "the woman",
    "which means", "literally means", "a friend", "an american",
    "in this conversation", "you heard", "in french",
    "listening practice", "reading practice", "reading booklet",
    "speak and read", "pimsleur", "essential french",
    "here's how", "this means", "remember",
]


def is_likely_english_line(line: str) -> bool:
    """Check if a line is likely English narration rather than French content."""
    lower = line.lower().strip()
    if not lower:
        return True

    # Check for English markers
    for marker in ENGLISH_MARKERS:
        if marker in lower:
            return True

    # Lines starting with common English patterns
    if any(lower.startswith(p) for p in [
        "this is", "listen", "now", "how", "try", "do you",
        "what", "say", "ask", "tell", "answer", "respond",
        "she ", "he ", "the ", "your ", "a ", "an ", "in ",
        "would you", "can you", "you are", "you will",
        "speaking", "imagine", "suppose",
    ]):
        return True

    return False


def is_french_word(word: str) -> bool:
    """Check if a word looks French (has accented characters or is in known French patterns)."""
    # Words with French accented characters are almost certainly French
    if any(c in word for c in "àâäéèêëïîôùûüÿçœæ"):
        return True

    # Common French-only patterns
    french_endings = [
        "ment", "tion", "sion", "eur", "euse", "eux", "oir",
        "ais", "ait", "aient", "ons", "ez", "ent",
        "ée", "ées", "és",
    ]
    for ending in french_endings:
        if word.lower().endswith(ending) and len(word) > len(ending) + 1:
            return True

    return False


def extract_french_words(text: str) -> Counter:
    """Extract French words from transcript text.

    Strategy: Process line by line. Skip lines that look like English narration.
    From French lines, extract all words. Filter out function words.
    """
    words = Counter()

    for line in text.split("\n"):
        line = line.strip()

        # Skip empty lines
        if not line:
            continue

        # Skip unit/lesson headers
        if line.startswith("##") or line.startswith("====="):
            continue

        # Skip lines that are clearly English narration
        if is_likely_english_line(line):
            continue

        # Extract words from this line
        found = FRENCH_WORD.findall(line)
        for word in found:
            w = word.lower().strip("'-")
            if len(w) < 2:
                continue
            if w in FUNCTION_WORDS:
                continue
            # Skip pure English words
            if w in {
                "the", "is", "are", "was", "were", "have", "has", "had",
                "do", "does", "did", "will", "would", "could", "should",
                "can", "may", "might", "shall", "must",
                "not", "no", "yes", "and", "or", "but", "if", "then",
                "this", "that", "these", "those", "it", "its",
                "my", "your", "his", "her", "our", "their",
                "what", "when", "where", "who", "how", "why",
                "here", "there", "now", "then", "very", "too",
                "some", "any", "all", "each", "every",
                "from", "with", "about", "into", "over", "after", "before",
                "up", "out", "off", "down", "away",
                "say", "said", "says", "ask", "asked", "tell", "told",
                "go", "going", "come", "want", "like", "know", "think",
                "good", "bad", "new", "old", "big", "small", "long",
                "just", "still", "already", "also", "only",
                "mr", "mrs", "miss", "sir",
                "something", "nothing", "everything",
                "because", "so", "than", "while",
            }:
                continue
            words[w] += 1

    return words


def analyze_transcript(filepath: Path) -> Counter:
    """Analyze a single transcript file."""
    text = filepath.read_text(encoding="utf-8", errors="replace")
    return extract_french_words(text)


def main():
    base = Path(__file__).parent.parent.parent
    transcript_dir = base / "french-course-transcripts" / "Pimsleur" / "Full Combined Files"

    files = {
        "Level 1": transcript_dir / "pimsleur_french_1_full.md",
        "Level 2": transcript_dir / "pimsleur_french_2_full.md",
        "Level 3": transcript_dir / "pimsleur_french_3_full.txt",
        "Level 4": transcript_dir / "pimsleur_french_4_full.txt",
        "Level 5": transcript_dir / "pimsleur_french_5_full.txt",
    }

    level_vocab: dict[str, set[str]] = {}
    level_counts: dict[str, Counter] = {}

    print("=" * 80)
    print("PIMSLEUR FRENCH VOCABULARY EXTRACTION")
    print("=" * 80)

    for level_name, filepath in files.items():
        if not filepath.exists():
            print(f"\n{level_name}: FILE NOT FOUND ({filepath})")
            continue

        words = analyze_transcript(filepath)
        level_vocab[level_name] = set(words.keys())
        level_counts[level_name] = words

        # Top 30 most frequent words
        top_30 = words.most_common(30)

        print(f"\n{'=' * 60}")
        print(f"{level_name}")
        print(f"{'=' * 60}")
        print(f"  Total unique words (non-function): {len(words)}")
        print(f"  Total word occurrences: {sum(words.values())}")
        print(f"  Top 30 most frequent:")
        for i, (word, count) in enumerate(top_30, 1):
            print(f"    {i:2}. {word:25} ({count:4} occurrences)")

    # Cross-level analysis
    if len(level_vocab) >= 2:
        print(f"\n{'=' * 80}")
        print("CROSS-LEVEL ANALYSIS")
        print(f"{'=' * 80}")

        levels = list(level_vocab.keys())

        # Overlap between consecutive levels
        print("\n--- Overlap Between Consecutive Levels ---")
        for i in range(len(levels) - 1):
            l1, l2 = levels[i], levels[i + 1]
            overlap = level_vocab[l1] & level_vocab[l2]
            only_l1 = level_vocab[l1] - level_vocab[l2]
            only_l2 = level_vocab[l2] - level_vocab[l1]
            print(f"\n  {l1} → {l2}:")
            print(f"    Shared vocabulary: {len(overlap)} words")
            print(f"    Only in {l1}: {len(only_l1)} words")
            print(f"    New in {l2}: {len(only_l2)} words")
            print(f"    Carryover rate: {len(overlap) / len(level_vocab[l1]) * 100:.1f}%")

        # Vocabulary that persists across ALL levels
        if len(level_vocab) >= 5:
            all_levels = set.intersection(*level_vocab.values())
            print(f"\n--- Vocabulary Present in ALL 5 Levels ---")
            print(f"  Total: {len(all_levels)} words")
            # Sort by combined frequency
            combined = Counter()
            for c in level_counts.values():
                combined.update(c)
            persistent = [(w, combined[w]) for w in all_levels]
            persistent.sort(key=lambda x: -x[1])
            print(f"  Top 50 persistent words:")
            for i, (word, count) in enumerate(persistent[:50], 1):
                print(f"    {i:2}. {word:25} ({count:5} total occurrences across all levels)")

        # Level-exclusive vocabulary (words that appear in only one level)
        print(f"\n--- Level-Exclusive Vocabulary ---")
        for level in levels:
            exclusive = level_vocab[level] - set.union(*(
                level_vocab[other] for other in levels if other != level
            ))
            print(f"\n  {level}: {len(exclusive)} exclusive words")
            if exclusive:
                # Show top 20 by frequency
                excl_sorted = sorted(exclusive, key=lambda w: -level_counts[level][w])
                print(f"  Top 20:")
                for i, word in enumerate(excl_sorted[:20], 1):
                    print(f"    {i:2}. {word:25} ({level_counts[level][word]:4} occurrences)")

        # Cumulative vocabulary growth
        print(f"\n--- Cumulative Vocabulary Growth ---")
        cumulative = set()
        for level in levels:
            new_words = level_vocab[level] - cumulative
            cumulative |= level_vocab[level]
            print(f"  After {level}: {len(cumulative)} total unique words ({len(new_words)} new)")


if __name__ == "__main__":
    main()
