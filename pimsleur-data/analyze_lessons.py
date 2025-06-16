"""
Analyzes Pimsleur lesson transcripts to extract linguistic data.

This script processes text files of Pimsleur French lessons to count
frequences of words, lemmas, sentences, n-grams, and specific grammatical
patterns like negations. It uses spaCy for NLP tasks and Lingua for more
accurate language detection of short text segments.

Results are saved to CSV files for further analysis.
"""

import re
import csv
import pathlib
import sys
import os
import json
import spacy
from dataclasses import dataclass
from typing import List, Optional

from lingua import Language as LinguaLanguage
from lingua import LanguageDetectorBuilder
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv

load_dotenv()


# ----- NLP and Language Detection Setup ------------------------------------
try:
    NLP = spacy.load("fr_core_news_sm")
except OSError:
    print("Spacy French model 'fr_core_news_sm' not found.")
    print("Please run: poetry run python -m spacy download fr_core_news_sm")
    sys.exit(1)

DETECTOR = (
    LanguageDetectorBuilder.from_languages(
        LinguaLanguage.FRENCH, LinguaLanguage.ENGLISH
    )
    .with_preloaded_language_models()
    .build()
)

# ----- Mistral API Setup ---------------------------------------------------
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("MISTRAL_API_KEY not found.")
    print(
        "Please create a .env file in the 'pimsleur-data' directory and add your key:"
    )
    print('MISTRAL_API_KEY="your_mistral_api_key"')
    sys.exit(1)

MISTRAL_CLIENT = MistralClient(api_key=MISTRAL_API_KEY)


# ----- Data Structures -----------------------------------------------------
@dataclass
class ExplicitPhrase:
    """Represents a phrase explicitly taught by the narrator."""

    phrase: str
    teaching_cue: str
    context: str
    speaker_response: Optional[str] = None


# ----- LLM-based Phrase Extraction -----------------------------------------
def extract_phrases_with_llm(transcript: str, model_name: str) -> List[ExplicitPhrase]:
    """
    Uses a Mistral model to extract explicitly taught phrases from a transcript.
    """
    system_prompt = """
You are a linguistic analysis expert. Your task is to analyze a Pimsleur language lesson transcript and identify all phrases that are explicitly being taught to the listener. The narrator will often use cues like 'Say...', 'Here's how to say...', 'Listen and repeat...', or ask a question that the speaker then answers in the target language.

Analyze the provided transcript and extract the following for each taught phrase:
1.  `phrase`: The exact French phrase being taught.
2.  `teaching_cue`: The narrator's line(s) that introduce the phrase.
3.  `context`: A brief description of the pedagogical context (e.g., 'vocabulary_introduction', 'question', 'pronunciation_practice', 'negation').
4.  `speaker_response`: The speaker who says the French phrase ('Male Speaker' or 'Female Speaker').

Return your findings as a JSON object containing a single key "explicit_phrases", which is a list of objects, where each object represents a taught phrase with the fields mentioned above. Only include phrases that are explicitly taught. Do not include parts of conversations that are not direct teaching moments.
"""
    user_prompt = f"Here is the transcript:\n```\n{transcript}\n```\nPlease extract the explicitly taught phrases in JSON format."

    try:
        response = MISTRAL_CLIENT.chat(
            model=model_name,
            response_format={"type": "json_object"},
            messages=[
                ChatMessage(role="system", content=system_prompt),
                ChatMessage(role="user", content=user_prompt),
            ],
        )
        response_content = response.choices[0].message.content
        data = json.loads(response_content)
        return [ExplicitPhrase(**item) for item in data.get("explicit_phrases", [])]

    except Exception as e:
        print(f"An error occurred while calling the Mistral API: {e}")
        return []


# ----- Helper Functions ---------------------------------------------------
def looks_like_abbrev(line: str) -> bool:
    """Return True if the string is a capitalized short word ending with a dot."""
    return bool(re.fullmatch(r"[A-Z][a-z]{1,4}\\.", line.strip()))


def categorize_fr_line(line: str) -> str:
    """Return 'breakdown', 'word_only', or 'phrase' for a confirmed-French line."""
    if (
        "-" in line
        or " " in line.strip()
        and all(len(w) == 1 for w in line.strip().split())
        or looks_like_abbrev(line)
        or (len(line.split()) == 1 and len(line) <= 8 and line.endswith("."))
    ):
        return "breakdown"
    if " " not in line:
        return "word_only"
    return "phrase"


