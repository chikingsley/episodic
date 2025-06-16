"""
Analyzes Pimsleur lesson transcripts to extract linguistic data.

This script uses the Groq API to perform a detailed analysis of each French
utterance in a Pimsleur lesson. It processes each lesson transcript in
isolation, categorizing every student utterance by its pedagogical function
and extracting other key metadata.

The goal is to produce a high-quality, structured dataset for each lesson,
which can then be used for cross-lesson progression and novelty analysis.
"""

import csv
import os
import json
import pathlib
import sys
from dataclasses import dataclass, fields
from typing import List

from dotenv import load_dotenv
from groq import Groq
import spacy

load_dotenv()


# ----- NLP and API Setup ---------------------------------------------------
try:
    NLP = spacy.load("fr_core_news_sm")
except OSError:
    print("Spacy French model 'fr_core_news_sm' not found.")
    print("Please run: poetry run python -m spacy download fr_core_news_sm")
    sys.exit(1)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("GROQ_API_KEY not found.")
    print(
        "Please create a .env file in the 'pimsleur-data' directory and add your key:"
    )
    print('GROQ_API_KEY="your_groq_api_key"')
    sys.exit(1)

GROQ_CLIENT = Groq(api_key=GROQ_API_KEY)


# ----- Data Structures -----------------------------------------------------
@dataclass
class AnalyzedUtterance:
    """Represents a single, analyzed French utterance from a speaker."""

    utterance_text: str
    speaker: str
    utterance_type: str
    narrator_cue: str
    core_lemmas: List[str]


# ----- LLM-based Utterance Analysis ----------------------------------------
def analyze_transcript_with_llm(
    transcript: str, model_name: str
) -> List[AnalyzedUtterance]:
    """
    Uses a Groq model to analyze and categorize every student utterance.
    """
    system_prompt = """
You are an expert in linguistics and pedagogy, specifically focused on language acquisition methods like Pimsleur. Your task is to analyze a Pimsleur lesson transcript and categorize every French utterance made by a student (Male Speaker or Female Speaker). Your response MUST be a valid JSON object.

Analyze the provided transcript and for EACH student utterance, provide the following information in a structured JSON format:

1.  `utterance_text`: The verbatim French phrase spoken by the student.
2.  `speaker`: The speaker of the phrase ('Male Speaker' or 'Female Speaker').
3.  `utterance_type`: The pedagogical function of the utterance. This must be one of the following categories:
    -   `DirectRepetition`: The student is repeating a phrase just provided by the narrator (e.g., after "Listen and repeat...").
    -   `PromptedRecall`: The student is responding to a direct question or prompt from the narrator (e.g., "Say 'I don't know'").
    -   `ConversationalExchange`: The student's line is part of a simulated dialogue with another speaker, and is NOT an immediate response to a narrator's cue in the preceding turn.
    -   `SimpleResponse`: A short, common conversational phrase like "Oui, Monsieur," "Non, merci," or "D'accord."
4.  `narrator_cue`: The specific text of the narrator's line that prompted the student's utterance. If there is no direct narrator cue for the utterance, this should be an empty string.
5.  `core_lemmas`: A list of the lowercased base forms (lemmas) of the main words in the utterance. For example, for "Je ne comprends pas", the lemmas would be ["je", "ne", "comprendre", "pas"].

**IMPORTANT**: Analyze the lesson in complete isolation. Do not make assumptions about what was learned in previous lessons. Your analysis should be based solely on the context provided in this single transcript.

Return your findings as a JSON object with a single key "analyzed_utterances", which contains a list of objects. Each object represents one analyzed student utterance. Do not include any text outside of the JSON object itself.
"""
    user_prompt = f"Here is the transcript:\n```\n{transcript}\n```\nPlease analyze every French utterance from the 'Male Speaker' and 'Female Speaker' and return the results in the specified JSON format."

    try:
        chat_completion = GROQ_CLIENT.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model=model_name,
            temperature=0.0,
            response_format={"type": "json_object"},
            max_tokens=8000,
        )
        response_content = chat_completion.choices[0].message.content
        if not response_content:
            print("Groq API returned an empty response.")
            return []
        data = json.loads(response_content)
        return [
            AnalyzedUtterance(**item) for item in data.get("analyzed_utterances", [])
        ]

    except Exception as e:
        print(f"An error occurred while calling the Groq API: {e}")
        if "response_content" in locals() and response_content:
            print("--- Groq API Raw Response ---")
            print(response_content)
            print("-----------------------------")
        return []


# ----- File I/O Functions ----------------------------------------------------
def write_analysis_file(lesson_stem, output_dir, utterances: List[AnalyzedUtterance]):
    """Dumps the list of analyzed utterances to a CSV file."""
    if not utterances:
        print(f"No utterances were analyzed for {lesson_stem}. Skipping file write.")
        return

    output_file = output_dir / f"{lesson_stem}_utterance_analysis.csv"
    header = [f.name for f in fields(AnalyzedUtterance)]

    with open(output_file, "w", newline="", encoding="utf-8") as f_out:
        writer = csv.writer(f_out)
        writer.writerow(header)
        for utterance in utterances:
            # The 'core_lemmas' field is a list, so we'll join it into a
            # space-separated string for the CSV.
            row = [
                utterance.utterance_text,
                utterance.speaker,
                utterance.utterance_type,
                utterance.narrator_cue,
                " ".join(utterance.core_lemmas),
            ]
            writer.writerow(row)


# ----- Main Processing Function --------------------------------------------
def process_lesson(file_path, output_dir, model_name):
    """Analyzes a single lesson file and saves the results to a CSV."""
    print(f"Analyzing {file_path.name} with model {model_name}...")
    lesson_stem = file_path.stem.replace("_human_eval", "")
    transcript = file_path.read_text("utf-8")

    # Extract utterances using the LLM
    analyzed_utterances = analyze_transcript_with_llm(transcript, model_name)

    # Write the results to a single, comprehensive file
    write_analysis_file(lesson_stem, output_dir, analyzed_utterances)
    print(
        f"Finished processing {file_path.name}. Found {len(analyzed_utterances)} utterances."
    )


def main():
    """Main function to run the analysis on all lesson files."""
    script_dir = pathlib.Path(__file__).parent
    source_dir = script_dir / "pimsleur-01-lessons"
    output_dir = script_dir / "analysis_results_v2_groq"
    output_dir.mkdir(exist_ok=True)

    # Allow model selection via environment variable from GROQ_MODEL
    model_name = os.getenv("GROQ_MODEL", "llama3-70b-8192")
    print(f"Using Groq model: {model_name}")

    # For testing, let's just process the first lesson.
    lesson_files = [
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
        process_lesson(file_path, output_dir, model_name)

    print(f"\nAnalysis complete. Results are in {output_dir}")


if __name__ == "__main__":
    main()
