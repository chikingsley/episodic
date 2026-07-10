# Scene Contract and Quality Gate

This contract exists because unrestricted LLM script generation is not a
reliable authoring method.

## Fixed Inputs Before Writing

Every scene must declare:

1. one dramatic question
2. one objective
3. three visible state variables at most
4. three to five teaching targets
5. one evidence change
6. two or three outcomes

The writer may fill this structure. The writer may not expand the system while
writing the scene.

## Line Gate

A line survives only if it does at least one of these jobs:

- reveals or contests evidence
- changes trust, clarity, or pressure
- retrieves a teaching target
- characterizes the witness while advancing the objective
- sets up a later contradiction

Atmosphere alone is insufficient. Exposition that can be an evidence card does
not belong in dialogue.

## Choice Gate

Every player move must have:

- a named conversational intent
- a French utterance
- an English meaning
- at least one explicit effect
- exactly one destination
- a materially different tradeoff from the adjacent move

Two phrasings with the same effect are one choice, not two choices.

## Learning Gate

- Use three to five targets only.
- Retrieve every target at least twice.
- The second retrieval must perform a different scene function or occur under
  different pressure.
- A missed target changes the situation; it does not merely subtract points.
- The learner may use limited French without the story pretending they are
  fluent.

## Review Roles

An LLM may draft within the contract. It cannot approve its own output.

1. **Structural validator**: checks destinations, effects, targets, and dead
   choices automatically.
2. **Native-language reviewer**: checks French, register, rhythm, and whether a
   beginner could plausibly deploy it.
3. **Narrative editor**: removes generic thriller dialogue and false choices.
4. **Cold playtester**: reports what they believed happened without being told.

If the cold playtester cannot state the contradiction and consequence, the
scene failed regardless of prose quality.

## Current Prototype Limits

- Choice buttons stand in for bounded speech recognition.
- The recovered Interrogation room, character animations, and FMOD audio are
  private local stand-ins and remain ignored by Git.
- The SVG portrait is now only the missing-asset fallback.
- Six baked OmniVoice lines are local and non-commercial.
- The French is a production draft pending native review.
