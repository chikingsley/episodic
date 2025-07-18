# Custom Dictionary

**Transcription: Batch | Real-Time | Deployments: All**

## Overview

The Custom Dictionary feature allows a list of custom words to be added for each transcription job. This helps when a specific word is not recognised during transcription. It could be that it's not in the vocabulary for that language, for example a company or person's name. Adding custom words can improve the likelihood they will be output.

The `sounds_like` feature is an extension to this to allow alternative pronunciations to be specified to aid recognition when the pronunciation is not obvious.

## Implementation

The Custom Dictionary feature can be accessed through the `additional_vocab` property.

## Important Considerations

Prior to using this feature, consider the following:

- `sounds_like` is an optional setting recommended when the pronunciation is not obvious for the word or, it can be pronounced in multiple ways; it is valid just to provide the `content` value
- `sounds_like` only works with the main script for that language
  - Japanese (ja) `sounds_like` only supports full width Hiragana or Katakana
- You can specify up to 1000 words or phrases (per job) in your Custom Dictionary

## Example Usage

```python
"transcription_config": {
  "language": "en",
  "additional_vocab": [
    {
      "content": "financial crisis"
    },
    {
      "content": "gnocchi",
      "sounds_like": [
        "nyohki",
        "nokey",
        "nochi"
      ]
    },
    {
      "content": "CEO",
      "sounds_like": [
        "C.E.O."
      ]
    }
  ]
}
```

In the above example, the words *gnocchi* and *CEO* have pronunciations applied to them; the phrase *financial crisis* does not require a pronunciation. The `content` property represents how you want the word to be output in the transcript.

## Custom Dictionary Caching

The Speechmatics Real-Time SaaS caches Custom Dictionaries to reduce session initialisation times.

You will see improvements when reusing an identical Custom Dictionary from the second time onwards. Cache entries expire when they are not used for 24 hours.

On-prem Real-Time Containers can also make use of a Shared Custom Dictionary Cache.
