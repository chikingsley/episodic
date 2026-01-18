#!/usr/bin/env python3
"""
Extracts conversations from Pimsleur lesson raw transcript files.
Uses Mistral AI to identify conversation boundaries and structure.
"""

import argparse
import json
import os
import pathlib
import re
import sys
import time
from dataclasses import dataclass

from alive_progress import alive_bar  # type: ignore
from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()

# ----- Configuration -------------------------------------------------------
MODEL_CASCADE = [
    "mistral-medium-latest",
    "mistral-large-latest",
    "magistral-medium-latest",
    "magistral-medium-latest",
    "magistral-small-latest",
    "mistral-small-latest",
]
RETRY_DELAY = 5  # seconds

# ----- API Setup -----------------------------------------------------------
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("MISTRAL_API_KEY not found.")
    print("Please create a .env file in the 'pimsleur-data' directory and add your key:")
    print('MISTRAL_API_KEY="your_mistral_api_key"')
    sys.exit(1)

MISTRAL_CLIENT = Mistral(api_key=MISTRAL_API_KEY)


# ----- Data Structures -----------------------------------------------------
@dataclass
class RawUtterance:
    """Represents a single utterance from raw transcript."""

    position: int
    speaker: str
    text: str


@dataclass
class Conversation:
    """Represents a conversation extracted from utterances."""

    conversation_id: int
    start_position: int
    end_position: int
    utterances: list[tuple[str, str]]  # List of (speaker, text) tuples


# ----- Raw Transcript Reading ----------------------------------------------
def parse_raw_transcript(file_path: pathlib.Path) -> list[RawUtterance]:
    """Parse raw transcript file into utterances."""
    utterances = []

    with open(file_path, encoding="utf-8") as f:
        content = f.read()

    # Split into sections by speaker tags
    lines = content.strip().split("\n")
    current_speaker = None
    current_text_lines = []
    position = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for speaker tag
        speaker_match = re.match(r"^\[(.*?)\]$", line)

        if speaker_match:
            # Save previous utterance if it exists
            if current_speaker and current_text_lines:
                text = " ".join(current_text_lines).strip()
                if text:
                    position += 1
                    utterances.append(
                        RawUtterance(position=position, speaker=current_speaker, text=text)
                    )

            # Start new speaker
            current_speaker = speaker_match.group(1)
            current_text_lines = []
        else:
            # Add to current text
            if current_speaker:
                current_text_lines.append(line)

    # Don't forget the last utterance
    if current_speaker and current_text_lines:
        text = " ".join(current_text_lines).strip()
        if text:
            position += 1
            utterances.append(RawUtterance(position=position, speaker=current_speaker, text=text))

    return utterances


# ----- Conversation Processing ---------------------------------------------
def extract_conversations_with_llm(
    utterances: list[RawUtterance], lesson_number: int, model_name: str
) -> list[Conversation]:
    """Extract conversations from raw utterances using LLM."""

    # Filter to only Male and Female Speaker utterances
    conversation_utterances = [
        utt for utt in utterances if utt.speaker in ["Male Speaker", "Female Speaker"]
    ]

    # Create transcript-like text for LLM
    transcript_text = ""
    for utt in conversation_utterances:
        transcript_text += f"[{utt.speaker}]\n{utt.text}\n\n"

    system_prompt = """
You are analyzing a Pimsleur French lesson transcript to identify natural conversations.

A conversation is defined as:
1. A natural back-and-forth exchange between Male Speaker and Female Speaker
2. Should feel like a coherent dialogue or interaction
3. Stops when there's a clear break in the conversational flow
4. Ignore repetitive practice sections (where speakers repeat the same phrase multiple times)

For each conversation found, provide:
- start_text: The exact text of the first utterance in the conversation
- end_text: The exact text of the last utterance in the conversation
- utterances: list of [speaker, text] pairs in the conversation

Return JSON with key "conversations" containing a list of conversation objects.
"""

    user_prompt = f"""Analyze this French lesson transcript and identify conversations:

{transcript_text}

Focus on natural dialogue exchanges, not repetitive practice sections."""

    try:
        response = MISTRAL_CLIENT.chat.complete(
            model=model_name,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.0,
        )

        data = json.loads(response.choices[0].message.content)
        conversations_data = data.get("conversations", [])

        # Convert to Conversation objects and find positions
        conversations = []
        for conv_data in conversations_data:
            conv_utterances = conv_data.get("utterances", [])
            if not conv_utterances:
                continue

            # Find start and end positions by matching text
            start_text = conv_data.get(
                "start_text", conv_utterances[0][1] if conv_utterances else ""
            )
            end_text = conv_data.get("end_text", conv_utterances[-1][1] if conv_utterances else "")

            start_pos = None
            end_pos = None

            for utt in conversation_utterances:
                if start_pos is None and start_text.strip() in utt.text.strip():
                    start_pos = utt.position
                if end_text.strip() in utt.text.strip():
                    end_pos = utt.position

            if start_pos and end_pos:
                conversations.append(
                    Conversation(
                        conversation_id=0,  # Will be set later
                        start_position=start_pos,
                        end_position=end_pos,
                        utterances=[(utt[0], utt[1]) for utt in conv_utterances],
                    )
                )

        return conversations

    except Exception as e:
        print(f"\n⚠️  Error processing with {model_name}: {str(e)[:100]}")
        return []


