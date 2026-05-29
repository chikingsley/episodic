# Product Note: Language Is The Game v1

## Purpose

This note narrows Dark Mallard from a broad spy-thriller framework into a concrete MVP product direction.

The goal is simple:

- spoken language must be the core mechanic
- the player must use voice to solve the scene
- success must depend on deploying limited language under pressure, not on quiz performance

## Product Thesis

Dark Mallard should not compete as:

- a Duolingo-style quiz wrapper with theme dressing
- a fictional-language decipherment puzzle
- an open-ended AI chat toy

It should compete as a **speech-performance game**.

Core formula:

`Pimsleur teaches the construction.`
`The game tests whether the player can deploy it live.`

Language becomes the game when the player's main verbs are:

- answer
- ask
- verify
- deny
- reassure
- redirect
- stall
- instruct
- repair
- maintain cover

If those speech acts change the state of the scene, language is no longer decoration. It is the mechanic.

## Market Gap

Most language products fall into one of four buckets:

1. **Quiz wrappers**
   Thin RPG or mini-game shells around flashcard, matching, or fill-in-the-blank loops.

2. **Fictional-language puzzle games**
   Strong as puzzle design, weak as real-language deployment training.

3. **Passive input libraries**
   Useful long-term exposure, weak immediate feedback on whether the learner can perform.

4. **Freeform AI conversation**
   Flexible, but usually too unstructured to feel like a game or teach bounded mastery.

Pimsleur gets closest to the useful part:

- compact constructions
- timed recall
- guided speaking
- strong sequencing

But it stops short of the application layer.

Dark Mallard's opportunity is the missing category:

**A real-language game where the player speaks to solve bounded, high-stakes situations.**

## Product Definition

Dark Mallard is not "language learning plus a game."

Dark Mallard is a game in which:

- the scene objective is conversational
- the player's voice is the primary input
- limited language is expected and designed for
- failure creates social and tactical consequences
- recovery is part of the play, not just a grading screen

The player should not feel like they are completing an exercise.

The player should feel like:

- they got through the call
- they bought enough time
- they calmed the person down
- they extracted the needed detail
- they kept suspicion manageable
- they survived the conversation with imperfect language

## Recommended MVP Format

### Format: Live Crisis Call

This is the recommended first shipping format.

It can be presented as:

- phone call
- radio call
- dispatch line
- emergency video call

### Why This Format Wins

- **Low art scope**: one caller portrait, waveform, transcript support, UI state changes
- **High tension**: urgency is natural, not bolted on
- **Natural turn length**: crisis talk is short, functional, and repetitive
- **Limited-language friendly**: beginner/intermediate players can plausibly function
- **Replayable**: same mechanical format supports many scenarios
- **Speech-first**: voice is necessary, not gimmicky
- **Plausible real-world deployment**: helping, calming, verifying, and relaying are real uses of language

### Why Not Open World First

Open-world "live in the country" simulation is a fantasy-layer goal, not an MVP.

It is weak for first implementation because it requires:

- too many scenes
- too many art states
- too much dialogue coverage
- too much systemic AI behavior
- too much content before the core mechanic is proven

The crisis-call format keeps the interaction dense and the scope tight.

## MVP Player Fantasy

The player fantasy is:

**"I am not fluent, but I can still get this done."**

That matters because it creates a stronger emotional loop than either:

- "I got the quiz answer right"
- "I can chat vaguely with an AI"

The fantasy is competence under pressure, not perfect fluency.

## Core 10-Minute Session Loop

### 1. Hook (45-60 sec)

- urgent incoming call or assignment
- clear objective
- clear stakes
- no lore dump

Example:

"A local contact is panicking. Her son has been detained. Keep her calm, find out where he is, and get enough information to connect her to help."

### 2. Pattern Prime (60-90 sec)

- 3-5 core constructions only
- audio-first
- backward buildup where needed
- very short semantic framing

Example construction set:

- "Je vais vous aider."
- "Ou est-il?"
- "Calmez-vous."
- "Je comprends."
- "Restez avec moi."

### 3. Controlled Drill (90-120 sec)

- rapid response under time pressure
- same scene context
- slight slot substitution
- correction only on what matters

Example:

- "Say: I will help you."
- "Ask: Where is he?"
- "Say: Stay with me."
- "Ask: Which police station?"

### 4. Live Call: Phase One (2 min)

- caller in distress
- player must stabilize emotion and gather the first facts
- small off-script variation begins

### 5. Live Call: Escalation (2 min)

- new complication arrives
- caller becomes less coherent, or a second party joins, or urgency increases
- player must repair, redirect, or re-ask

### 6. Cross-Call or Action Transfer (90 sec)

- call official contact, handler, hospital, police desk, or other target
- register changes
- objective shifts from emotional support to precise action

### 7. Debrief (45-60 sec)

- what worked
- what failed
- which constructions are now "owned"
- one setup line for the next scenario

## The Core Mechanical Loop

Every scene should follow this structure:

1. learn a compact construction set
2. enter a live situation
3. hear something slightly off-script
4. respond by speaking
5. alter the conversation state
6. either recover, advance, or lose ground

The important design point:

**The player is not graded on exact sentence recall alone.**

They are graded on whether the utterance moved the scene toward the objective.

## Scene Model

Each scene needs six ingredients:

### 1. Objective

What the player must accomplish.

Examples:

- calm the caller
- get the address
- verify identity
- buy time
- secure entry
- obtain permission

