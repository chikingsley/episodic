# Dark Mallard - Convex DB Setup Checklist (v0.2)

This document outlines the database schema and related logic for the Dark Mallard language learning project, intended for setup with ConvexDB.

*(Note: All IDs are typically `Id<"tableName">` in Convex unless specified otherwise. Timestamps are `number` (Unix epoch ms). Foreign keys imply storing the `Id` of the related document.)*

---

## 1. Database Schema Checklist

This section details the tables (collections in Convex) required.

### 1.1 Author-Side Content

These tables store the core learning content.

- [ ] **`languages` Table**
  - `_id`: `Id<"languages">` (Primary Key)
  - `code`: `string` (e.g., "fr", "en")
  - `name`: `string` (e.g., "French", "English")

- [ ] **`sections` Table**
  - `_id`: `Id<"sections">` (Primary Key)
  - `languageId`: `Id<"languages">` (Foreign Key to `languages`)
  - `ordinal`: `number` (Order within the language)
  - `title`: `string`
  - `cefBand`: `string` (e.g., "A1", "B2")

- [ ] **`units` Table**
  - `_id`: `Id<"units">` (Primary Key)
  - `sectionId`: `Id<"sections">` (Foreign Key to `sections`)
  - `ordinal`: `number` (Order within the section)
  - `title`: `string`
  - `icon`: `string` (Optional: URL or identifier for an icon)

- [ ] **`lessons` Table**
  - `_id`: `Id<"lessons">` (Primary Key)
  - `unitId`: `Id<"units">` (Foreign Key to `units`)
  - `ordinal`: `number` (Order within the unit)
  - `type`: `string` (Enum: "core", "audio", "speaking")
  - `title`: `string`

- [ ] **`exercises` Table**
    *Note: Atomic grain for Elo + HLR calculations.*
  - `_id`: `Id<"exercises">` (Primary Key, `ex_id` in original)
  - `lessonId`: `Id<"lessons">` (Foreign Key to `lessons`)
  - `phase`: `string` (or `number`, depending on meaning)
  - `templateId`: `string` (Identifier for the exercise UI/logic template)
  - `jsonPayload`: `any` (Convex `any` type for flexible JSON structure)
  - `conceptTags`: `Array<string>` (List of associated concept slugs or IDs)

- [ ] **`tokens` Table**
    *Note: Vocabulary lexicon.*
  - `_id`: `Id<"tokens">` (Primary Key)
  - `languageId`: `Id<"languages">` (Foreign Key to `languages`)
  - `text`: `string` (The word or phrase)
  - `ipa`: `string` (Optional: International Phonetic Alphabet transcription)
  - `audioUrl`: `string` (Optional: URL to pronunciation audio)
  - `partOfSpeech`: `string` (Optional: e.g., "noun", "verb")

- [ ] **`concepts` Table**
    *Note: Allows editing/managing tags centrally.*
  - `_id`: `Id<"concepts">` (Primary Key)
  - `languageId`: `Id<"languages">` (Foreign Key to `languages`)
  - `slug`: `string` (Unique human-readable identifier, e.g., "past-tense")
  - `name`: `string` (Display name, e.g., "Past Tense")
  - `description`: `string` (Optional: Explanation of the concept)

- [ ] **`mediaAssets` Table** (Optional)
    *Note: Explicit table if storing media metadata directly.*
  - `_id`: `Id<"mediaAssets">` (Primary Key)
  - `fileUrl`: `string` (URL to the media file, consider Convex file storage)
  - `type`: `string` (Enum: "mp3", "png", etc.)
  - `durationMs`: `number` (Optional: Duration for audio/video)

### 1.2 User & Session

Tables related to user accounts and activity sessions.

- [ ] **`users` Table**
  - `_id`: `Id<"users">` (Primary Key)
  - `authProviderId`: `string` (Identifier from your auth provider, e.g., Clerk, Supabase Auth)
  - `createdAt`: `number` (Timestamp, `_creationTime` is automatic in Convex)

- [ ] **`sessions` Table**
    *Note: Grouping key for spacing algorithms.*
  - `_id`: `Id<"sessions">` (Primary Key)
  - `userId`: `Id<"users">` (Foreign Key to `users`)
  - `startedAt`: `number` (Timestamp when session began)
  - `deviceInfo`: `any` (Optional: Store device details as JSON)

- [ ] **`wallets` Table**
    *Note: Assumes one wallet per user.*
  - `_id`: `Id<"wallets">` (Primary Key)
  - `userId`: `Id<"users">` (Foreign Key to `users`, consider making this the `_id` if 1:1)
  - `gems`: `number` (In-app currency)
  - `hearts`: `number` (Lives/attempts)
  - `lastRefillAt`: `number` (Timestamp for hearts/energy system)

- [ ] **`streaks` Table**
    *Note: Assumes one streak record per user.*
  - `_id`: `Id<"streaks">` (Primary Key)
  - `userId`: `Id<"users">` (Foreign Key to `users`, consider making this the `_id` if 1:1)
  - `currentDays`: `number` (Current consecutive days)
  - `longest`: `number` (Longest streak achieved)
  - `lastDayDone`: `number` (Timestamp or YYYY-MM-DD of the last day completed)

