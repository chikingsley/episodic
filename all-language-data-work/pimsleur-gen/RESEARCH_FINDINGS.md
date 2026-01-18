# Pimsleur Method: Manual Analysis Findings

**Date:** December 29, 2025
**Method:** Manual reading of all 30 French Level 1 timestamped transcripts
**Status:** Ground truth established for French; cross-language validation confirms universality

---

## Executive Summary

This document presents findings from a **manual review** of all 30 Pimsleur French Level 1 lessons. Unlike previous automated analysis (archived in `archive/automated-analysis-20251126/`), these findings are based on direct reading of transcripts with consistent counting methodology.

**Key findings:**
1. The course has **4 distinct phases**, not 2
2. The L22 transition is **real and explicitly announced** in the audio
3. Backchaining doesn't disappear after early lessons - it **spikes at L11** for numbers
4. The "algorithm" is **scaffolding removal**, not just move sequences

---

## 1. The Four Phases

### Phase 1: Foundation (Lessons 1-8)
- **Backchaining:** Heavy in L1 (7 instances), decays to 0 by L6
- **French instructions:** Zero
- **Reading:** None
- **Narration:** 100% English
- **Focus:** Pronunciation via backchaining, basic vocabulary, role-play introduction

### Phase 2: Multimodal Build (Lessons 9-21)
- **Backchaining:** Returns and spikes at L11-17 (8-10 instances per lesson) for number vocabulary
- **French instructions:** Creep in gradually (2 → 15 per lesson)
- **Reading:** Introduced at L9
- **Narration:** Mixed English/French
- **Focus:** Numbers, arithmetic drills, expanding vocabulary, reading skills

### Phase 3: Instruction Flip (Lessons 22-27)
- **Backchaining:** Continues at 3-7 per lesson
- **French instructions:** Jumps to 80+ at L22, stabilizes at 40-50
- **Reading:** Intermittent
- **Narration:** Primarily French
- **Focus:** Comprehension without translation, directions, numbers 70-100

### Phase 4: Register & Tense (Lessons 28-30)
- **Backchaining:** Continues at 5 per lesson
- **French instructions:** 40-50 per lesson
- **Key introductions:**
  - L28: Tu/vous distinction (same conversation played in both registers)
  - L29: Past tense (j'ai acheté, j'ai mangé)
  - L30: Complex past with être (arrivé, allé)

---

## 2. Backchaining Pattern (Corrected)

Previous analysis claimed backchaining decays monotonically. **This is wrong.**

| Lesson Range | Backchaining Count | Notes |
|--------------|-------------------|-------|
| L1 | 7 | Heavy for core vocabulary |
| L2-5 | 5 → 2 | Gradual decay |
| L6-10 | 0 | Disappears |
| L11-17 | **8-10** | SPIKES for number vocabulary |
| L18-30 | 4-8 | Continues throughout |

**Key insight:** Backchaining is used whenever complex new phonetic material is introduced, not just in early lessons. The number vocabulary (onze, douze, treize... soixante-dix, quatre-vingts) gets full backchaining treatment.

---

## 3. The L22 Transition (Verified)

### What the narrator actually says (L22, lines 5-32):

> "Pas de conversation dans cette leçon. Pas de conversation."
>
> "Starting with this lesson, you'll receive more and more instructions in French... This is a necessary step to understanding and speaking French without translating from English. You may find it a little difficult at first."

### Cross-language validation:

| Language | L22 Announcement | French Instructions Jump |
|----------|------------------|-------------------------|
| French | Yes - explicit | 13 → 80+ |
| German | Yes - explicit | Similar pattern |
| Italian | Yes - explicit | Similar pattern |
| Spanish | Yes - observable | Similar pattern |

**Conclusion:** The L22 transition is a deliberate, universal Pimsleur design principle, not a French-specific artifact.

---

## 4. French Instructions Progression

| Lesson | French Instructions | Key Commands |
|--------|--------------------| -------------|
| 1-8 | 0 | None |
| 9 | 2 | Dites-moi |
| 10 | 2 | Écoutez cette conversation |
| 11-21 | 10-15 | Écoutez, Répétez, Écoutez et répétez |
| **22** | **80+** | Dites-moi, Demandez-moi, Répondez |
| 23-30 | 40-50 | Comment dit-on, Dites, Demandez |

---

## 5. Reading Introduction

Reading is NOT gradually introduced. It appears suddenly at L9:

| Lesson | Reading Section |
|--------|----------------|
| 1-8 | No |
| 9 | **First reading section** |
| 10-21 | Yes (consistent) |
| 22 | No |
| 23-27 | Intermittent |
| 28-30 | Intermittent |

