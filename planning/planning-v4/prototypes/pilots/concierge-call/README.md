# The Concierge Call — Concept Pilot

A preserved Vite/React concept slice for Dark Mallard's first
conversation-puzzle scene. This is not the fidelity benchmark for the original
game. That work now lives in
[`benchmarks/interrogation-tutorial`](../../benchmarks/interrogation-tutorial/README.md).

```bash
npm install
npm run dev
```

Vite binds to `0.0.0.0`, so the same server is available through this machine's
Tailscale address.

## What This Prototype Tests

One question only:

> Can four pieces of beginner French become meaningful tactical moves inside a
> mystery scene?

This is intentionally not a complete lesson system, campaign, ASR integration,
or freeform AI conversation. It is now a complete local scene presentation:
branching state, recovered animation, original ambience/UI cues, and baked NPC
speech.

## Recovered Interrogation Layer

The live local build uses copyrighted assets recovered from the user's own app
bundle. They are ignored by Git and must never be published:

- the actual 1920 x 1200 interrogation room, chair, lamp, and table
- five Diana frame sequences mapped to neutral, guarded, irritated, surprised,
  and softened states
- Episode 0's 2:31 score
- original room ambience, bring-in, question, hover, button, and case-file cues

The extraction is reproducible with the `recover-texture` command in the sibling
`interrogation-unfold` repository. The React layer falls back to its SVG portrait
when the ignored local files are absent.

## Interrogation Mapping

| Interrogation | Concierge Call |
| --- | --- |
| episode page | `SceneNode` |
| visible question | `Move` |
| answer conditions | future `Condition[]` gate |
| answer effects | `Effect[]` |
| subject stats | trust, clarity, pressure |
| story flags | `SceneState.flags` |
| navigate / replace page | `Move.next` |
| play animation / set idle | node `mood` |
| FUIOR interlude | briefing and outcome shell |

The content is deterministic data in `src/scene.ts`; React is the interpreter.

## Eight-to-Ten-Minute Beat Sheet

| Time | Beat | Player work | Proof |
| --- | --- | --- | --- |
| 0:00-0:45 | Case hook | inspect tenant, tape, statement | understands the contradiction to investigate |
| 0:45-2:00 | Handler prep | rehearse four speech functions | can recognize the available toolkit |
| 2:00-2:45 | Contact | open or verify language | trust/pressure diverge immediately |
| 2:45-3:45 | Language boundary | disclose limitation or pin down English | language ability becomes a fact |
| 3:45-4:45 | Identification | put Daniel in the lobby | last sighting becomes explicit |
| 4:45-6:15 | The claim | define “did not understand” | witness commits to a falsifiable statement |
| 6:15-7:30 | Contradiction | replay evidence or challenge directly | clarity and relationship trade off |
| 7:30-8:30 | Recognition | identify a second voice | new evidence or costly confirmation |
| 8:30-9:15 | Consequence | see evidence, route, review | language performance changes the case |

## Voice Pipeline

The original game does not contain voiced dialogue. Its Episode 0 bank contains
one music stream; the shared level bank contains 58 ambience, UI, breath,
physical-reaction, and torture streams. New dialogue therefore uses an offline
authoring pipeline:

1. lock and native-review the French text
2. generate all lines in one consistent voice session
3. transcribe every take with an independent ASR model
4. reject omissions and lexical substitutions
5. normalize and bake accepted WAV files under stable scene-node IDs
6. load the files at scene start; never run TTS during play

The current six lines are baked into ignored `public/audio/generated/npc/` using
OmniVoice on the RTX 5070. Qwen3-ASR recovered every lexical line; punctuation
and the inaudible written gender ending in `fatiguee` are the only differences.

The local OmniVoice sample is generated into ignored
`public/audio/generated/`. It uses the CC BY-NC pretrained checkpoint and is for
private prototype evaluation only. A Voxtral API take should use the same text
and be saved beside it for blind comparison.

The expected sample line is:

> Bonjour, monsieur. Je comprends un peu l'anglais, mais parlez lentement,
> s'il vous plaît.

Do not promote either voice until a native French reviewer scores:

- pronunciation and liaison
- natural rhythm
- age and character fit
- emotional restraint
- consistency over ten lines

See `SCENE_CONTRACT.md` for the content-quality gate.