### 1.3 Progress / Mastery

Tables tracking user learning progress and memory models.

- [ ] **`userLessons` Table**
    *Note: Tracks completion and performance per lesson.*
  - `_id`: `Id<"userLessons">` (Primary Key)
  - `userId`: `Id<"users">` (Foreign Key to `users`)
  - `lessonId`: `Id<"lessons">` (Foreign Key to `lessons`)
  - `xpGained`: `number`
  - `bestTier`: `string` (or `number`, e.g., "gold", 3 stars)
  - `completedAt`: `number` (Timestamp)
    *Index suggestion: `db.index("by_user_lesson", ["userId", "lessonId"])`*

- [ ] **`userExerciseEvents` Table** (Append-only)
    *Note: Raw log feeding Elo + HLR.*
  - `_id`: `Id<"userExerciseEvents">` (Primary Key)
  - `userId`: `Id<"users">`
  - `sessionId`: `Id<"sessions">`
  - `timestamp`: `number` (Event time, `_creationTime` might suffice)
  - `exerciseId`: `Id<"exercises">`
  - `itemId`: `string` (Specific item within the exercise, e.g., a specific word in a sentence, or audio prompt ID)
  - `conceptTags`: `Array<string>` (Concepts associated *at the time of the event*)
  - `exerciseType`: `string` (e.g., "multiple_choice", "speak", "listen")
  - `numOptions`: `number` (For multiple choice, etc.)
  - `responseMs`: `number` (Time taken to respond)
  - `correct`: `boolean` (Was the answer correct?)
    *Index suggestion: `db.index("by_user_timestamp", ["userId", "timestamp"])`*

- [ ] **`userTokens` Table** (Optional)
    *Note: Simplified tracking per vocabulary token.*
  - `_id`: `Id<"userTokens">` (Primary Key)
  - `userId`: `Id<"users">`
  - `tokenId`: `Id<"tokens">`
  - `seenCount`: `number`
  - `correctStreak`: `number`
  - `ease`: `number` (Easiness factor, if using simpler SRS)
    *Index suggestion: `db.index("by_user_token", ["userId", "tokenId"])`*

- [ ] **`userItemMemory` Table**
    *Note: Stores HLR (Half-Life Regression) parameters per user per item.*
  - `_id`: `Id<"userItemMemory">` (Primary Key)
  - `userId`: `Id<"users">`
  - `itemId`: `string` (Matches `itemId` in `userExerciseEvents`)
  - `lastSeenAt`: `number` (Timestamp)
  - `lastResult`: `boolean` (Correct/Incorrect)
  - `A`: `number` (HLR parameter A for this user/item combo)
  - `B`: `number` (HLR parameter B for this user/item combo)
  - `nextDueAt`: `number` (Timestamp when item should be reviewed)
    *Index suggestion: `db.index("by_user_item", ["userId", "itemId"])`*
    *Index suggestion: `db.index("by_user_due", ["userId", "nextDueAt"])`*

- [ ] **`eloUserGlobal` Table**
    *Note: Single overall Elo rating per user.*
  - `_id`: `Id<"eloUserGlobal">` (Primary Key)
  - `userId`: `Id<"users">` (Foreign Key to `users`, consider making this the `_id` if 1:1)
  - `elo`: `number`

- [ ] **`eloUserConcept` Table** (Optional - for Multivariate Elo)
    *Note: Elo rating per user per concept.*
  - `_id`: `Id<"eloUserConcept">` (Primary Key)
  - `userId`: `Id<"users">`
  - `conceptId`: `Id<"concepts">`
  - `elo`: `number`
    *Index suggestion: `db.index("by_user_concept", ["userId", "conceptId"])`*

### 1.4 Item / Concept Difficulty

Tables storing the calculated difficulty of items and concepts.

- [ ] **`eloItems` Table**
  - `_id`: `Id<"eloItems">` (Primary Key)
  - `itemId`: `string` (Matches `itemId` in `userExerciseEvents`, consider making this the `_id` if unique)
  - `elo`: `number`

- [ ] **`eloConcepts` Table**
  - `_id`: `Id<"eloConcepts">` (Primary Key)
  - `conceptId`: `Id<"concepts">` (Foreign Key to `concepts`, consider making this the `_id` if 1:1)
  - `elo`: `number`

- [ ] **`hlrItems` Table**
    *Note: Base HLR parameters per item (before user-specific adjustments).*
  - `_id`: `Id<"hlrItems">` (Primary Key)
  - `itemId`: `string` (Matches `itemId` in `userExerciseEvents`, consider making this the `_id` if unique)
  - `A`: `number` (Base HLR parameter A)
  - `B`: `number` (Base HLR parameter B)

### 1.5 Derived / Analytics (Optional - Batch Processing)

