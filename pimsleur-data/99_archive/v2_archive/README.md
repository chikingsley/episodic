# Archive Directory

This directory contains scripts that are no longer in active use but are preserved for reference.

## CSV-Based Scripts (Replaced by Database-First Versions)

### Extraction Scripts
- `analyze_lessons_utterances.py` - Original utterance extraction (→ `analyze_lessons_utterances_db.py`)
- `analyze_lessons_phrases.py` - Original phrase extraction (→ `analyze_lessons_phrases_db.py`)

### Analysis Scripts  
- `cross_lesson_integration.py` - Original cross-lesson analysis
- `cross_lesson_integration_v2.py` - Fixed version with position tracking (→ `cross_lesson_integration_db.py`)

### Test and Demo Scripts
- `test_fixes.py` - Validation tests for Phase 1.5 fixes
- `test_with_existing_data.py` - Workaround for slow LLM extraction during testing
- `demonstrate_fixes.py` - Demonstration script for showing improvements

## Database Loading Scripts (Replaced by Production Pipeline)
- `load_fixed_data_postgres.py` - Initial PostgreSQL data loader
- `load_fixed_data_to_supabase.py` - Failed Supabase API approach

## Why Archived
These scripts were replaced during the transition from CSV/JSON-based workflows to database-first architecture. The archived scripts:

1. **CSV-based scripts**: Used file I/O for data exchange, replaced by direct database operations
2. **Test scripts**: Were for validating the Phase 1.5 fixes, no longer needed after validation
3. **Temporary loaders**: Were for initial data loading, replaced by the production pipeline

## Active Production Scripts
The current production-ready scripts are:
- `../db/database_writer.py` - Core database utilities
- `../extraction/analyze_lessons_utterances_db.py` - Production utterance extraction
- `../extraction/analyze_lessons_phrases_db.py` - Production phrase extraction
- `../analysis/cross_lesson_integration_db.py` - Production cross-lesson analysis
- `../production_pipeline.py` - Master orchestration script

## Recovery Notes
If needed, these archived scripts can be used as reference for:
- Understanding the evolution of the analysis approach
- Recovering specific algorithms or logic
- Comparing CSV-based vs database-first implementations