---

## 6. Grammar & Vocabulary Progression

### Grammar milestones:
- **L3:** Gender system (américain/américaine)
- **L4:** Articles (le/la)
- **L5:** Conditional (voudrais)
- **L7:** Partitives (du/de la)
- **L11-17:** Number system (1-69)
- **L13:** "En" pronoun
- **L15:** Pouvoir/vouloir
- **L17:** "Si" vs "oui"
- **L19:** "Nous" conjugation
- **L22-27:** Numbers 70-100 (base-20 system)
- **L28:** Tu/vous register
- **L29:** Past tense (avoir)
- **L30:** Past tense (être)

### Vocabulary themes by phase:
- **L1-4:** Greetings, understanding, locations
- **L5-8:** Food, drink, preferences
- **L9-14:** Time, money, numbers (1-19)
- **L15-21:** Numbers (20-69), family, daily activities
- **L22-27:** Directions, travel, numbers (70-100)
- **L28-30:** Temporal expressions, past events

---

## 7. What This Means for Generation

The Pimsleur "algorithm" is not a sequence of move types. It's a **scaffolding removal schedule**:

1. **English support:** 100% → ~5% over 30 lessons
2. **Backchaining:** Applied to phonetically complex new material
3. **Reading:** Introduced at L9, maintained throughout
4. **Instruction language:** Flips at L22 (explicitly announced)
5. **Grammar:** Introduced implicitly through usage, rarely explained
6. **Vocabulary:** Themed by lesson, with spaced repetition across lessons

A working generator needs to model:
- When to apply backchaining (phonetic complexity)
- How much English scaffolding per lesson number
- Which vocabulary to introduce when (semantic themes)
- Spaced repetition intervals for review
- Grammar introduction order

---

## 8. Data Files

- **Structured metrics:** `data/french_lesson_metrics.json`
- **Raw transcripts:** `research-data/french/timestamped-transcripts/sentence-level/`
- **Archived automated analysis:** `archive/automated-analysis-20251126/`

---

## 9. What's Still Unknown

1. **Vocabulary selection principles:** Why these ~500 words? What's the selection criteria?
2. **Spaced repetition intervals:** When do specific phrases reappear across lessons?
3. **Grammar introduction rationale:** Why is past tense at L29, not earlier?
4. **Effectiveness:** Do lessons following these patterns actually teach?

---

## Appendix: Metrics Summary Table

| L | Back | FR Instr | Conv | Read | Major Event |
|---|------|----------|------|------|-------------|
| 1 | 7 | 0 | Yes | No | Core vocab backchaining |
| 2 | 5 | 0 | Yes | No | |
| 3 | 4 | 0 | Yes | No | Gender introduced |
| 4 | 3 | 0 | Yes | No | Articles introduced |
| 5 | 2 | 0 | Yes | No | Conditional (voudrais) |
| 6 | 0 | 0 | Yes | No | |
| 7 | 0 | 0 | Yes | No | Partitives |
| 8 | 0 | 0 | Yes | No | |
| 9 | 0 | 2 | Yes | **Yes** | Reading starts |
| 10 | 0 | 2 | Yes | Yes | Time-telling |
| 11 | **10** | 15 | Yes | Yes | Numbers spike |
| 12 | 8 | 12 | Yes | Yes | |
| 13 | 7 | 10 | Yes | Yes | "En" pronoun |
| 14 | 6 | 8 | Yes | Yes | |
| 15 | 5 | 12 | Yes | Yes | Arithmetic drills |
| 16 | 10 | 12 | Yes | Yes | |
| 17 | 10 | 10 | Yes | Yes | Si vs oui |
| 18 | 8 | 12 | Yes | Yes | Family vocab |
| 19 | 6 | 12 | Yes | Yes | "Nous" conjugation |
| 20 | 8 | 15 | Yes | Yes | Plurals |
| 21 | 5 | 13 | Yes | Yes | Last before flip |
| **22** | 4 | **80** | **No** | No | **INSTRUCTION FLIP** |
| 23 | 7 | 45 | No | Yes | 70s numbers |
| 24 | 3 | 45 | No | Yes | |
| 25 | 4 | 40 | Yes | Yes | 80s, pourquoi |
| 26 | 4 | 40 | No | No | |
| 27 | 4 | 50 | No | Yes | 90s, 100 |
| 28 | 5 | 40 | Yes | Yes | **TU/VOUS** |
| 29 | 5 | 40 | Yes | Yes | **PAST TENSE** |
| 30 | 5 | 50 | Yes | No | Complex past, finale |
