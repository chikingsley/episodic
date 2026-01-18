-- Pimsleur Analysis Database Schema
-- Version 3.2

-- A table to store metadata for each lesson.
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    lesson_number INT UNIQUE NOT NULL,
    title VARCHAR(255)
);

-- A table to store each line from the transcripts.
CREATE TABLE utterances (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id),
    position_in_lesson INT NOT NULL,
    speaker VARCHAR(100),
    text TEXT NOT NULL,
    language CHAR(5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lesson_id, position_in_lesson)
);

-- A table to store unique phrases extracted from utterances.
CREATE TABLE phrases (
    id SERIAL PRIMARY KEY,
    text TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A junction table to map phrases to the utterances they appear in.
CREATE TABLE phrase_occurrences (
    id SERIAL PRIMARY KEY,
    phrase_id INT NOT NULL REFERENCES phrases(id),
    utterance_id INT NOT NULL REFERENCES utterances(id),
    is_new BOOLEAN DEFAULT FALSE,
    is_review BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(phrase_id, utterance_id)
);

-- A table to store per-lesson analysis metrics.
CREATE TABLE cognitive_load (
    id SERIAL PRIMARY KEY,
    lesson_id INT UNIQUE NOT NULL REFERENCES lessons(id),
    load_score FLOAT,
    novelty_ratio FLOAT,
    repetition_density FLOAT,
    core_introductions INT,
    derived_phrases INT,
    last_calculated TIMESTAMPTZ DEFAULT NOW()
);

-- A table for storing extracted templates from phrases.
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    phrase_id INT UNIQUE NOT NULL REFERENCES phrases(id),
    template_text TEXT NOT NULL,
    complexity_score INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A table for persistent pattern pedagogical analysis
CREATE TABLE pattern_analysis (
    id SERIAL PRIMARY KEY,
    utterance_text TEXT NOT NULL,
    vocabulary_words TEXT[],
    multi_word_phrases TEXT[],
    grammatical_pattern TEXT,
    tier_category VARCHAR(50),
    lifecycle_stage VARCHAR(50),
    total_lessons INT,
    lesson_distribution JSONB,
    simple_structure TEXT,
    functional_category VARCHAR(50),
    template_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(utterance_text)
); 