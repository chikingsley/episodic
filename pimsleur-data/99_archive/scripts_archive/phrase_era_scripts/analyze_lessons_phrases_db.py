#!/usr/bin/env python3
"""
Extracts French phrases from Pimsleur lesson transcripts and writes directly to Supabase database.
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

# Import our database writer
sys.path.append(str(pathlib.Path(__file__).parent.parent))
from db.database_writer import DatabaseWriter, PhraseRecord  # type: ignore

load_dotenv()

# ----- API Setup -----------------------------------------------------------
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("MISTRAL_API_KEY not found.")
    print(
        "Please create a .env file in the 'pimsleur-data' directory and add your key:"
    )
    print('MISTRAL_API_KEY="your_mistral_api_key"')
    sys.exit(1)

MISTRAL_CLIENT = MistralClient(api_key=MISTRAL_API_KEY, timeout=300)


# ----- LLM-based Phrase Extraction -----------------------------------------
def extract_phrases_with_llm(
    transcript: str, model_name: str, lesson_number: int
) -> List[PhraseRecord]:
    """
    Uses a Mistral model to extract French phrases and teaching patterns.
    Returns PhraseRecord objects ready for database insertion.
    """
    system_prompt = """
You are an expert linguist analyzing Pimsleur French language lessons. Your task is to extract and categorize every distinct French phrase that is explicitly taught or practiced in the lesson.

Analyze the provided transcript and extract:

1. **Core Teaching Phrases**: French phrases that the narrator explicitly introduces, explains, or asks students to practice
2. **Conversational Exchanges**: French phrases used in dialogue scenarios between speakers
3. **Instructional Responses**: French phrases that students are prompted to say in response to specific cues

For EACH extracted phrase, provide:

1. `phrase`: The exact French phrase (clean, without extra punctuation)
2. `speaker_response`: Who typically says this phrase ('Male Speaker', 'Female Speaker', 'Narrator', or 'Any')
3. `context`: The pedagogical context ('Introduction', 'Practice', 'Dialogue', 'Review', 'Question-Response')
4. `teaching_cue`: The specific narrator instruction that introduces this phrase (if any)

**IMPORTANT GUIDELINES**:
- Extract complete meaningful phrases, not individual words
- Focus on phrases that students are expected to learn and use
- Include variations of the same concept (e.g., "Je comprends" and "Je ne comprends pas")
- Exclude purely instructional English text
- Analyze this lesson in isolation - don't assume knowledge from other lessons

Return your findings as a JSON object with a single key "extracted_phrases", containing a list of objects for each phrase.
"""

    user_prompt = f"Analyze this Pimsleur French lesson transcript and extract all French phrases being taught:\n\n```\n{transcript}\n```"

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

            # Convert to PhraseRecord objects
            phrases = []
            for idx, item in enumerate(data.get("extracted_phrases", []), 1):
                phrases.append(
                    PhraseRecord(
                        text=item["phrase"],
                        lesson_number=lesson_number,
                        position_in_lesson=idx,
                        speaker_response=item.get("speaker_response"),
                        context=item.get("context"),
                        teaching_cue=item.get("teaching_cue", ""),
                    )
                )
            return phrases

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
def process_lesson_phrases_to_db(file_path, model_name):
    """Extracts phrases from a lesson file and writes results directly to database."""
    print(f"Extracting phrases from {file_path.name} with model {model_name}...")

    # Extract lesson number from filename
    lesson_number = int(file_path.stem.split("_")[4])

    transcript = file_path.read_text("utf-8")

    # Extract phrases using the LLM
    extracted_phrases = extract_phrases_with_llm(transcript, model_name, lesson_number)

    if not extracted_phrases:
        print(f"No phrases were extracted from {file_path.name}")
        return 0

    # Write directly to database
    with DatabaseWriter() as db:
        count = db.write_phrases(extracted_phrases)

    print(f"✅ Finished processing {file_path.name}. Processed {count} phrases.")
    return count


def main():
    """Main function to run phrase extraction on all lesson files."""
    # Use project structure paths
    project_root = pathlib.Path(__file__).parent.parent.parent
    source_dir = project_root / "01_raw_data" / "transcripts"

    # Allow model selection via environment variable
    model_name = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
    print(f"Using Mistral model: {model_name}")

    # Process lessons 1-5 for production
    lesson_files = [
        source_dir / f"French_I_-_Lesson_{i:02d}_human_eval.txt" for i in range(1, 6)
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

    total_phrases = 0

    print("🚀 Starting phrase extraction pipeline...")
    print("=" * 50)

    for file_path in lesson_files:
        count = process_lesson_phrases_to_db(file_path, model_name)
        total_phrases += count

    print("\n" + "=" * 50)
    print("✅ Phrase extraction pipeline complete!")
    print(f"📊 Total phrases processed: {total_phrases}")
    print("🗄️  All data written directly to Supabase database")


if __name__ == "__main__":
    main()
