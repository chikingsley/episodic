#!/usr/bin/env python3
"""Analyze phrase dependencies and building blocks in Pimsleur lessons.

Extracts:
1. Atomic units (syllables, single words)
2. Building patterns (how phrases are constructed from atoms)
3. Dependency graph (what must be learned before what)
"""

import csv
import pathlib
import re
from collections import defaultdict
from dataclasses import dataclass, field


@dataclass
class PhraseNode:
    """A phrase and its relationships."""

    text: str
    first_lesson: int
    first_position: int
    occurrences: int = 0
    children: list[str] = field(default_factory=list)  # Phrases that build on this
    parents: list[str] = field(default_factory=list)  # Phrases this builds from


def normalize(text: str) -> str:
    """Normalize text for comparison."""
    return re.sub(r"[.!?,;:]+$", "", text.strip()).lower()


def is_substring_phrase(shorter: str, longer: str) -> bool:
    """Check if shorter phrase is a building block of longer phrase."""
    shorter_norm = normalize(shorter)
    longer_norm = normalize(longer)

    if shorter_norm == longer_norm:
        return False

    # Must be a word-boundary match (not just substring)
    # "je" is in "je comprends" but not in "bonjour"
    words_shorter = set(shorter_norm.split())
    words_longer = set(longer_norm.split())

    # Shorter's words must be subset of longer's words
    return words_shorter.issubset(words_longer) and len(words_shorter) < len(words_longer)


def extract_atoms(phrases: dict[str, PhraseNode]) -> list[str]:
    """Find atomic phrases (not built from anything else in the set)."""
    atoms = []
    for text, node in phrases.items():
        if not node.parents:
            atoms.append(text)
    return sorted(atoms, key=lambda x: (phrases[x].first_lesson, phrases[x].first_position))


def build_dependency_graph(phrases: dict[str, PhraseNode]) -> dict[str, PhraseNode]:
    """Build parent-child relationships between phrases."""
    phrase_texts = list(phrases.keys())

    for i, shorter in enumerate(phrase_texts):
        for longer in phrase_texts[i + 1 :]:
            if is_substring_phrase(shorter, longer):
                phrases[shorter].children.append(longer)
                phrases[longer].parents.append(shorter)
            elif is_substring_phrase(longer, shorter):
                phrases[longer].children.append(shorter)
                phrases[shorter].parents.append(longer)

    return phrases


def load_all_phrases(analysis_dir: pathlib.Path) -> dict[str, PhraseNode]:
    """Load all phrases from lesson CSVs."""
    phrases: dict[str, PhraseNode] = {}

    for lesson_num in range(1, 31):
        csv_path = analysis_dir / f"lesson_{lesson_num:02d}_utterances.csv"
        if not csv_path.exists():
            continue

        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                text = row.get("text", "").strip()
                if not text:
                    continue

                speaker = row.get("speaker", "")
                if speaker not in ["Male Speaker", "Female Speaker"]:
                    continue

                position = int(row.get("position_in_lesson", 0))
                normalized = normalize(text)

                if normalized not in phrases:
                    phrases[normalized] = PhraseNode(
                        text=text,
                        first_lesson=lesson_num,
                        first_position=position,
                    )

                phrases[normalized].occurrences += 1

    return phrases


def analyze_building_patterns(phrases: dict[str, PhraseNode]) -> dict:
    """Analyze how phrases build on each other."""
    # Find phrases that are pure building blocks (have children but simple)
    word_counts = {text: len(normalize(text).split()) for text in phrases}

    single_words = [t for t, count in word_counts.items() if count == 1]
    two_words = [t for t, count in word_counts.items() if count == 2]
    three_plus = [t for t, count in word_counts.items() if count >= 3]

    # Find the most common building blocks
    building_block_usage = defaultdict(int)
    for text, node in phrases.items():
        for child in node.children:
            building_block_usage[text] += 1

    top_blocks = sorted(building_block_usage.items(), key=lambda x: -x[1])[:30]

    return {
        "single_words": len(single_words),
        "two_word_phrases": len(two_words),
        "three_plus_phrases": len(three_plus),
        "top_building_blocks": top_blocks,
    }


