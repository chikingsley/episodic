# TTS Audition Record

## Decision

- **Immediate local placeholder:** OmniVoice.
- **First hosted production candidate:** Voxtral TTS API.
- **Final decision:** blind native-French comparison on the same ten lines.

## OmniVoice Local Check

- Model: `k2-fsa/OmniVoice`
- Checkpoint size downloaded: about 3.27 GB
- Model size: 0.6B parameters
- Hardware: RTX 5070 12 GB
- Generated sample: 5.56 seconds, mono 24 kHz WAV
- Qwen3-ASR transcription:

  > Bonjour monsieur, je comprends un peu l'anglais, mais parlez lentement s'il
  > vous plaît.

This exactly recovers the intended words apart from punctuation, so the sample
passes the first intelligibility gate.

The voice-design interface rejected freeform acting direction and accepted only
fixed attributes such as `female`, `middle-aged`, and `moderate pitch`. Acting,
rhythm, and native accent still require human judgment.

The pretrained weights are CC BY-NC. Keep the output in ignored local prototype
storage.

## Voxtral Hosted Check

Mistral documents French support, short reference-audio conditioning, streaming,
and hosted pricing at $16 per million characters. The hosted API is the more
practical production candidate because it avoids maintaining a local serving
stack and accepts voice performance through a reference clip.

An exact sample is pending `MISTRAL_API_KEY`. Save it as:

`public/audio/generated/voxtral-concierge-audition.wav`

Official references:

- https://docs.mistral.ai/studio-api/audio/text_to_speech
- https://docs.mistral.ai/models/model-cards/voxtral-tts-26-03
- https://huggingface.co/k2-fsa/OmniVoice

## Native Review Form

Score each take from 1 to 5:

| Criterion | OmniVoice | Voxtral | Notes |
| --- | ---: | ---: | --- |
| French pronunciation and liaison |  |  |  |
| Natural rhythm |  |  |  |
| Character age |  |  |  |
| Guarded emotional restraint |  |  |  |
| Consistency across ten lines |  |  |  |
| Overall preference |  |  |  |
