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
import argparse

from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from alive_progress import alive_bar  # type: ignore

# Import our database writer
sys.path.append(str(pathlib.Path(__file__).parent.parent))
from db.database_writer import DatabaseWriter, PhraseRecord  # type: ignore

load_dotenv()

# ----- Configuration -------------------------------------------------------
MODEL_CASCADE = [
    "mistral-medium-latest",
    "mistral-large-latest",
    "magistral-medium-latest",
    "magistral-medium-latest",  # Re-trying can be effective
    "magistral-small-latest",
    "mistral-small-latest",
]
RETRY_DELAY = 5  # seconds

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
def extract_phrases_with_llm(transcript: str, lesson_number: int) -> List[PhraseRecord]:
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

    for attempt, model_to_try in enumerate(MODEL_CASCADE):
        try:
            print(f"\nAttempting lesson {lesson_number} with {model_to_try}...")
            response = MISTRAL_CLIENT.chat(
                model=model_to_try,
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
            if attempt < len(MODEL_CASCADE) - 1:
                next_model = MODEL_CASCADE[attempt + 1]
                print(
                    f"\n⚠️ Model {model_to_try} failed for lesson {lesson_number}. Retrying with {next_model}..."
                )
                time.sleep(RETRY_DELAY)
            else:
                print(
                    f"\n❌ All models in cascade failed for lesson {lesson_number}: {e}"
                )
                return []
    return []


# ----- Main Processing Function --------------------------------------------
def process_lesson_phrases_to_db(file_path: pathlib.Path) -> int:
    """Extracts phrases from a lesson file and writes results directly to database."""
    lesson_number = int(file_path.stem.split("_")[4])
    transcript = file_path.read_text("utf-8")

    # Extract phrases using the LLM
    extracted_phrases = extract_phrases_with_llm(transcript, lesson_number)

    if not extracted_phrases:
        print(f"\n⚠️ No phrases were extracted from {file_path.name}")
        return 0

    # Write directly to database
    with DatabaseWriter() as db:
        # TODO: Implement clearing of existing phrases for the lesson if needed
        count = db.write_phrases(extracted_phrases)

    return count


def main():
    """Main function to run phrase extraction on all lesson files."""
    parser = argparse.ArgumentParser(
        description="Pimsleur Phrase Extraction V2 - Direct to DB"
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        type=int,
        default=list(range(1, 6)),
        help="Lesson numbers to process (default: 1-5)",
    )
    args = parser.parse_args()

    # Use project structure paths
    project_root = pathlib.Path(__file__).parent.parent.parent
    source_dir = project_root / "01_raw_data" / "transcripts"

    print("🚀 Pimsleur Phrase Extraction V2")
    print("=" * 60)
    print(f"📖 Using model cascade: {', '.join(MODEL_CASCADE)}")
    print(f"📚 Lessons to process: {args.lessons}")
    print("=" * 60)

    lesson_files = [
        source_dir / f"French_I_-_Lesson_{i:02d}_human_eval.txt" for i in args.lessons
    ]

    # Check if files exist
    files_found = True
    for f in lesson_files:
        if not f.exists():
            print(f"File not found: {f}")
            files_found = False

    if not files_found:
        print(f"\nCould not find one or more lesson files in {source_dir}")
        return

    total_phrases = 0

    with alive_bar(
        len(lesson_files), title="🚀 Extracting Phrases", force_tty=True
    ) as bar:
        for file_path in lesson_files:
            count = process_lesson_phrases_to_db(file_path)
            total_phrases += count
            bar.text = f"✅ Finished {file_path.name}"
            bar()

    print("\n" + "=" * 60)
    print("🎉 Phrase extraction pipeline complete!")
    print(f"📊 Total phrases processed: {total_phrases}")
    print("🗄️  All data written directly to Supabase database")


if __name__ == "__main__":
    main()
