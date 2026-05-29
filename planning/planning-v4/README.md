# Planning V4

## Role

`planning-v4` is the active exploration workspace.

This folder is not one clean linear spec. It is where references, analysis, narrative fragments, prototypes, and older planning rounds live while the project is still being worked out.

## Directory Split

- `archive/`
  Older rounds, imported references, and materials kept for traceability.
- `game-analyses/`
  External game breakdowns, reference notes, diagrams, and recovered source workspaces.
- `narrative/`
  Story exploration and premise work.
- `technical/`
  Technical notes and implementation thinking that are still in-flight.
- `prototypes/`
  Actual mockups and code experiments.

## Important Distinction

`planning-v4` is the messy working area.

`systems-planning-all/` is the cleaner cross-system synthesis area.

In practice:

- if something is still exploratory, comparative, or half-proven, keep it in `planning-v4`
- if something is the current best statement of the project's system design, move or restate it in `systems-planning-all`

## Specific Reference

For `Interrogation` work:

- `game-analyses/interrogation-analysis/interrogation-unfold/`
  Primary decompiled source workspace.
- `game-analyses/interrogation-analysis/`
  Secondary notes, guides, and synthesis.

## Working Rule

When a reference game has both source artifacts and analysis notes:

1. verify structure against the source artifacts first
2. keep inferred takeaways in a nearby note
3. only then promote a conclusion into `systems-planning-all/`
