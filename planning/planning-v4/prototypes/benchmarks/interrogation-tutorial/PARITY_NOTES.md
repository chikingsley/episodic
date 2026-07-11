# Presentation Parity Notes

This document turns the academy reconstruction into a reusable scene contract.
It combines the recovered Defold data with direct observation of four screenshots
and three short recordings captured from the running game on 2026-07-10.

## Source-Supported Layout

The shipped project declares a 1920 × 1080 design surface. It does not divide
the screen into a conventional application sidebar and content panel. Instead,
the interrogation room, table, and characters move right to reserve a sparse
question lane on the left.

The recovered runtime explains the important relationship:

```text
question panel width                     730 design units
room/table running-phase offset          panel width × 0.5 = 365 units
tutor companion offset from subject      about -460 units
```

The last value comes from the subject collection: the companion collection is
offset -355 units, the tutor sprite is another -105 units inside it, and the
companion is scaled to 1.04. This is why the tutor remains behind-left when the
subject enters rather than moving into a separate HUD.

The browser version expresses those recovered relationships as percentages so
it can respond to a resized viewport while preserving the composition.

## Scene Modes

| Mode | Character staging | Overlay | Player input |
| --- | --- | --- | --- |
| tutor briefing | tutor dominant, chair empty | tutor bubble above head | click bubble to advance |
| gated instruction | same staging | bubble remains, advance mark removed | highlighted world object |
| case file | room darkened beneath folder | animated folder and two-page spread | close / next / previous |
| subject questioning | tutor behind-left, subject seated foreground | questions in left lane, subject portrait at right | select question |
| answer/reaction | same character staging | question, answer, and reaction bubbles | click through response |
| meter lesson | same staging | two waveform meters at upper-right | questions alter state |
| off record / torture | subject foreground, tutor changes pose | recorder and tool controls | two physical actions |
| completion | room suppressed | centered mission result | replay or exit |

This state list should be implemented as explicit scene modes. It should not be
approximated with one permanent dashboard whose widgets are merely enabled and
disabled.

## Character Asset Contract

Recovered native frame canvases establish useful prototype targets:

| Role | Frame canvas | Existing named states |
| --- | ---: | --- |
| instructor | 562 × 680 | idle, idle blink, explain, secret |
| seated subject | 449 × 509 | idle, scared idle, empathic idle, shrug, disgust, headshake, nod, smile, frown, defence, reaction variants |
| subject portrait | 100 × 100 | one panel portrait per subject |

New artist deliveries should preserve one canvas size and one body anchor across
every state. Transparent padding is part of the contract: changing the crop per
pose makes the character visibly jump even when the CSS or game-object anchor
does not move.

Recommended delivery for a new character:

```text
character-name/
  manifest.json
  idle/000.webp ...
  idle-blink/000.webp ...
  talk-neutral/000.webp ...
  talk-pressed/000.webp ...
  react-positive/000.webp ...
  react-negative/000.webp ...
  portrait.webp
```

Each manifest animation needs `frames`, `fps`, `loop`, and a stable anchor. The
current `AnimatedSprite` already consumes the first two and can grow to consume
the latter fields without changing scene content.

## Speech, Mouth Motion, and TTS

The original tutorial is unvoiced, so its subject poses are emotional gestures,
not lip-sync. A voiced language scene can extend the same framework without
coupling TTS to rendering:

1. bake and approve one audio file per dialogue line
2. store duration and optional word timings beside the line ID
3. enter a `talk-*` animation while the audio element is playing
4. use either a restrained two/three-frame mouth loop or timed viseme IDs
5. return to the state-derived idle when playback ends

For this visual style, a restrained talk loop plus strong reaction poses is a
better first target than full phoneme animation. If artists provide visemes,
six to eight mouth groups are enough for a prototype, as long as every mouth
overlay uses the same head anchor and canvas.

The audio system should continue to own one persistent music element, one
persistent ambience element, and a reusable pool of one-shot effects. Dialogue
gets one foreground channel; starting a new line stops or completes the current
line according to the scene's interruption rules.

## Browser Layering Contract

The reconstruction uses this visual stack, back to front:

```text
room background
chair
tutor companion
subject
lamp and table foreground
case file and recorder world controls
questions, meters, portraits
speech and reaction bubbles
case-file modal / torture flash / result modal
```

Artists can replace character frames, room art, foreground furniture, or UI
nine-slices independently if the layer and anchor contract remains stable.

## Known Non-Pixel-Exact Areas

- The browser uses responsive DOM/CSS rather than Defold's world and GUI
  projections.
- The original compiled font atlases are not reusable browser fonts; Georgia
  and monospace fallbacks approximate the dialogue and pause faces.
- The bubble frame uses the recovered irregular border as a CSS nine-slice, with
  a CSS tail added to retain its shape when the body stretches.
- The folder opening is a CSS 3D transition derived from the observed motion,
  not the original Defold animation controller.

Those boundaries are intentional and visible. The scene logic, source text,
state gates, frame sequences, spatial hierarchy, and recovered artwork remain
the benchmark's source-accurate layers.
