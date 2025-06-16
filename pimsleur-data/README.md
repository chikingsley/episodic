# Pimsleur French Curriculum Analysis

This project reverse-engineers Pimsleur's French teaching methodology to understand their sequencing logic, repetition patterns, and cognitive load management strategies.

## Project Structure

```markdown
pimsleur-data/
├── 01_raw_data/                    # Original data files
│   ├── transcripts/                # Lesson transcripts (.txt)
│   └── analysis_outputs/           # LLM analysis outputs
│       ├── explicit_phrases/       # Explicit teaching moments
│       └── utterances/             # All utterances analyzed
│
├── 02_scripts/                     # Analysis scripts
│   ├── extraction/                 # Data extraction from transcripts
│   │   ├── analyze_lessons.py     # Extract explicit phrases
│   │   └── analyze_lessons_v2.py  # Extract all utterances
│   ├── analysis/                   # Cross-lesson analysis
│   │   ├── cross_lesson_integration.py      # Main integration pipeline
│   │   ├── enhanced_template_extraction.py  # Template pattern detection
│   │   └── cognitive_load_analysis.py       # Cognitive load metrics
│   └── utilities/                  # Helper scripts
│
├── 03_phase1_analysis/             # Phase 1 results (Lessons 1-5)
│   ├── data/                       # Analysis outputs
│   │   ├── phrase_occurrences_lessons_1-5.csv
│   │   ├── cross_lesson_analysis_phase1.json
│   │   ├── template_analysis_report.json
│   │   └── cognitive_load_analysis.json
│   └── reports/                    # Summary reports
│       └── phase1_summary_report.md
│
├── 04_visualizations/              # Visualization components
│   └── pimsleur_algorithm_viz_archive.tsx
│
├── 05_documentation/               # Project documentation
│   ├── proposal_v3.md              # Current technical proposal
│   └── [other proposals]
│
└── 99_archive/                     # Archived/unused files
```

## Quick Start

### Phase 1 Analysis (Completed)

Analyzed lessons 1-5 to validate approach:

```bash
# Run cross-lesson integration
python 02_scripts/analysis/cross_lesson_integration.py

# Extract template patterns
python 02_scripts/analysis/enhanced_template_extraction.py

# Analyze cognitive load
python 02_scripts/analysis/cognitive_load_analysis.py
```

### Key Findings

- 278 unique phrases identified across 5 lessons
- High cognitive load (9.5-10/10) maintained throughout
- 68% of content is new introductions (front-loaded teaching)
- Clear template patterns for systematic language building

## Data Files

### Input Data

- **Transcripts**: `01_raw_data/transcripts/French_I_-_Lesson_XX_human_eval.txt`
- **Explicit Phrases**: `01_raw_data/analysis_outputs/explicit_phrases/`
- **Utterances**: `01_raw_data/analysis_outputs/utterances/`

### Analysis Outputs

- **Phrase Tracking**: `03_phase1_analysis/data/phrase_occurrences_lessons_1-5.csv`
- **Cross-Lesson Report**: `03_phase1_analysis/data/cross_lesson_analysis_phase1.json`
- **Template Patterns**: `03_phase1_analysis/data/template_analysis_report.json`
- **Cognitive Load**: `03_phase1_analysis/data/cognitive_load_analysis.json`

## Next Steps

### Phase 2: Extended Analysis

1. Complete utterance extraction for lessons 11-30
2. Extend analysis to full 30 lessons
3. Migrate to PostgreSQL for larger dataset
4. Implement within-lesson temporal analysis

### Phase 3: Cross-Level Validation

1. Apply methodology to French levels II-V
2. Validate patterns across language levels
3. Test on Spanish I-V for cross-language validation

## Technical Details

See `05_documentation/proposal_v3.md` for comprehensive technical documentation including:

- Data integration pipeline architecture
- Three-tier deduplication strategy
- Lifecycle tracking methodology
- Cognitive load metrics definition
- Template extraction algorithms

## Dependencies

- Python 3.8+
- Optional: spaCy (for lemmatization)
- Optional: lingua-language-detector
- Mistral API access (for initial extraction)

## Contact

For questions or contributions, please refer to the documentation in `05_documentation/`.