# ----- File I/O Functions ----------------------------------------------------
def write_analysis_files(lesson_stem, output_dir, counters):
    """Dumps all the collected data to their respective CSV files."""
    if counters["breakdowns"]:
        bd_file = output_dir / f"{lesson_stem}_pronunciation_breakdowns.csv"
        with open(bd_file, "w", newline="", encoding="utf-8") as f_bd:
            writer = csv.writer(f_bd)
            writer.writerow(["canonical", "raw_line"])
            # Sort for consistent output
            sorted_breakdowns = sorted(list(counters["breakdowns"]), key=lambda x: x[0])
            writer.writerows(sorted_breakdowns)

    if counters["explicit_phrases"]:
        phrases_file = output_dir / f"{lesson_stem}_explicit_phrases.csv"
        with open(phrases_file, "w", newline="", encoding="utf-8") as f_phrases:
            writer = csv.writer(f_phrases)
            writer.writerow(["phrase", "teaching_cue", "context", "speaker_response"])
            for phrase_obj in counters["explicit_phrases"]:
                writer.writerow(
                    [
                        phrase_obj.phrase,
                        phrase_obj.teaching_cue,
                        phrase_obj.context,
                        phrase_obj.speaker_response or "",
                    ]
                )


# ----- Main Processing Function --------------------------------------------
def parse_raw_lines(raw_lines: List[str]) -> List[dict]:
    """
    Parses raw text lines into a list of speaker events, grouping consecutive
    lines from the same speaker.
    """
    speaker_events: List[dict] = []
    if not raw_lines:
        return speaker_events

    current_speaker = "Unknown"
    current_lines: List[str] = []

    for line in raw_lines:
        line = line.strip()
        if not line:
            continue

        match = re.match(r"^\\[(.*?)\\]$", line)
        if match:
            # If we have a pending speaker, add their event first
            if current_lines:
                speaker_events.append(
                    {"speaker": current_speaker, "line": " ".join(current_lines)}
                )

            # Start new speaker
            current_speaker = match.group(1)
            current_lines = []
        else:
            # Accumulate lines for the current speaker
            current_lines.append(line)

    # Add the last speaker event
    if current_lines:
        speaker_events.append(
            {"speaker": current_speaker, "line": " ".join(current_lines)}
        )

    return speaker_events


def process_lesson(file_path, output_dir, model_name):
    """Analyzes a single lesson file and saves the results to CSVs."""
    lesson_stem = file_path.stem.replace("_human_eval", "")
    transcript = file_path.read_text("utf-8")
    speaker_events = parse_raw_lines(transcript.splitlines())

    # Extract phrases using the LLM
    explicit_phrases = extract_phrases_with_llm(transcript, model_name)

    counters = {
        "breakdowns": set(),
        "explicit_phrases": explicit_phrases,
    }

    # Process for breakdowns (can still be useful)
    for event in speaker_events:
        if event["speaker"] in ["Male Speaker", "Female Speaker"]:
            line = event["line"].strip()
            # Use a looser check for potential French
            if DETECTOR.compute_language_confidence(line, LinguaLanguage.FRENCH) > 0.5:
                category = categorize_fr_line(line)
                if category == "breakdown":
                    canonical = re.sub(r"[.\\s-]", "", line).lower()
                    if len(canonical) > 1:
                        # Use a tuple to add to set
                        counters["breakdowns"].add((canonical, line))

    write_analysis_files(lesson_stem, output_dir, counters)


def main():
    """Main function to run the analysis on all lesson files."""
    script_dir = pathlib.Path(__file__).parent
    source_dir = script_dir / "pimsleur-01-lessons"
    output_dir = script_dir / "analysis_results"
    output_dir.mkdir(exist_ok=True)

    # Allow model selection via environment variable
    # Default to a standard, high-quality model
    model_name = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
    print(f"Using Mistral model: {model_name}")

    lesson_files = [
        source_dir / "French_I_-_Lesson_01_human_eval.txt",
        source_dir / "French_I_-_Lesson_02_human_eval.txt",
    ]

    # Check if files exist and provide a clear error message
    files_found = True
    for f in lesson_files:
        if not f.exists():
            print(f"File not found: {f}")
            files_found = False

    if not files_found:
        print(f"\nCould not find one or more lesson files in {source_dir}.")
        return

    for file_path in lesson_files:
        print(f"Processing {file_path.name}...")
        process_lesson(file_path, output_dir, model_name)

    print(f"\nAnalysis complete. Results are in {output_dir}")


if __name__ == "__main__":
    main()
