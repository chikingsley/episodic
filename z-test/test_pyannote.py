import os
from pyannote.audio import Pipeline
import torch

print("Starting pyannote.audio test script...")

# This script tests the pyannote/speaker-diarization-3.1 pipeline.
# For this to work, you need to:
# 1. Visit hf.co/pyannote/speaker-diarization-3.1 to accept user conditions.
# 2. Log in to Hugging Face CLI using `huggingface-cli login` or
#    set the HUGGING_FACE_HUB_TOKEN environment variable with your token.

try:
    print("Loading 'pyannote/speaker-diarization-3.1' pipeline...")
    # `from_pretrained` will automatically use the token from the environment
    # or the one set via `huggingface-cli login`.
    pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")
    print("Pipeline loaded successfully.")

    # Use GPU if available, otherwise CPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("Using CUDA (GPU) for processing.")
    elif torch.backends.mps.is_available():
        # This is for Apple Silicon
        device = torch.device("mps")
        print("Using MPS (Apple Silicon GPU) for processing.")
    else:
        device = torch.device("cpu")
        print("Using CPU for processing.")

    pipeline.to(device)

    audio_file_path = (
        "/Volumes/simons-enjoyment/GitHub/episodic/z-test/french-i-lesson-01.mp3"
    )

    if not os.path.exists(audio_file_path):
        print(f"ERROR: Audio file not found at '{audio_file_path}'")
        exit()

    print(f"Starting speaker diarization on '{audio_file_path}'...")

    # Run inference on the entire audio file
    diarization = pipeline(audio_file_path)

    # Print the diarization results
    print("Inference complete. Diarization result:")
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        print(f"start={turn.start:.2f}s end={turn.end:.2f}s speaker_{speaker}")

    print("\nTest script finished successfully.")

except Exception as e:
    print(f"\nAn error occurred: {e}")
    print("\nPlease make sure you have:")
    print(
        "1. Accepted the user conditions on the model page: https://huggingface.co/pyannote/speaker-diarization-3.1"
    )
    print(
        "2. Logged in with `huggingface-cli login` or set the HUGGING_FACE_HUB_TOKEN environment variable."
    )
