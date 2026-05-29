# Interrogation Decompiled Structure Notes

## Purpose

This note is grounded in the recovered `interrogation-unfold` source, not just playthroughs or reviews.

The goal is simple: strip away the theme and identify what `Interrogation: You Will Be Deceived` actually is as a game machine.

## What The Game Actually Is

At the mechanical level, `Interrogation` is a data-driven dialogue/state machine presented inside a mostly static scene.

The core loop is:

1. Load one episode data file.
2. Show one room with one or more subjects.
3. Let the player switch subjects and open a casefile.
4. Show only the currently visible question prompts.
5. When a prompt is chosen, select the matching answer, reaction text, effects, and animation.
6. Update per-subject and global state.
7. Recompute which prompts are now visible.
8. Repeat until a win/lose condition fires.

This is not an AI conversation system and it is not an open simulation. It is a tightly authored state machine with strong presentation.

## Source Anchors

The main technical anchors are:

- `interrogation-unfold/episodes/*.json`
- `interrogation-unfold/decompiled/level/store.lua`
- `interrogation-unfold/decompiled/level/state.lua`
- `interrogation-unfold/decompiled/level/questions.lua`
- `interrogation-unfold/decompiled/level/dialogue/dialogue.lua`
- `interrogation-unfold/decompiled/level/casefile/casefile.lua`
- `interrogation-unfold/decompiled/level/controller.lua`

## Content Model

Each episode JSON is basically a declarative scene package.

Common top-level keys include:

- `subjects`
- `questions`
- `answers`
- `hints`
- `common_texts`
- `time_limit`
- `extended_time_limit`
- `level_id`

Typical scale is larger than it first appears. Mid and late episodes have hundreds of questions and answers, not a tiny hand-built tree.

## Subject Model

Subjects are not just portraits. Each subject carries its own interrogation state and question pages.

Common subject fields include:

- `avatar`
- `name`
- `initial_empathy`
- `initial_fear`
- `initial_health`
- `animations`
- `questions`
- `back_questions`
- `fake_answers`
- `fake_answers_fallback`
- `torture_reactions`
- `page_settings`
- `triggered_questions`

Important point: questions are grouped by named pages, and each subject maintains a page stack. The game is not one flat list of prompts.

## Question Model

Questions are prompts shown to the player when their visibility conditions pass.

Question fields include:

- `id`
- `text`
- `answers`
- `visibility_conditions`
- `effects`
- `repeating_effects`

The engine also tracks runtime fields like:

- `ask_count`
- `visible`
- `new`
- `new_unseen`
- `new_indicated`

## Answer Model

Answers are authored responses selected by the engine when the player asks a question.

Answer fields include:

- `id`
- `text`
- `reaction`
- `conditions`
- `effects`
- `repeating_effects`
- `animation`

The engine tracks `answer_count` at runtime and can fall back to fake answers if no authored conditional answer matches.

## Runtime State Model

The central runtime state is simpler than the fiction makes it seem.

Per-subject state includes:

- `health`
- `fear`
- `empathy`
- `torture_damage`
- `times_tortured`
- `page_stack`
- `visible_questions`
- `last_answer_id`

Global state includes:

- timer / elapsed time
- on-record vs off-record state
- current subject / current room
- flags
- history log
- global campaign stats such as popularity, press, authorities, cruelty, insanity, ideology-style values

## Conditions And Effects

This is the real backbone.

Conditions check things like:

- subject stat thresholds
- global stat thresholds
- flags set or not set
- compound `AND` / `OR` logic
- conditional branches
- checks against another subject

Effects do things like:

- increment stats
- set or unset flags
- navigate to another question page
- replace current page
- fire win/lose events
- trigger animations
- fire arbitrary scripted events

That means the authored content is closer to a rules graph than a normal branching script.

## Presentation Layer

The presentation shell is modular and more static than flashy.

Main UI pieces include:

- dialogue bubbles
- question list panel
- subject switcher
- casefile drawer
- fear meter
- empathy meter
- timer
- hints
- torture room / recorder controls

This matters because a lot of the tension comes from the state model and UI framing, not from expensive scene production.

## History And Transcript

The game stores explicit history events for things like:

- asking a question
- switching subject
- recorder state changes
- torture
- kills
- level end

So even though the scene is static, the system keeps a strong record of what happened.

## What Is Reusable

The reusable structure is:

- static or semi-static scene
- multiple entities in one scene
- gated prompt visibility
- per-entity social state
- page-stack navigation
- authored reactions and animations
- explicit history logging
- timer / hint pressure

This is the part worth studying for your repo.

## What Is Theme Dressing

These are important to `Interrogation`, but they are not the essential machine:

- police interrogation premise
- ideology framing
- torture mechanics
- noir presentation
- recorder fiction
- terrorism plot

Those are content and tone choices layered onto the underlying authored state machine.

## Why This Matters For This Repo

The useful takeaway is not "make an interrogation game."

The useful takeaway is:

- keep the scene scope contained
- make the content data-driven
- let authored conditions/effects do the heavy lifting
- treat UI framing as part of the mechanic
- log state transitions explicitly

If this project keeps feeling vague, it is probably because the docs jump too quickly to premise and fantasy before locking the scene machine underneath.

## Folder Role Recommendation

- `planning/planning-v4/game-analyses/interrogation-analysis/interrogation-unfold/`
  Primary technical source for how the reference game is actually built.
- `planning/planning-v4/game-analyses/interrogation-analysis/`
  Secondary notes, guides, reviews, inferred diagrams, and synthesis docs.
- `systems-planning-all/`
  Current canonical design documents for this project, even when they are still hypotheses.
- `planning/planning-v4/prototypes/`
  UI and implementation experiments only.

## Practical Next Step

Before inventing more story framing, define one reusable scene machine for this repo in plain structural terms:

- scene
- entities
- visible prompts
- utterance or action resolution
- state deltas
- unlock rules
- history log
- win / fail / exit conditions

That is the layer `Interrogation` has clearly solved.
