# Pimsleur Analysis Pipeline v3.2 — Supabase Backend

A revised checklist for migrating our data analysis pipeline to a Supabase Postgres backend. The focus is on direct-to-database operations, replacing intermediate CSV/JSON files.

---

## Phase 1: Database Schema & Initial Data Model

This phase establishes the foundational tables in Supabase. We will use SQL DDL statements and the Supabase UI or `mcp_supabase_apply_migration` tool to create the schema.

**1. Define Core Tables**

- **Goal:** Create the initial tables to hold lessons, utterances, phrases, and analysis results.
- **Action:** Draft and execute SQL `CREATE TABLE` statements for the following:
  - `lessons`: Stores metadata for each lesson.
  - `utterances`: Stores each line from the transcripts, linked to a lesson, with its position. Includes columns for `lesson_id`, `position_in_lesson`, `speaker`, `text`, `language`.
  - `phrases`: Stores unique phrases extracted from utterances.
  - `phrase_occurrences`: Maps phrases to the utterances they appear in, with flags like `is_new` or `is_review`.
  - `cognitive_load`: Stores per-lesson analysis metrics like `load_score` and `novelty_ratio`.

**2. Create a `schema.sql` file**

- **Goal:** To store our schema definition.
- **Action:** Create a `pimsleur-data/02_scripts/db/schema.sql` and add the DDL for the tables.

---

## Phase 2: Refactor Analysis Scripts to Use Supabase

With the database schema in place, we refactor the Python scripts to read from and write to Supabase directly.

**3. Update `cross_lesson_integration.py`**

- **Goal:** Identify new vs. review phrases using the database.
- **Action:**
  - Modify the script to connect to Supabase.
  - Instead of an in-memory `seen_phrases` set, query the `phrases` table.
  - When a new phrase is found, insert it into `phrases`.
  - Record each appearance in `phrase_occurrences`.

**4. Update `cognitive_load_analysis.py`**

- **Goal:** Calculate and store cognitive load metrics in the database.
- **Action:**
  - Read phrase data from the `phrase_occurrences` table.
  - Calculate `load_score` and `novelty_ratio` for each lesson.
  - Write the results to the `cognitive_load` table.

**5. Update `enhanced_template_extraction.py`**

- **Goal:** Store extracted phrase templates in the database.
- **Action:**
  - Add a `templates` table to the schema.
  - Modify the script to write newly discovered templates to this table.

---

## Phase 3: Advanced Features & Productionizing

**6. Add Unit Tests with a Test Database**

- **Goal:** Ensure data integrity and correctness of the analysis logic.
- **Action:**
  - Set up a separate test database or schema in Supabase.
  - Write `pytest` tests that:
    - Populate the test DB with sample data.
    - Run analysis scripts.
    - Assert the correctness of the data written to the database (e.g., `repetition_density`, `is_review` flags).

**7. Implement a Manual Audit Feature**

- **Goal:** Enable quality assurance on the extracted data.
- **Action:**
  - Add a CLI flag (`--audit-sample-ratio 0.1`) to the main script.
  - When enabled, this will select a random sample of new phrases and print them for human review.

---

## Supabase Integration Notes

- **Connection:** Use the Supabase connection string for all database operations. The `supabase-mcp` tools can be used for schema migrations, or we can use the Supabase SQL editor for applying DDL from our `schema.sql`.
- **Credentials:** Store database credentials securely using a `.env` file and `python-dotenv`.
- **Client Libraries:** Use `psycopg2` for robust, direct Postgres access from Python scripts.

---

**Next Steps:** Begin with Phase 1, Item 1: Defining and creating the database schema.

# Dev Fix-It Checklist — Phase-1 Pipeline (Supabase Postgres Edition)

Each line is a single, testable change. Tackle in order; later fixes assume earlier ones are done.

---

## 1. Add position + lesson columns to explicit-phrase export

- **File:** `analyze_lessons_phrases.py` → writer  
- **New columns:** `lesson`, `utterance_idx` (0-based inside lesson)  
- **How:** Add these fields to your CSV/JSON export so each phrase is traceable to its lesson and position.

---

## 2. Capture within-lesson index during parsing

- **File:** `analyze_lessons_utterances.py`  
- **How:** Add `idx_in_lesson` property when iterating subtitles/transcript lines.

---

## 3. Create phrase-cache across lessons

- **How:** Maintain `seen_phrases: set[str]` in memory or in a Supabase Postgres table (e.g., `seen_phrases`).  
- **Purpose:** Mark each phrase occurrence as `new` only the first time it appears; afterwards, flag as `is_review`.

---

## 4. Re-compute cognitive-load metrics

- **Formula:**

  ```python
  load_score = new_items + 0.3 * review_items
  novelty_ratio = new_items / (new_items + review_items)
  ```

- **How:** Store both per lesson in `cognitive_load_analysis` (CSV/JSON or Supabase table).

---

## 5. Fix repetition_density calculation

- **How:** Use `total_utterances / unique_phrases` inside the lesson.
- **Test:** Expect density > 1.0 when practice happens.

---

## 6. Split "new introductions" counters

- **Add fields:**
  - `core_introductions` = first-time template or lemma
  - `derived_phrases` = surface variants built from existing templates

---

## 7. Repair template-complexity fallback

- **How:** Investigate `calculate_template_complexity`; remove default "8" return.
- **Test:** Log templates that fail parsing; write unit test with known patterns.

---

## 8. Unify output schema (temporary pre-DB)

- **How:** Create `UnifiedUtterance` CSV/JSON with columns: `lesson`, `utterance_idx`, `speaker`, `text`, `lang`, `is_explicit`, `template_id`, `phrase_id`

---

## 9. Draft DB models + migrations (Supabase Postgres)

- **How:**
  - Use SQLAlchemy or Alembic to define models and generate migrations.
  - Target your Supabase Postgres instance (use the connection string from your Supabase dashboard).
  - Example: `DATABASE_URL = "postgresql://postgres:<password>@<host>:<port>/postgres"`
  - Use Alembic for migrations, or Supabase SQL editor for manual DDL.

---

## 10. Write loader script

- **How:**
  - ETL existing CSV/JSON into Supabase Postgres via SQLAlchemy bulk insert or Supabase Python client.
  - Transaction-wrap; truncate tables on rerun for idempotency.

---

## 11. Cache raw LLM calls

- **How:**
  - Create a `raw_llm` table in Supabase: `(utterance_id, prompt_hash, response_json)`
  - Check cache before hitting the API.

---

## 12. Unit tests (pytest)

- **Tests:**
  - Mini transcript with repeats → assert `repetition_density > 1`.
  - Phrase that reappears in later lesson → assert `is_review == True`.

---

## 13. Add a 10% manual audit toggle

- **How:**
  - CLI flag `--sample-audit 0.1` to dump random 10% of new phrases for human check.

---

## Delivery order suggestion

**1–6** = metric correctness  
**7** = quality guardrail  
**8** = staging for DB  
**9–12** = DB migration & stability  
**13** = ongoing QA

---

## Supabase-specific notes

- Use your Supabase project's connection string for all DB access.
- You can use the Supabase SQL editor for quick schema tweaks, but for production, prefer Alembic migrations.
- For Python, use `psycopg2` or `asyncpg` for direct Postgres access, or the supabase-py client for higher-level operations.

---

**Ping me once #1–#6 are green; we'll recalibrate the load curves before you scale to Lessons 6–10.**
