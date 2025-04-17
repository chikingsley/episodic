# Dark Mallard Backend Design Documentation

## 1. Introduction

This document outlines the backend architecture, database schema design, gamification mechanics, and event sourcing strategy for the Dark Mallard language learning application. The backend relies primarily on Convex for data persistence and real-time capabilities.

## 2. Backend Architecture & Schema Design

The database schema is designed using Convex and consists of several key tables to manage user data, learning content, and progress.

### 2.1. Core Data Tables

- **`Users`**: Stores user profile information and overall progress.
  - **Fields**:
    - `userId` (Primary Key): Unique identifier for the user.
    - `name`: User's display name.
    - `email`: User's email address (for login/communication).
    - `authInfo`: Authentication-related data.
    - `xp`: Accumulated experience points.
    - `level`: Current user level.
    - *Optional*: User settings.
  - **Example**: `{ id: "u123", name: "Alice", xp: 1500, level: 5, ... }`
  - **Cardinality**: One record per registered user.

- **`Words`**: A dictionary of vocabulary words used in the application.
  - **Fields**:
    - `wordId` (Primary Key): Unique identifier for the word.
    - `text`: The word itself.
    - `phonetic`: Phonetic spelling (e.g., IPA).
    - `audioUrl`: URL for pronunciation audio.
    - `language`: The language the word belongs to (e.g., "French").
    - *Optional*: Phoneme references, difficulty level, translations.
  - **Example**: `{ id: "w45", text: "bonjour", phonetic: "bɔ̃ʒuʀ", language: "French" }`

- **`Phonemes`**: Lists specific sounds, primarily for pronunciation training.
  - **Fields**:
    - `phonemeId` (Primary Key): Unique identifier for the phoneme.
    - `symbol`: Representation (e.g., IPA symbol).
    - `exampleWords`: Words containing the phoneme.
    - `description`: Explanation of the sound.
    - *Optional*: Embedding vector for ideal sound comparison.
  - **Example**: `{ id: "ph_nasal_ɔ̃", symbol: "ɔ̃", example: "bonjour", description: "French nasal O sound" }`

- **`Sentences`**: Stores full sentences or phrases used in lessons.
  - **Fields**:
    - `sentenceId` (Primary Key): Unique identifier for the sentence.
    - `text`: The sentence text.
    - `language`: The language of the sentence.
    - `wordIds`: List of `wordId`s contained in the sentence.
    - `translation`: Translation of the sentence.
    - `audioUrl`: URL for audio clip.
  - **Example**: `{ id: "s100", text: "Comment tu t’appelles ?", wordIds: ["w_comment", "w_tu", "w_t_appelles"], translation: "What is your name?" }`

- **`Exercises`**: Contains the learning activities presented to the user.
  - **Fields**:
    - `exerciseId` (Primary Key): Unique identifier for the exercise.
    - `type`: Type of exercise (e.g., `multiple_choice`, `translate`, `pronounce_word`, `listening`).
    - `contentId`: Reference to associated `wordId` or `sentenceId`.
    - `prompt`: Instructions or question for the user.
    - `correctAnswer`: The expected correct answer/target.
    - `targetPronunciation`: (For pronunciation) Embedding vector or criteria.
  - **Example**: `{ id: "ex987", type: "pronounce_word", contentId: "w45", targetText: "bonjour", targetPronunciation: [embedding_vector] }`

- **`Lessons` / `Modules`** (Optional): Organizes exercises into structured learning units.
  - **Fields**:
    - `lessonId` (Primary Key): Unique identifier for the lesson.
    - `title`: Name of the lesson.
    - `description`: Brief overview of the lesson content.
    - `exerciseIds`: Ordered list of `exerciseId`s included in the lesson.
  - **Example**: `{ id: "L1", title: "Greetings in French", exerciseIds: ["ex987", "ex988", ...] }`

### 2.2. User Progress & Event Tracking

- **`UserProgress`**: Tracks individual user progress on specific learning items (words or exercises).
  - **Fields**:
    - `userId`: Reference to the `Users` table.
    - `contentId`: Reference to `exerciseId` or `wordId`.
    - `completed`: Boolean indicating completion status.
    - `lastScore`: Score achieved on the last attempt.
    - `attemptCount`: Number of times the item was attempted.
    - `nextReview`: Timestamp for the next scheduled review (for Spaced Repetition).
    - *Optional*: `masteryScore`, `easeFactor`, `streakCount`.
  - **Example**: `{ userId: "u123", contentId: "ex987", completed: true, lastScore: 0.95, attemptCount: 3, nextReview: "2025-05-01T00:00:00Z" }`
  - **Cardinality**: Many records per user (one for each item interacted with).

