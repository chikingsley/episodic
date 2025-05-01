Below is a pragmatic “next-mile” brief.
I kept it intentionally high-signal so you (or the devs you hand this to) can paste it into Linear/Jira and start carving tickets.

⸻

1 What you’re actually describing

“Hard-line Pimsleur spine, but allow the system to ask the learner to re-do a day, inject extra context, etc. Less 40-dimensional chess; more ‘help me if I’m shaky’.”

That’s a Scripted-Spine + Adaptive Overlay pattern:

┌───────────────────────┐      always unlocked
│  Day-N Pimsleur audio │  ─►  (fixed chronology, 30 min chunks)
└───────────────────────┘

          ▼ when overlay says “yes”
┌─────────────────────────────────────────────────────────┐
│   Adaptive Overlay  (HLR + Elo)                        │
│  • inserts ≤ 6  min of micro-reviews                   │
│  • OR asks learner to “re-take yesterday’s episode     │
│    with extra prompts” if P(recall)<.60                │
└─────────────────────────────────────────────────────────┘

	•	Spine = complete Pimsleur scripts, chopped into call-&-response item_ids.
	•	Overlay = pure HLR (or HLR + Elo if you want to choose which prompt to review).
When the overlay fires, you can either:

	1.	prepend a “re-listen” version of yesterday’s chunk, or
	2.	insert extra call-&-response prompts inside today’s session.

That gives you:
	•	The psychological safety of familiar Pimsleur pacing.
	•	Evidence-based review whenever the memory curve predicts failure.
	•	Zero need for full generative exercises on day 1—you’re just replaying existing audio or re-ordering prompts.

⸻

2 Cold-start / seeding checklist (v0.2 schema)

what must exist before the first user can press Start	how many do you really need?
language rows	1 per language (e.g. fr)
1 section → 1 unit → 1 lesson to satisfy FK cascade	create “Pilot / Unit 0 / Lesson 0” dummy rows if needed
exercise templates (template_id 1-5)	as many as you support in UI
item + concept records for every prompt in the first 30-min audio	200-300 lines is plenty
audio chunk metadata (media_asset)	one row per call/partner voice segment
seed A/B parameters for HLR (A=0, B=0.5) + Elo (d=0)	automated default

Everything else is auto-created the first time a learner triggers it.

⸻

3 Minimal back-end jobs you can postpone

job	can you launch without it?	when to add
Nightly Elo replay	Yes	after you have > 50 k events and want stable leaderboards
Tier-decay cron	Yes	when you introduce visible lesson tiers
Gem refill cron	Yes	when hearts/gems actually gate play
Leaderboard snapshot	Yes	when you expose a leaderboard



⸻

4 High-level task board

4.1 Core APIs (Convex/Supabase)

endpoint / fn	job
startSession(user_id)	open session, returns daily_goal, etc.
nextPrompt(session_id)	chooses overlay vs spine prompt, returns media + template
submitAnswer(event_payload)	writes user_exercise_event, runs Eq 1-5, returns next_due + XP
endSession(session_id)	close, update streak, wallet

All maths (Elo, HLR) live in this layer.

⸻

4.2 React-Native UI surface areas

screen / component	data needed from schema
Home map / path	unit, lesson, user_lesson.best_tier, streak
Audio Player (Pimsleur)	ordered list of media_asset & expected_text (for STT check)
Review modal	overlay picks; simple “Say it again” or multiple-choice template
XP / Gem toast	output of submitAnswer
Streak & wallet bar	streak, wallet
Settings / debug	surface elo_user_global, p_recall (nice for power users)

Speech: Use expo-speech for TTS (partner voice) and expo-speech-recognition (or native iOS / Android recognizers) for STT. Capture transcript; Levenshtein ≤ 30 % → marked “correct”.

⸻

4.3 Content-author tooling

tool	must-haves
CSV → SQL uploader	headers match item, exercise, media_asset
Audio chunk marker	small in-house script: drop an .mp3, click “split”, export rows with start_ms, end_ms, file_url
Script previewer	web page that plays partner line ▶ TTS narrator ▶ records learner ▶



⸻

4.4 Optional niceties
	•	Rive animations: show a mouth-moving avatar on speak templates.
Hook listener.isRecording → play “speaking” state machine.
	•	Pipecat Cloud: wrap the STT error message—if transcript far off, call Pipecat to generate a corrective hint.
That’s bolt-on; not schema-critical.
	•	Pronunciation depth:
Word level: iOS & Android recognizers give timing per token ⇒ highlight wrong syllable.
Phoneme level: open-source pocketsphinx-align or paid Google Cloud Speech phone-info—only if you want red-/green per phoneme.
Totally optional for v1.

⸻

5 Ticket template cheat-sheet

feat(content): ingest Pimsleur Lesson 01
  • provide CSV for item / exercise / media_asset
  • run chunk-marker -> produce 120 media rows
  • verify in script previewer

feat(api): POST /submitAnswer
  • validate payload against user_exercise_event
  • run Eq1-3, Eq5
  • return {xp_delta, hearts_delta, next_prompt}

feat(ui): AudioPlayer
  • renders list of mediaAsset[]
  • after partner/narrator line, auto-record learner
  • onComplete => call /submitAnswer



⸻

6 Sanity path to “Hello World”
	1.	Insert language → section → unit → lesson rows.
	2.	Load 1 dialogue with ~10 call-&-response lines as item + exercise.
	3.	Mock overlay OFF (always returns next spine prompt).
	4.	Build AudioPlayer that just plays the 10 lines and records STT.
	5.	Wire submitAnswer → writes user_exercise_event, updates Elo.
	6.	Show XP toast.
	7.	Done—first learner can finish Lesson 0 and see streak 📈.

Everything else (overlay review, wallet, Rive, concept-Elo, Gem shop, nightly jobs) layers on without schema changes.

⸻

Remember

You don’t need “crazy under-the-hood” on day 1.
The spine already teaches; the overlay only intervenes when memory curves predict pain.

Ship the narrow slice above, watch real learners struggle, then crank up the clever bits.