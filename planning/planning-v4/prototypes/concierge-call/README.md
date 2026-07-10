# The Concierge Call

A Vite/React vertical slice for Dark Mallard's first conversation-puzzle scene.

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
or freeform AI conversation.

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

## TTS Audition

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