- **`Events`**: Logs significant user actions for analytics, debugging, and event sourcing.
  - **Fields**:
    - `eventId` (Primary Key): Unique identifier for the event.
    - `userId`: Reference to the `Users` table.
    - `type`: Type of event (e.g., `exercise_attempt`, `level_up`, `word_learned`).
    - `timestamp`: Time the event occurred.
    - `details`: JSON object containing event-specific data (e.g., `{ exerciseId: "ex987", success: true }`).
  - **Example**: `{ id: "evt_456", userId: "u123", type: "exercise_attempt", timestamp: 1695312345, details: { exerciseId: "ex987", success: true } }`

### 2.3. Relationships

Relationships between tables are managed using stored IDs (e.g., `UserProgress.userId` references `Users.id`). Convex query functions are used to fetch related data as needed, as it does not perform automatic joins.

## 3. Gamification Mechanics

Gamification features enhance user engagement and provide measurable progress indicators.

### 3.1. XP and Leveling

- **Mechanism**: Users earn Experience Points (XP) for completing exercises or achieving milestones.
- **Storage**: Total XP is accumulated in the `xp` field of the `Users` table.
- **Leveling**:
  - Can be derived dynamically from XP based on predefined thresholds (e.g., 1000 XP = Level 2).
  - Alternatively, can be stored explicitly in the `level` field and incremented via Convex functions when XP thresholds are met.
- **Implementation**: A Convex function triggers upon exercise completion (logged in `Events`). This function updates the user's XP, checks for level-up conditions, logs a `level_up` event if applicable, and potentially unlocks new content.

### 3.2. Spaced Repetition System (SRS)

- **Purpose**: Reinforce memory by scheduling reviews of learned items at increasing intervals.
- **Mechanism**: The `nextReview` timestamp in the `UserProgress` table determines when an item is due for review.
- **Algorithm**: Based on user performance during reviews (correct/incorrect), the `nextReview` date is adjusted using an SRS algorithm (e.g., SM2, Leitner system, or custom intervals). Factors like `easeFactor` or `streakCount` can influence the interval.
- **Implementation**:
  - When a user practices an item, the associated `UserProgress` record's `nextReview` timestamp is updated.
  - The application queries Convex for items where `nextReview <= now()` for the current user to populate review sessions.
  - *Optional*: Convex scheduled jobs can be used for daily review reminders (push notifications/email).

### 3.3. Progress and Mastery

- **Purpose**: Track the user's proficiency with specific words or concepts.
- **Mechanism**: A `masteryScore` can be stored in `UserProgress` or derived from recent performance data in the `Events` log (e.g., success rate over the last N attempts).
- **Impact**: Higher mastery might reduce the frequency of an item appearing in reviews or unlock more advanced content.
- **Implementation**: Update the `masteryScore` field (if used) after each relevant interaction, or calculate it on-the-fly from the `Events` table when needed.

## 4. Event Sourcing

- **Concept**: The canonical source of truth for the application state is the chronological log of events (`Events` table), rather than the current derived state (like total XP).
- **Approach**: A hybrid model is used:
  - **Event Log**: All significant state changes (XP gain, exercise completion, answer given, level up) are recorded as immutable events in the `Events` table.
  - **Derived State**: Key state variables (like `Users.xp`, `Users.level`, `UserProgress.nextReview`) are stored directly for efficient querying and real-time updates. These are updated in tandem with event logging.
- **Benefits**:
  - **Auditability & History**: Provides a complete history of user interactions.
  - **Reconstructability**: User state can be recalculated from the event log if derived state becomes corrupted or if logic changes need to be applied retroactively.
  - **Analytics**: The `Events` table serves as a rich data source for analyzing user behavior, identifying patterns, and improving the learning experience.
- **Implementation**: Convex functions handle both logging events to the `Events` table and updating the corresponding derived state fields in other tables within the same transaction where possible. Complex analysis of large event volumes might be offloaded (e.g., using tools like Airflow/DBT), but moderate analysis can be performed directly within Convex.