def find_learning_chains(phrases: dict[str, PhraseNode]) -> list[list[str]]:
    """Find chains of phrases that build on each other."""
    chains = []

    # Start from atoms (no parents)
    atoms = [t for t, n in phrases.items() if not n.parents]

    def follow_chain(text: str, current_chain: list[str], visited: set[str]) -> list[str]:
        """Follow a chain to its longest form."""
        if text in visited:
            return current_chain
        visited.add(text)
        current_chain.append(text)

        # Find children that add exactly one concept
        node = phrases.get(text)
        if not node or not node.children:
            return current_chain

        # Sort children by word count (prefer gradual building)
        children_by_size = sorted(
            node.children, key=lambda c: len(normalize(c).split())
        )

        if children_by_size:
            # Follow the shortest child (most direct building)
            return follow_chain(children_by_size[0], current_chain, visited)

        return current_chain

    for atom in atoms:
        chain = follow_chain(atom, [], set())
        if len(chain) >= 3:  # Only interesting chains
            chains.append(chain)

    # Sort by chain length
    chains.sort(key=lambda x: -len(x))

    return chains[:20]  # Top 20 chains


def generate_report(phrases: dict[str, PhraseNode], output_dir: pathlib.Path):
    """Generate analysis reports."""
    output_dir.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 70)
    print("PIMSLEUR PHRASE DEPENDENCY ANALYSIS")
    print("=" * 70)

    # Build the graph
    phrases = build_dependency_graph(phrases)

    # Get atoms
    atoms = extract_atoms(phrases)
    print(f"\n--- Atomic Units (no dependencies): {len(atoms)} ---")
    for atom in atoms[:20]:
        node = phrases[atom]
        children_count = len(node.children)
        print(f"  [{node.first_lesson:02d}] {node.text} → {children_count} children")

    # Analyze building patterns
    patterns = analyze_building_patterns(phrases)
    print("\n--- Phrase Complexity ---")
    print(f"  Single words: {patterns['single_words']}")
    print(f"  Two-word phrases: {patterns['two_word_phrases']}")
    print(f"  Three+ word phrases: {patterns['three_plus_phrases']}")

    print("\n--- Top Building Blocks (most reused) ---")
    for text, usage in patterns["top_building_blocks"][:15]:
        node = phrases[text]
        print(f"  [{node.first_lesson:02d}] {node.text} → used in {usage} longer phrases")

    # Find learning chains
    chains = find_learning_chains(phrases)
    print("\n--- Learning Chains (phrase building progressions) ---")
    for i, chain in enumerate(chains[:10], 1):
        print(f"\n  Chain {i}:")
        for j, phrase in enumerate(chain):
            indent = "    " + "  " * j
            node = phrases[phrase]
            print(f"{indent}→ {node.text}")

    # Save detailed output
    csv_path = output_dir / "phrase_dependencies.csv"
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "phrase",
            "first_lesson",
            "occurrences",
            "word_count",
            "parent_count",
            "child_count",
            "parents",
            "children",
        ])

        for text in sorted(phrases.keys(), key=lambda t: (phrases[t].first_lesson, phrases[t].first_position)):
            node = phrases[text]
            writer.writerow([
                node.text,
                node.first_lesson,
                node.occurrences,
                len(normalize(text).split()),
                len(node.parents),
                len(node.children),
                "|".join(node.parents[:5]),
                "|".join(node.children[:5]),
            ])

    print(f"\n✓ Saved dependencies to: {csv_path}")

    # Core vocabulary (most connected)
    connectivity = [(t, len(n.parents) + len(n.children)) for t, n in phrases.items()]
    connectivity.sort(key=lambda x: -x[1])

    print("\n--- Core Vocabulary (most connected) ---")
    for text, connections in connectivity[:20]:
        node = phrases[text]
        print(f"  [{node.first_lesson:02d}] {node.text} ({connections} connections)")


def main():
    project_root = pathlib.Path(__file__).parent.parent
    analysis_dir = project_root / "02_scripts" / "analysis"
    output_dir = analysis_dir / "output"

    print("Loading phrases from all lessons...")
    phrases = load_all_phrases(analysis_dir)
    print(f"Total unique phrases: {len(phrases)}")

    generate_report(phrases, output_dir)

    print("\n" + "=" * 70)
    print("Analysis complete!")


if __name__ == "__main__":
    main()
