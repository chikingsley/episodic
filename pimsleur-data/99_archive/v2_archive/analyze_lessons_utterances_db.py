#!/usr/bin/env python3
"""
Analyzes Pimsleur lesson transcripts and writes directly to Supabase database.
Production version that replaces CSV outputs with direct database operations.
"""

import os
import json
import pathlib
import sys
import time
from typing import List

from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import spacy

# Import our database writer
sys.path.append(str(pathlib.Path(__file__).parent.parent))
from db.database_writer import DatabaseWriter, UtteranceRecord

load_dotenv()

# ----- NLP and API Setup ---------------------------------------------------
try:
    NLP = spacy.load("fr_core_news_sm")
except OSError:
    print("Spacy French model 'fr_core_news_sm' not found.")
    print("Please run: poetry run python -m spacy download fr_core_news_sm")
    sys.exit(1)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("MISTRAL_API_KEY not found.")
    print("Please create a .env file in the 'pimsleur-data' directory and add your key:")
    print('MISTRAL_API_KEY="your_mistral_api_key"')
    sys.exit(1)

MISTRAL_CLIENT = MistralClient(api_key=MISTRAL_API_KEY, timeout=300)

# ----- LLM-based Utterance Analysis ----------------------------------------
def analyze_transcript_with_llm(
    transcript: str, model_name: str, lesson_number: int
) -> List[UtteranceRecord]:
    """
    Uses a Mistral model to analyze and categorize every student utterance.
    Returns UtteranceRecord objects ready for database insertion.
    """
    system_prompt = """
You are an expert in linguistics and pedagogy, specifically focused on language acquisition methods like Pimsleur. Your task is to analyze a Pimsleur lesson transcript and categorize every French utterance made by a student (Male Speaker or Female Speaker).

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

Return your findings as a JSON object with a single key "analyzed_utterances", which contains a list of objects. Each object represents one analyzed student utterance.
"""
    user_prompt = f"Here is the transcript:\n```\n{transcript}\n```\nPlease analyze every French utterance from the 'Male Speaker' and 'Female Speaker' and return the results in the specified JSON format."

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = MISTRAL_CLIENT.chat(
                model=model_name,
                response_format={"type": "json_object"},
                messages=[
                    ChatMessage(role="system", content=system_prompt),
                    ChatMessage(role="user", content=user_prompt),
                ],
                temperature=0.0,
            )
            response_content = response.choices[0].message.content
            data = json.loads(response_content)
            
            # Convert to UtteranceRecord objects
            utterances = []
            for idx, item in enumerate(data.get("analyzed_utterances", []), 1):
                utterances.append(
                    UtteranceRecord(
                        lesson_number=lesson_number,
                        position_in_lesson=idx,
                        speaker=item["speaker"],
                        text=item["utterance_text"],
                        utterance_type=item.get("utterance_type"),
                        narrator_cue=item.get("narrator_cue", ""),
                        core_lemmas=" ".join(item.get("core_lemmas", []))
                    )
                )
            return utterances

        except Exception as e:
            if "ReadTimeout" in str(e) and attempt < max_retries - 1:
                print(
                    f"ReadTimeout occurred. Retrying in 5 seconds... (Attempt {attempt + 1}/{max_retries})"
                )
                time.sleep(5)
                continue
            else:
                print(f"An error occurred while calling the Mistral API: {e}")
                return []
    return []

# ----- Main Processing Function --------------------------------------------
def process_lesson_to_db(file_path, model_name):
    """Analyzes a single lesson file and writes results directly to database."""
    print(f"Analyzing {file_path.name} with model {model_name}...")
    
    # Extract lesson number from filename (e.g., "French_I_-_Lesson_05_human_eval" -> 5)
    lesson_number = int(file_path.stem.split("_")[4])
    
    transcript = file_path.read_text("utf-8")

    # Extract utterances using the LLM
    analyzed_utterances = analyze_transcript_with_llm(transcript, model_name, lesson_number)

    if not analyzed_utterances:
        print(f"No utterances were analyzed for {file_path.name}")
        return 0
    
    # Write directly to database
    with DatabaseWriter() as db:
        count = db.write_utterances(analyzed_utterances)
    
    print(f"✅ Finished processing {file_path.name}. Wrote {count} utterances to database.")
    return count

def main():
    """Main function to run the analysis on all lesson files."""
    # Use project structure paths
    project_root = pathlib.Path(__file__).parent.parent.parent
    source_dir = project_root / "01_raw_data" / "transcripts"

    # Allow model selection via environment variable
    model_name = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
    print(f"Using Mistral model: {model_name}")

    # Process lessons 1-5 for production
    lesson_files = [
        source_dir / f"French_I_-_Lesson_{i:02d}_human_eval.txt"
        for i in range(1, 6)
    ]

    # Check if files exist
    files_found = True
    for f in lesson_files:
        if not f.exists():
            print(f"File not found: {f}")
            files_found = False

    if not files_found:
        print(f"\nCould not find one or more lesson files in {source_dir}.")
        return

    total_utterances = 0
    
    print("🚀 Starting production database pipeline...")
    print("=" * 50)
    
    for file_path in lesson_files:
        count = process_lesson_to_db(file_path, model_name)
        total_utterances += count

    print("\n" + "=" * 50)
    print(f"✅ Production pipeline complete!")
    print(f"📊 Total utterances processed: {total_utterances}")
    print("🗄️  All data written directly to Supabase database")

if __name__ == "__main__":
    main()