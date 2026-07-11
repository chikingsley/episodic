# Interrogation Academy Tutorial Benchmark

A private browser reconstruction of the shipped opening tutorial in
*Interrogation: You Will Be Deceived*. It is the reference benchmark for
understanding the original game's scene grammar before designing a new
language-learning scene.

This is separate from the original
[`concierge-call`](../../pilots/concierge-call/README.md) concept pilot. The
benchmark reproduces the source material; the pilot tests a new direction.

## Reconstructed Boundary

The run begins at “A few years ago” and ends at “Mission accomplished.” It
includes the original sequence of gates:

1. instructor briefing and two-page case file
2. subject bring-in and failed direct accusation
3. empathy-building questions
4. fear-building questions and state-dependent answers
5. recorder off
6. two enhanced-interrogation actions
7. recorder on
8. accusation, pressure, confession, and completion

The React layer interprets local exported data rather than embedding the game's
dialogue in source code. Conditions, first-use effects, repeating effects,
flags, empathy, fear, and the final page switch are evaluated at runtime.

## What One Scene Costs

The generated local payload currently contains:

| Layer | Recovered input |
| --- | ---: |
| tutorial orchestration | 10 gates / 27 instructor lines |
| conversation graph | 15 questions / 30 conditional answers |
| presentation atlases | 120 named animations / 297 PNG frames |
| case-file art | 2 full pages |
| original audio | 1 score, 1 ambience bed, 12 interaction/reaction cues |
| generated dialogue | none — the original tutorial is unvoiced |

That payload is 39 MB on this machine. It lives under ignored
`public/interrogation-local/` and must never be committed or published.

## Build the Private Payload

Prerequisites are the sibling `interrogation-unfold` checkout with its ignored
extracted app payload, `uv`, `ffmpeg`, and `vgmstream-cli`. By default the script
looks for the latter at `/tmp/vgmstream/vgmstream-cli`; override with
`VGMSTREAM=/path/to/vgmstream-cli`.

```sh
./scripts/build-private-payload.sh
npm install
npm run dev
```

Vite binds to `0.0.0.0` on port 5174. The private build is currently available
on this machine at `http://100.121.185.11:5174/`.

## Verification

```sh
npm run build
npm run lint
```

The end-to-end browser path used for verification is:

```text
case file -> bring in -> Q1 -> Q5 -> Q4 -> Q10 -> Q11 -> Q15 -> Q8
-> recorder off -> grab -> wall -> recorder on -> accusation -> Q7
-> Mission accomplished
```

The question order is not a newly authored shortcut. It is one valid route
through the shipped condition/effect graph that satisfies every tutorial gate.
