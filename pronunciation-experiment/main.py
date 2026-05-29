"""Pronunciation assessment prototype using Qwen3-ASR + ForcedAligner."""

import difflib

import gradio as gr
import numpy as np
import torch

# Lazy-loaded globals
asr_model = None
aligner_model = None


def load_models():
    """Load ASR and ForcedAligner models on first use."""
    global asr_model, aligner_model
    from qwen_asr import Qwen3ASRModel, Qwen3ForcedAligner

    if asr_model is None:
        print("Loading Qwen3-ASR-0.6B...")
        asr_model = Qwen3ASRModel.from_pretrained(
            "Qwen/Qwen3-ASR-0.6B",
            dtype=torch.bfloat16,
            device_map="cuda:0",
            max_new_tokens=256,
        )
        print("ASR model loaded.")

    if aligner_model is None:
        print("Loading Qwen3-ForcedAligner-0.6B...")
        aligner_model = Qwen3ForcedAligner.from_pretrained(
            "Qwen/Qwen3-ForcedAligner-0.6B",
            dtype=torch.bfloat16,
            device_map="cuda:0",
        )
        print("Aligner model loaded.")


def phonemize_text(text: str, lang: str = "fr-fr") -> str:
    """Convert text to phonemes using phonemizer/espeak."""
    from phonemizer import phonemize
    from phonemizer.separator import Separator

    return phonemize(
        text,
        language=lang,
        backend="espeak",
        separator=Separator(phone=" ", word="  ", syllable=""),
        strip=True,
    )


def word_scores(expected: str, actual: str) -> list[dict]:
    """Compare expected vs actual words, return per-word scores."""
    expected_words = expected.lower().strip().split()
    actual_words = actual.lower().strip().split()

    matcher = difflib.SequenceMatcher(None, expected_words, actual_words)
    results = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            for w in expected_words[i1:i2]:
                results.append({"word": w, "status": "correct", "score": 1.0})
        elif tag == "replace":
            for k, w in enumerate(expected_words[i1:i2]):
                actual_w = actual_words[j1 + k] if (j1 + k) < j2 else "?"
                # Partial credit via character-level similarity
                ratio = difflib.SequenceMatcher(None, w, actual_w).ratio()
                results.append(
                    {
                        "word": w,
                        "status": "wrong",
                        "actual": actual_w,
                        "score": ratio,
                    }
                )
        elif tag == "delete":
            for w in expected_words[i1:i2]:
                results.append({"word": w, "status": "missing", "score": 0.0})
        elif tag == "insert":
            for w in actual_words[j1:j2]:
                results.append({"word": w, "status": "extra", "score": 0.5})

    return results


