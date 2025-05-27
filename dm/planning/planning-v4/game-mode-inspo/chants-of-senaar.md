Chants of Sennaar – language-learning core loop

Stage	What the player does	Hidden pedagogical purpose	Take-away for your team
1. First contact	Arrives in a zone where all signage and speech bubbles are glyphs. Each new glyph that appears is auto-copied into the player’s notebook.	Instant immersion → forces “comprehensible zero input” so every later hint feels like progress.	Start every chapter with an opaque block of target-language content to create curiosity tension.
2. Free noting / hypothesis	In the notebook the player can type any guess next to a glyph; that guess then overlays future dialogue so the text becomes a mix of glyphs + guesses.	Promotes generation effect: making one’s own guess deeply encodes the form.	Give learners a quick-edit lexicon where they can write a gloss, a mnemonic, a drawing, anything. Keep it low-friction (1-click edit).
3. Context harvest	Players roam, watching NPCs mime, reading pictorial signs, listening to repeated phrases.	Multiple varied contexts = natural spaced repetition without drills.	Seed every unknown word in 3–5 different micro-contexts (animation, UI hint, short quest).
4. Validation spread	Periodically a double-page pops up: 3–5 sketches (e.g., a guard saluting, a door) + the relevant glyphs. Drag-match the glyph to the sketch. If all matches are right, the set locks-in and future dialogue swaps the glyphs for the confirmed word.	Gives a clear success “ding”, removes ambiguity, and acts as spaced test moments .	Drop “checkpoint cards” that auto-test clusters of words instead of single flash-cards. Require 100 % correctness to lock them, but allow infinite retakes.
5. Structural clues	Some scripts reuse radicals/affixes (e.g., a curved stroke = “tool”, underline = verb). Players spot the pattern themselves; the game never explains it explicitly .	Implicit grammar discovery through visual clustering (inductive learning).	Encode real-language morphology visually (color, icons, prefixes) so players intuitively group forms before you ever name the rule.
6. Knowledge-gated puzzles	Doors, stealth terminals, & cross-culture translators only open if the player enters the right phrase in the new language.	Forces active recall in a meaningful task (communicative purpose).	Gate story beats behind tiny production tasks (type the polite request, choose the right honorific, etc.).
7. Multilingual bridges	Later floors contain bilingual signs or machines that show Floor N glyphs ⇄ Floor N-1 glyphs. This lets players cross-check hypotheses and highlights syntactic differences .	Comparative noticing: seeing two versions side-by-side sharpens grammar awareness.	Re-use earlier vocabulary as subtitled L1 lines, or show parallel text to highlight word order / particles.
8. Difficulty ramp	Each floor adds a twist: new word order (OSV for Bards), compound glyphs, incomplete sentences, stealth under pressure, etc.	Keeps cognitive load balanced—just as decoding feels easy, a new linguistic wrinkle appears.	Plan incremental “rule reveals” every chapter (e.g., first nouns, then plurals, then past tense…).


⸻

Why it works (educational lens)
	•	Inductive discovery – Learners infer meaning before any overt teaching, mirroring real-life L2 immersion.
	•	Immediate hypothesis feedback – Correct matches rewrite the world instantly, a powerful reward loop.
	•	Contextualized repetition – The same word shows up in dialogue, UI prompts, puzzles, and scenery.
	•	Intrinsic motivation – Decoding = progress. Story advancement and mechanical access depend on comprehension, not XP bars.
	•	Cognitive scaffolding – Only ~5 words are ever tested at once, preventing overload while still feeling substantial.

⸻

Translating these ideas into your app

CoS idea	Lightweight adaptation for a real language-learning app
Notebook with free-text guesses	Let users write their own gloss or pick an emoji/picture; keep the guess visible in future subtitles until validated.
Drag-match validation spreads	Mini-comic panels: learners drag the Spanish word onto the picture; all correct → panels animate & lock.
Radicals / visual morphology	Highlight prefixes (“re-”), suffixes (“-ment”), particles or Kana using consistent color or shape.
Knowledge-gated gates	NPC won’t give the quest unless you say the politeness formula; speech-to-text checks pronunciation.
Bilingual bridges	Show bilingual graffiti or AR signs that switch between the learner’s L1 and L2 on tap.
Multi-floor progression	Theme each “floor” around a social context (market, hospital, party). Introduce one grammar target per floor, escalate stakes with a stealth or timed element.


⸻

Implementation quick hits for dev discussion
	1.	Data model: Each lexeme = {id, glyph_img, target_script, canonical_L2, learner_guess, confirmed_bool, contexts:[...]}.
	2.	Validation logic: All answers must be correct → write confirmed_bool=true else keep guesses.
	3.	Dynamic subtitles: Render sentence tokens; if confirmed, show L2, else show glyph/guess.
	4.	Guess input UX: single-tap a token to bring up a compact text-field + emoji picker.
	5.	Spaced surfacing: Shuffle unconfirmed tokens back into NPC barks every N minutes.
	6.	Bridge mechanic: Store translation_pairs to auto-generate bilingual puzzles between any two unlocked script sets.

Use this breakdown as a vocabulary to pitch mechanics to your team, then decide which pieces best serve your pedagogical goals.