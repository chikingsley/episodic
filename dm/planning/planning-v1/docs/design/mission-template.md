# Mission Template

MISSION_ID: string
TITLE: string
NARRATIVE_CONTEXT: text
LEARNING_OBJECTIVES: [objectives]
REQUIRED_VOCABULARY: [term_ids]
GRAMMAR_FOCUS: [grammar_points]
EXERCISE_SEQUENCE: [
  {type: exercise_type, content: {...}, difficulty: number}
]
ASSESSMENT_CRITERIA: [criteria]
REWARDS: {xp: number, achievements: [achievement_ids]}

Content Template System
Mission Template:
MISSION_ID: string
TITLE: string
NARRATIVE_CONTEXT: text
LEARNING_OBJECTIVES: [objectives]
REQUIRED_VOCABULARY: [term_ids]
GRAMMAR_FOCUS: [grammar_points]
EXERCISE_SEQUENCE: [
  {type: exercise_type, content: {...}, difficulty: number}
]
ASSESSMENT_CRITERIA: [criteria]
REWARDS: {xp: number, achievements: [achievement_ids]}
Exercise Types Library:

Vocabulary Introduction
Multiple Choice Recognition
Translation Challenge
Listening Comprehension
Speaking Practice
Conversation Simulation
Grammar Pattern Practice
Reading Comprehension
Writing Exercise
Final Mission Assessment

Example Mission in Template Format
MISSION_ID: M1-2
TITLE: "Cover Identity"
NARRATIVE_CONTEXT: "You must establish your cover story to blend in with locals. Any inconsistency in personal details could compromise your mission."
LEARNING_OBJECTIVES: [
  "Introduce yourself with name, nationality and occupation",
  "Ask basic personal questions",
  "Understand responses about personal information",
  "Use numbers 1-20 in context"
]
REQUIRED_VOCABULARY: [
  "name_terms", "nationality_terms", "occupation_terms", "numbers_1_20"
]
GRAMMAR_FOCUS: [
  "present_tense_être",
  "present_tense_avoir",
  "basic_question_formation"
]
EXERCISE_SEQUENCE: [
  {type: "vocab_intro", content: {term_set: "occupations"}, difficulty: 1},
  {type: "multiple_choice", content: {focus: "nationalities"}, difficulty: 1},
  {type: "listening", content: {dialogue: "hotel_checkin"}, difficulty: 2},
  {type: "conversation", content: {scenario: "self_introduction"}, difficulty: 2},
  {type: "speaking", content: {prompt: "introduce_cover_identity"}, difficulty: 3}
]
ASSESSMENT_CRITERIA: [
  "Correct usage of être with professions",
  "Proper nationality gender agreement",
  "Number accuracy",
  "Question formation structure"
]
REWARDS: {xp: 75, achievements: ["identity_established"]}