def assess_pronunciation(
    audio: tuple[int, np.ndarray] | None, target_phrase: str
) -> tuple[str, str, str, str]:
    """Main assessment function.

    Returns (transcription, alignment_info, word_scores_html, phoneme_comparison).
    """
    if audio is None:
        return "No audio recorded.", "", "", ""
    if not target_phrase.strip():
        return "Please enter a target phrase.", "", "", ""

    load_models()

    sr, audio_data = audio
    # Gradio gives int16 or float32 — normalize to float32
    if audio_data.dtype == np.int16:
        audio_data = audio_data.astype(np.float32) / 32768.0
    # Mono
    if audio_data.ndim > 1:
        audio_data = audio_data.mean(axis=1)

    audio_input = (audio_data, sr)

    # 1. Transcribe what user actually said
    asr_results = asr_model.transcribe(audio=audio_input, language="French")
    transcription = asr_results[0].text if asr_results else "(empty)"

    # 2. Force-align against the expected text
    align_results = aligner_model.align(
        audio=audio_input,
        text=target_phrase,
        language="French",
    )

    alignment_lines = []
    if align_results and len(align_results) > 0:
        for segment in align_results[0]:
            alignment_lines.append(
                f"**{segment.text}** → {segment.start_time:.2f}s - {segment.end_time:.2f}s "
                f"(dur: {segment.end_time - segment.start_time:.2f}s)"
            )
    alignment_info = "\n".join(alignment_lines) if alignment_lines else "(no alignment data)"

    # 3. Word-level scoring
    scores = word_scores(target_phrase, transcription)
    html_parts = []
    total_score = 0.0
    count = 0
    for s in scores:
        count += 1
        total_score += s["score"]
        if s["status"] == "correct":
            color = "#22c55e"  # green
            tip = "correct"
        elif s["status"] == "wrong":
            color = "#ef4444"  # red
            tip = f'heard: "{s.get("actual", "?")}"'
        elif s["status"] == "missing":
            color = "#f59e0b"  # amber
            tip = "not detected"
        else:
            color = "#6b7280"  # gray
            tip = "extra word"

        html_parts.append(
            f'<span style="background:{color};color:white;padding:4px 10px;'
            f'border-radius:6px;margin:3px;display:inline-block;font-size:1.2em" '
            f'title="{tip}">{s["word"]}'
            f'<sub style="font-size:0.6em;opacity:0.8"> {s["score"]:.0%}</sub></span>'
        )

    avg = (total_score / count * 100) if count else 0
    scores_html = (
        f'<div style="margin-bottom:12px;font-size:1.4em;font-weight:bold">'
        f"Overall: {avg:.0f}%</div>"
        f'<div style="line-height:2.2">{"".join(html_parts)}</div>'
    )

    # 4. Phoneme comparison
    try:
        expected_ph = phonemize_text(target_phrase)
        actual_ph = phonemize_text(transcription)
        phoneme_info = (
            f"**Expected phonemes:**\n`{expected_ph}`\n\n**Your phonemes:**\n`{actual_ph}`\n\n"
        )
        # Highlight differences
        ph_diff = difflib.unified_diff(expected_ph.split(), actual_ph.split(), lineterm="", n=0)
        diff_str = " ".join(ph_diff)
        if diff_str:
            phoneme_info += f"**Differences:**\n`{diff_str}`"
        else:
            phoneme_info += "**Phonemes match!**"
    except Exception as e:
        phoneme_info = f"Phonemizer unavailable: {e}"

    return transcription, alignment_info, scores_html, phoneme_info


SAMPLE_PHRASES = [
    "Bonjour, comment allez-vous?",
    "Je voudrais un café, s'il vous plaît.",
    "Où est la gare?",
    "Je ne comprends pas.",
    "Excusez-moi, quelle heure est-il?",
    "Je m'appelle Jean. Enchanté.",
    "Pouvez-vous m'aider?",
    "C'est combien?",
]


def build_ui() -> gr.Blocks:
    with gr.Blocks() as demo:
        gr.Markdown("# Pronunciation Lab\nSpeak the French phrase and get instant feedback.")

        with gr.Row():
            with gr.Column(scale=1):
                target = gr.Textbox(
                    label="Target phrase (French)",
                    placeholder="Type or select a phrase...",
                    lines=2,
                )
                gr.Examples(
                    examples=[[p] for p in SAMPLE_PHRASES],
                    inputs=[target],
                    label="Quick phrases",
                )
                audio_in = gr.Audio(
                    sources=["microphone"],
                    type="numpy",
                    label="Record yourself",
                )
                btn = gr.Button("Assess", variant="primary", size="lg")

            with gr.Column(scale=1):
                transcription_out = gr.Textbox(label="What the model heard")
                scores_out = gr.HTML(label="Word scores")
                alignment_out = gr.Markdown(label="Forced alignment (word timestamps)")
                phoneme_out = gr.Markdown(label="Phoneme comparison")

        btn.click(
            fn=assess_pronunciation,
            inputs=[audio_in, target],
            outputs=[transcription_out, alignment_out, scores_out, phoneme_out],
        )

    return demo


if __name__ == "__main__":
    app = build_ui()
    app.launch(server_name="0.0.0.0", server_port=7870, theme=gr.themes.Soft())
