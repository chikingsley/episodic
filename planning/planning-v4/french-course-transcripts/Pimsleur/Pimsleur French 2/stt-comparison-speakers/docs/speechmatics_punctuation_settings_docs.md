# Punctuation Settings

**Transcription: Batch | Real-Time | Deployments: All**

## Overview

All Speechmatics language packs support punctuation settings to improve the readability of your transcripts.

## Supported Punctuation

The following punctuation marks are supported for each language:

| Language(s) | Supported Punctuation | End of Sentence (EOS) | Comment |
|-------------|----------------------|----------------------|---------|
| Cantonese, Mandarin | ， 。 ？ ！ 、 | 。 ？ ！ | Full-width punctuation supported |
| Japanese | 。 、 | 。 | Full-width punctuation supported |
| Hindi | । ? , ! | । ? ! | |
| All Other Languages | . , ! ? | . ! ? | |

## Configuration

If you do not want to see any of the supported punctuation marks in the output, then you can explicitly control this through the `punctuation_overrides` settings. You can also optionally change the amount of punctuation by setting the `sensitivity` to a value between 0 and 1. Higher values will produce more punctuation. The default is 0.5.

### Example Usage

```python
"transcription_config": {
   "language": "en",
   "punctuation_overrides": {
      "permitted_marks":[ ".", "," ],
      "sensitivity": 0.4
   }
}
```

This will exclude exclamation and question marks from the returned transcript and reduce the chance of punctuation.

## Output Format Support

All Speechmatics output formats support advanced punctuation. JSON output places punctuation marks in the results list marked with a `type` of `"punctuation"`.

## Important Note

> **Info**: Disabling punctuation may slightly harm the accuracy of Speaker Diarization. Please see the Speaker Diarization and Punctuation section in the docs for more information.