### 2. Required Speech Acts

What kinds of utterances solve the scene.

Examples:

- reassure
- request clarification
- ask location
- deny accusation
- give instruction
- confirm details

### 3. Construction Set

The reusable linguistic frames available for the scene.

Examples:

- "Je vais..."
- "Vous devez..."
- "Ou est...?"
- "Est-ce que...?"
- "Je ne comprends pas, repetez."

### 4. Slot Vocabulary

Scene-specific nouns, verbs, and labels that plug into the construction set.

Examples:

- police
- commissariat
- fils
- hopital
- attendre
- avocat

### 5. Off-Script Pressure

A bounded surprise that prevents the scene from becoming pure rote recall.

Examples:

- emotional interruption
- accent shift
- background noise
- partial answer
- suspicious follow-up question

### 6. Consequence State

The conversation must visibly move.

Examples:

- trust rises
- suspicion rises
- urgency drops
- clarity improves
- objective advances

## Speech-State Model

This is the core system that makes voice meaningful without requiring full freeform AI conversation.

### Scene State Variables

Each scene should track a small number of state values:

- **Objective Progress**: how close the player is to resolving the task
- **Trust**: whether the other party believes the player is useful or aligned
- **Suspicion**: whether the other party doubts the player or their role
- **Emotional Temperature**: panic, anger, calm, resistance
- **Clarity**: whether the needed facts have been established cleanly
- **Time Pressure**: whether delay is making the problem worse

Not every scene needs all six equally, but this is the base model.

### Utterance Scoring Axes

Each spoken response should be scored on these axes:

- **Speech Act Match**: did the player attempt the right move for this moment?
- **Slot Accuracy**: did they include the key meaning-bearing word or phrase?
- **Register Fit**: was the utterance socially appropriate for the target?
- **Comprehensibility**: was the utterance understandable enough to act on?
- **Timing**: was the response delivered before the window collapsed?
- **Repair Quality**: if the player missed, did they recover intelligently?

### Design Rule

Do not score scenes primarily on exact phrase equality.

Score scenes on:

- intent
- usable meaning
- scene effect

This is what separates the product from both quiz software and vague AI chat.

## Example State Update

Caller says:

"Mon fils est arrete! Je ne sais pas quoi faire!"

Player response:

"Calmez-vous. Je vais vous aider. Ou est-il?"

Likely state effect:

- Objective Progress `+`
- Trust `+`
- Emotional Temperature `-`
- Clarity `+`

Player response:

"Euh... police... je ne sais pas..."

Likely state effect:

- Trust `-`
- Emotional Temperature `+`
- Time Pressure `+`

Player recovery:

"Je ne comprends pas. Repetez. Ou est le commissariat?"

Likely state effect:

- Clarity `+`
- Trust `slight +`
- Time Pressure `slight -` if delivered quickly enough

This is the important pattern:

imperfect speech can still produce a good state transition if the move is strategically correct.

## Content Recipe For One Scene

A good MVP scene can be built from:

- 3-5 core constructions
- 8-15 slot words
- 1 main objective
- 1 off-script twist
- 2 repair options
- 1 register shift
- 1 consequence fork

That is enough to create a scene that feels alive without requiring full open-domain language coverage.

## Content Recipe For One Scenario Pack

A good first scenario pack could contain 6-8 crisis calls:

1. Distressed civilian
2. Suspicious desk official
3. Lost contact needing directions
4. Medical support relay
5. Identity verification under noise
6. Angry witness who must be calmed
7. Border or checkpoint assistance
8. Late-game multi-call chain

All of these can reuse the same core UI and speech-state model.

## Production Constraints

### What To Build First

- one call UI
- one ASR pipeline
- one bounded speech-act parser
- one state machine for scene progression
- one debrief layer
- 3-5 vertical-slice scenes

### What Not To Build First

- open world navigation
- mini-games unrelated to speech
- full freeform AI conversation
- large branching town sim
- complex inventory systems
- animation-heavy action sequences

## What Makes The Game Feel Like A Game

The game feel comes from:

- stakes
- uncertainty
- timing
- consequence
- recoverability

Not from:

- decorative RPG numbers
- XP bars alone
- avatar cosmetics
- filler mini-games

The scene must create the feeling:

**"I barely got through that, but I got through it."**

That is the right emotional target.

## Success Criteria

The MVP is working if:

- players report stress and relief, not just correctness
- players can succeed with imperfect but functional language
- repair moves feel valuable
- replay improves performance in a visible way
- voice input feels necessary, not ornamental
- the same mechanics can support multiple scenarios without feeling identical

## Strategic Positioning

The clean product position is:

**Dark Mallard is the application layer after structured speaking practice.**

It is for players who want more than:

- flashcards
- quiz loops
- passive input
- unguided AI conversation

It gives them:

- bounded live deployment
- social consequence
- tactical conversation
- game-shaped pressure

## Immediate Next Steps

1. Build a single vertical slice using the crisis-call format.
2. Define the scene schema:
   objective, constructions, slots, off-script events, state updates, failure conditions.
3. Define the utterance evaluator:
   speech act, slots, register, comprehensibility, timing, repair.
4. Write 3 short scenes that escalate in complexity.
5. Test whether players feel that language itself is the challenge and the tool.

## Bottom Line

The first product should not try to simulate life in a foreign country.

It should simulate a small number of tense, believable situations where limited language still matters.

That is the shortest path to proving the central thesis:

**language is the game.**
