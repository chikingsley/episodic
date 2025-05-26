#!/bin/bash

# Directory containing the audio files
AUDIO_DIR="/Volumes/simons-enjoyment/GitHub/episodic/assets + things/french-extract/French 1 - transcribed/audio"
# Directory to save transcriptions
TRANSCRIPTIONS_DIR="$(dirname "$0")/transcriptions"

# Create transcriptions directory if it doesn't exist
mkdir -p "$TRANSCRIPTIONS_DIR"

echo "=== French Lesson Transcription Script ==="
echo "Transcriptions will be saved to: $TRANSCRIPTIONS_DIR"
echo "-------------------------------------------"

# Process each audio file from Lesson 11 to 30
for lesson in {11..30}; do
    # Format the lesson number with leading zero if needed
    lesson_num=$(printf "%02d" $lesson)
    input_file="$AUDIO_DIR/French I - Lesson $lesson_num.mp3"
    output_file="$TRANSCRIPTIONS_DIR/Lesson_${lesson_num}_transcript.txt"
    
    echo "\n=== Processing: French I - Lesson $lesson_num ==="
    echo "Input: $input_file"
    echo "Output will be saved to: $output_file"
    
    # Check if output file already exists
    if [ -f "$output_file" ]; then
        echo "WARNING: $output_file already exists."
        read -p "Do you want to overwrite it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping Lesson $lesson_num..."
            continue
        fi
    fi
    
    echo "\n=== INSTRUCTIONS ==="
    echo "1. superwhisper will open with the audio file loaded"
    echo "2. Transcribe the audio using superwhisper"
    echo "3. Save the transcription to: $output_file"
    echo "4. Return here and press Enter to continue"
    echo "=================="
    
    read -p "Press Enter to open superwhisper..."
    
    # Open the file with superwhisper
    echo "Opening file in superwhisper..."
    open "$input_file" -a superwhisper
    
    # Wait for the user to confirm the transcription is complete
    echo -e "\n=== IMPORTANT ==="
    echo "Please make sure to save your transcription to:"
    echo "$output_file"
    echo "================="
    
    read -p "Press Enter ONLY after you have saved the transcription..."
    
    # Verify if the file was saved
    if [ -f "$output_file" ]; then
        echo "Success! Transcription saved to $output_file"
    else
        echo "WARNING: Could not find the transcription at $output_file"
        read -p "Do you want to try again? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ((lesson--)) # Decrement to retry the same lesson
        fi
    fi
done

echo "\n=== Transcription Complete! ==="
echo "All transcriptions have been saved to: $TRANSCRIPTIONS_DIR"
ls -l "$TRANSCRIPTIONS_DIR"

echo "\nThank you for using the transcription script!"