# ----- Markdown Generation -------------------------------------------------
def write_conversations_markdown(
    conversations: list[Conversation], lesson_number: int, output_path: pathlib.Path
):
    """Write conversations to markdown file."""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Lesson {lesson_number} - Conversations\n\n")

        for i, conv in enumerate(conversations, 1):
            f.write(f"## Conversation {i}\n\n")
            f.write(f"*Positions {conv.start_position}-{conv.end_position}*\n\n")

            for speaker, text in conv.utterances:
                f.write(f"[{speaker}]\n")
                f.write(f"{text}\n\n")

            f.write("---\n\n")


# ----- Main Processing Function --------------------------------------------
def process_lesson(transcript_path: pathlib.Path, output_dir: pathlib.Path):
    """Process a lesson transcript file to extract conversations."""

    # Extract lesson number from filename
    lesson_number = int(transcript_path.stem.split("_")[4])

    print(f"\n📖 Processing Lesson {lesson_number}")

    # Read and parse transcript
    utterances = parse_raw_transcript(transcript_path)
    print(f"📊 Total utterances: {len(utterances)}")

    # Filter to conversation speakers
    conversation_utterances = [
        utt for utt in utterances if utt.speaker in ["Male Speaker", "Female Speaker"]
    ]
    print(f"💬 Male/Female Speaker utterances: {len(conversation_utterances)}")

    # Extract conversations using LLM with retry cascade
    conversations = []

    print("🎯 Extracting conversations...")

    for attempt, model_to_try in enumerate(MODEL_CASCADE):
        print(f"   Trying {model_to_try}...")

        conversations = extract_conversations_with_llm(utterances, lesson_number, model_to_try)

        if conversations:
            print(f"   ✅ Success with {model_to_try}")
            break
        else:
            if attempt < len(MODEL_CASCADE) - 1:
                next_model = MODEL_CASCADE[attempt + 1]
                print(f"   🔁 Failed with {model_to_try}. Retrying with {next_model}...")
                time.sleep(RETRY_DELAY)
            else:
                print("   ❌ All models failed")

    # Assign conversation IDs
    for i, conv in enumerate(conversations, 1):
        conv.conversation_id = i

    # Write to markdown
    output_path = output_dir / f"lesson_{lesson_number:02d}_conversations.md"
    write_conversations_markdown(conversations, lesson_number, output_path)

    print(f"\n✅ Found {len(conversations)} conversations")
    print(f"💾 Saved to: {output_path}")

    return len(conversations)


# ----- Main Function -------------------------------------------------------
def main():
    """Main function with argument parsing."""
    parser = argparse.ArgumentParser(
        description="Extract conversations from Pimsleur lesson raw transcript files"
    )
    parser.add_argument(
        "--input",
        type=str,
        help="Input transcript file path",
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        type=int,
        help="Lesson numbers to process (e.g., --lessons 1 2 3 or --lessons 1-5)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="analysis",
        help="Output directory for markdown files (default: analysis)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all lesson transcript files",
    )

    args = parser.parse_args()

    project_root = pathlib.Path(__file__).parent.parent
    transcript_dir = project_root / "01_raw_data" / "transcripts"
    output_dir = project_root / "02_scripts" / args.output_dir

    # Create output directory if needed
    output_dir.mkdir(exist_ok=True)

    # Determine which files to process
    files_to_process = []

    if args.all:
        files_to_process = sorted(transcript_dir.glob("French_I_-_Lesson_*_human_eval.txt"))
    elif args.lessons:
        for lesson_num in args.lessons:
            input_path = transcript_dir / f"French_I_-_Lesson_{lesson_num:02d}_human_eval.txt"
            if input_path.exists():
                files_to_process.append(input_path)
            else:
                print(f"⚠️  File not found: {input_path}")
    elif args.input:
        input_path = pathlib.Path(args.input)
        if not input_path.is_absolute():
            input_path = project_root / input_path
        if not input_path.exists():
            print(f"❌ File not found: {input_path}")
            return
        files_to_process = [input_path]
    else:
        # Default to lesson 1
        input_path = transcript_dir / "French_I_-_Lesson_01_human_eval.txt"
        if not input_path.exists():
            print(f"❌ File not found: {input_path}")
            return
        files_to_process = [input_path]

    print("🚀 Extracting Conversations from Raw Transcripts")
    print("=" * 60)
    print(f"📖 Using model cascade: {', '.join(MODEL_CASCADE)}")
    print(f"📁 Transcript directory: {transcript_dir}")
    print(f"💾 Output directory: {output_dir}")
    print("=" * 60)

    # Process each file
    total_conversations = 0

    if len(files_to_process) > 1:
        # Use progress bar for multiple files
        with alive_bar(
            len(files_to_process),
            title="📚 Processing lessons",
            spinner="waves",
            dual_line=True,
            length=40,
            force_tty=True,
        ) as bar:
            for transcript_path in files_to_process:
                lesson_num = int(transcript_path.stem.split("_")[4])
                bar.text = f"📖 Lesson {lesson_num}"
                count = process_lesson(transcript_path, output_dir)
                total_conversations += count
                bar()
    else:
        # Single file, no progress bar needed
        for transcript_path in files_to_process:
            count = process_lesson(transcript_path, output_dir)
            total_conversations += count

    # Final summary
    print(f"\n{'=' * 60}")
    print("🎉 All lessons complete!")
    print(f"💬 Total conversations extracted: {total_conversations}")
    print(f"📁 Markdown files saved to: {output_dir}")
    print("=" * 60)


if __name__ == "__main__":
    main()
