Below is a concise schema brief you can hand to any engineer or DBA.
Copy-paste it into a schema.md (or Notion/Confluence) and iterate from there.

⸻

Dark Mallard – Data Schema (v0.1)

Goal: Track multi-level content (language → section → unit → lesson → exercise), per-user progress, XP / gems, and streaks—ready for Convex or Supabase.

⸻

1 Content hierarchy (author-side data)

Table / Collection	PK	Key fields	One row =	Why separate?
language	lang_id (uuid)	code (fr), name	One language	Central anchor for everything below
section	section_id	lang_id FK, ordinal, title	A1 / A2 / B1 block	Lets you gate by CEFR or story arc
unit	unit_id	section_id FK, ordinal, title, icon	Skill group (“Basics 1”, “Food”)	Independent reorder / hide
lesson	lesson_id	unit_id FK, ordinal, type (core | speaking | audio)	Clickable lesson tile	So you can mix audio-only, dialogue, etc.
exercise	ex_id	lesson_id FK, phase (1-4), template, json_payload	One prompt: picture, tap-build, Speak, …	Clean A/B tests; easy adaptive reorder
token (lexicon)	token_id	lang_id, text, ipa, audio_url	A vocab item	Centralised edits; exercises reference by id



⸻

2 User-side tracking

Table / Collection	PK	Core fields	One row =	Notes
user	user_id	email / auth	A player	
wallet	user_id	gems, hearts, last_refill_at	Currency & lives	
streak	user_id	current_days, longest, last_day_done	Daily streak counters	
user_lesson	composite (user_id,lesson_id)	xp_gained, attempts, best_tier, completed_at	Latest run of a lesson	best_tier = bronze / silver / gold / legendary
user_token	composite (user_id,token_id)	seen_count, correct_streak, ease (SM-2)	Per-word mastery stats	Powers future spaced-rep
user_audio (only if you add Pimsleur)	composite (user_id,lesson_id)	seconds_played, is_completed	Audio progress	

Optional fine-grained: user_exercise (user_id,ex_id,is_correct,tries,pron_score). Keep only if you need prompt-level analytics.

⸻

3 Naming / slug convention

Level	Slug pattern	Example
Language	fr	fr
Section	fr-sec-01 …	fr-sec-02
Unit	fr-u-01-01 (lang – section – unit)	fr-u-02-03 = section 2, unit 3
Lesson	fr-l-01-03-05 (lang – section – unit – lesson)	straightforward ordering
Exercise	Auto UUID or fr-e-01-03-05-12 ( + exercise idx )	

Human-readable “debug names” (e.g. basics_phrases) go in unit.title or exercise.template; keep IDs numeric for speed.

⸻

4 XP / Gem logic (quick rules)
	•	XP per exercise: core 10, speech 12, audio chunk 15.
	•	Gem award: floor(xp_gained / 10).
	•	Tier bump (best_tier):
	•	bronze → 1 pass
	•	silver → 3 passes
	•	gold → 5 passes
	•	legendary → 5 perfect passes
	•	Decay: nightly job—if best_tier < legendary and NOW()-completed_at > 14 days, downgrade one tier.

⸻

5 Adaptive-difficulty stub

// Convex / Supabase RPC pseudo-code
nextExercise(user_id, lesson_id):
  if last_attempt_wrong:
      return same_ex_id
  if token_seen < 4:
      return next_guided_recall()
  return next_new_token_or_review()

Enough until you gather real error logs.

⸻

6 MVP build checklist
	•	Create tables above in Convex / Supabase.
	•	Seed language, first section, unit, lesson, exercise JSON.
	•	Write one mutation: completeExercise → adds row to user_lesson, updates wallet, updates user_token.
	•	Cron/script to update streak nightly.
	•	Front-end: fetch lesson → render prompts → call mutation → update bars.

Hand this doc to your engineers—they’ll know exactly what to scaffold.