These might live outside the primary operational DB (e.g., in BigQuery or a separate analytics store), updated periodically.

- [ ] **`dailyUserStats` Table**
  - Composite Key: (`userId`, `date`)
  - `xp`: `number`
  - `reviewsDone`: `number`
  - `newItemsSeen`: `number`
  - `eloDelta`: `number`
  - `pRecallAvg`: `number` (Average predicted recall)

- [ ] **`leaderboardSnapshots` Table**
  - Composite Key: (`date`, `languageId`, `userId`) or (`date`, `languageId`, `eloRank`)
  - `userId`: `Id<"users">`
  - `eloRank`: `number`
  - `eloValue`: `number`

---

## 2. Additional Setup & Logic Checklist

Beyond the core schema, consider implementing the following logic:

- [ ] **Event Flow Implementation:**
  - Set up Convex HTTP endpoint (`learner-service` equivalent) to handle exercise requests and answers.
  - Implement Convex functions (`mutation` or `action`) for:
    - [ ] Elo updates (User & Item/Concept) based on `userExerciseEvents` (See Equations below).
    - [ ] HLR updates (`userItemMemory` and potentially `hlrItems`) based on `userExerciseEvents` (See Equations & Audio Recipe below).
    - [ ] Review scheduling (querying `userItemMemory` for due items).
    - [ ] Appending to `userExerciseEvents`.

- [ ] **Cold-Start Logic:**
  - When creating new users, items, or concepts, initialize their ratings/parameters:
    - `eloUserGlobal.elo`: 0
    - `eloItems.elo`: 0
    - `eloUserConcept.elo`: 0 (if using)
    - `eloConcepts.elo`: 0
    - `hlrItems.A`: 0 (corresponds to `log2(1 day)`)
    - `hlrItems.B`: 0.5 (or another small positive value)
    - `userItemMemory.A` / `userItemMemory.B`: Initialize based on `hlrItems` or defaults when first encountered.

- [ ] **HLR "Audio Track" Recipe (If applicable):**
  - [ ] Assign deterministic `itemId`s to each prompt within audio lessons (e.g., `fr-p1-u01-prompt-003`).
  - [ ] Ensure `userExerciseEvents` are emitted with these `itemId`s upon correct spoken response.
  - [ ] Implement scheduling logic to select next audio `itemId` based on `userItemMemory.nextDueAt` or P(recall) < 0.85 (using HLR equation).
  - [ ] Implement "rescue" logic for failed attempts (e.g., temporarily adjust `A`, schedule short-interval retries).

- [ ] **Nightly Replay (Optional):**
  - Set up a Convex scheduled function (`cron job`).
  - This function reads `userExerciseEvents` (e.g., for the previous day).
  - Re-calculates `eloItems.elo` and `eloConcepts.elo` based on the chronological order of events.
  - Updates the corresponding tables.
    *Purpose: Stabilizes difficulty ratings, especially with high event volume.*

- [ ] **Multivariate Elo (Optional):**
  - If enabled, ensure `conceptTags` are populated in `exercises` and copied to `userExerciseEvents`.
  - Implement the Concept-Elo update (Equation 4) alongside the standard Elo updates.
  - Requires the `eloUserConcept` and `eloConcepts` tables.

- [ ] **Complex HLR (Optional):**
  - If using personalized forgetting rates, store `theta` (θ_u) per user (e.g., in `users` or `eloUserGlobal`).
  - Modify the HLR recall probability calculation (Equation 5) to include `theta`. H_ui = 2^(A_i + B_i·θ_u).

---

## 3. Equations Reference

These are the core formulas for Elo and Half-Life Regression (HLR) calculations.

1. **Expected Correct Probability (E):**
    `E = 1/k + (1 - 1/k) * (1 / (1 + 10^((d_i - θ_u) / σ)))`
    *(Where `k`=number of choices (often 2 for correct/incorrect), `d_i`=item difficulty, `θ_u`=user skill, `σ`=scaling factor (often 400))*

2. **User Elo Update:**
    `θ_u ← θ_u + K * (correct - E)`
    *(Where `K`=K-factor (e.g., 32), `correct`=1 if correct, 0 if incorrect)*

3. **Item Elo Update:**
    `d_i ← d_i + K * (E - correct)`

4. **Concept-Elo Update (Multivariate):**
    `θ_u,c ← θ_u,c + α * K * (correct - E_c)`
    *(Where `θ_u,c`=user skill on concept c, `E_c`=expected score using concept Elo, `α`=learning rate for concepts)*

5. **HLR Recall Probability (P):**
    `p = exp( -Δt / H )`
    Where:
    - `Δt` = time elapsed since last review (in days)
    - `H` = Half-life (in days) = `2^(A + B * θ_u)`
        - *Standard HLR:* `A` and `B` from `hlrItems` table.
        - *Per-User HLR:* `A` and `B` from `userItemMemory` table.
        - *Complex HLR:* `H_ui = 2^(A_i + B_i * θ_u)` (using item A/B and user theta)
