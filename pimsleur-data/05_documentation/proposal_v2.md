# Next Steps for Pimsleur Lesson Analysis

This document outlines a revised, iterative roadmap for the analysis of Pimsleur lesson transcripts. The core principle is to first generate high-quality, foundational data by analyzing each lesson in complete isolation, and only then perform a second-stage analysis to derive cross-lesson insights like vocabulary progression and novelty.

This "good data first" approach ensures our analysis is robust, verifiable, and modular.

---

### **Step 1 (Current Focus): Isolated Utterance Analysis**

The goal of this step is to analyze every French utterance from a student (Male/Female Speaker) and categorize its pedagogical function based *only on the context available within that single lesson*.

- **Methodology**:
    1. The `analyze_lessons.py` script will be overhauled.
    2. It will process each lesson transcript **independently**.
    3. For each lesson, it will send the full transcript to the Mistral API with a carefully designed prompt. The prompt will instruct the LLM to analyze utterances in isolation, without making assumptions about knowledge from prior lessons.

- **Data Model & Output**:
    The script will generate one comprehensive CSV file per lesson (e.g., `Lesson_01_utterance_analysis.csv`). Each row will represent a single French utterance from a student and will contain the following data points:
  - `utterance_text`: The verbatim French phrase.
  - `speaker`: Who said it ('Male Speaker' or 'Female Speaker').
  - `utterance_type`: The pedagogical function of the line, defined as:
    - **`DirectRepetition`**: Repeating a phrase just provided by the narrator (e.g., after "Listen and repeat...").
    - **`PromptedRecall`**: Responding to a direct narrator question or prompt (e.g., "Say 'I don't know'").
    - **`ConversationalExchange`**: A more "natural" line within a simulated dialogue that is not an immediate, direct response to a narrator cue.
    - **`SimpleResponse`**: Short, common conversational glue like "Oui, Monsieur," or "D'accord."
  - `narrator_cue`: The specific text of the narrator's line that prompted the student's utterance, if applicable.
  - `core_lemmas`: A list of the base (lemmatized) forms of the words in the utterance. This will be the foundation for our future progression analysis, replacing imprecise n-grams.

---

### **Step 2 (Future Work): Cross-Lesson Progression & Novelty Analysis**

This step will be implemented as a new, separate script that runs *after* the Step 1 analysis has been completed for all lessons.

- **Methodology**:
    1. The new script will ingest all the `*_utterance_analysis.csv` files generated in Step 1.
    2. It will programmatically build a master timeline of all `core_lemmas`, noting the exact lesson and context of their first appearance.
    3. With this timeline, it will then iterate back through the data for each lesson, accurately determining the novelty status of every utterance.

- **Analysis & Outputs**: This script will produce the high-level strategic insights:
    1. **Enriched Dataset**: It will generate a final, comprehensive dataset (or update the existing CSVs) by adding the crucial `novelty_status` column:
        - **`FirstAppearance`**: The utterance contains a core lemma being introduced for the very first time.
        - **`Review`**: The utterance is composed entirely of previously seen lemmas.
        - **`Composition`**: The utterance is a new sentence that combines multiple, previously-taught lemmas in a novel way.
    2. **SRS Heatmap**: It will generate the data required for a heatmap visualizing the spaced repetition schedule, with lemmas on one axis and lessons on the other.
    3. **Pedagogical Structure Report**: It will create summary statistics and visualizations showing how the lesson structure (the distribution of `utterance_type` and `novelty_status`) evolves from early to later lessons.

This revised, two-step plan ensures a clean separation of concerns and will produce a much more accurate and insightful final analysis.

Let me know if this revised plan aligns with your vision. If so, I will begin implementing **Step 1**.
