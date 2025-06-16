# Pimsleur Analysis Pipeline v3.2 — Current State Assessment & Next Steps

## Executive Summary

This document assesses the current state of the Pimsleur analysis project following initial Phase 1 completion and outlines the migration to Supabase PostgreSQL. Key findings from Phase 1 revealed several critical issues that must be addressed before scaling to additional lessons.

## Current State Assessment

### ✅ What's Working Well
1. **Project Structure**: Successfully reorganized into clear folder hierarchy
2. **Phase 1 Analysis**: Completed for lessons 1-5 with valuable insights
3. **Template Extraction**: 17 unique templates discovered
4. **Database Schema**: Well-designed schema.sql ready for Supabase

### ❌ Critical Issues to Fix

#### 1. **Repetition Density Bug**
- **Current**: All lessons show 1.0x density (impossible if practice occurs)
- **Root Cause**: Calculation uses unique phrases instead of total occurrences
- **Fix Required**: `repetition_density = total_utterances / unique_phrases`

#### 2. **Missing Position Tracking**
- **Current**: No lesson number or position in CSV outputs
- **Impact**: Cannot properly track phrase progression
- **Fix Required**: Add `lesson` and `position_in_lesson` columns

#### 3. **Flawed New/Review Classification**
- **Current**: All phrases marked as "introduction" in their lifecycle
- **Root Cause**: No cross-lesson phrase tracking
- **Fix Required**: Implement proper `seen_phrases` set or database table

#### 4. **Cognitive Load Miscalibration**
- **Current**: All lessons show 9.5-10/10 (unrealistic)
- **Issues**:
  - Formula doesn't account for review reducing load
  - New vs familiar distinction not working
- **Fix Required**: 
  ```python
  load_score = new_items + 0.3 * review_items
  novelty_ratio = new_items / (new_items + review_items)
  ```

#### 5. **Template Complexity Default**
- **Current**: Many templates default to complexity "8"
- **Root Cause**: Fallback value masks parsing failures
- **Fix Required**: Log failed templates, remove default

### 📊 Database Migration Status

#### Schema Design (Complete) ✅
```sql
lessons -> utterances -> phrase_occurrences <- phrases
                    \                      /
                     cognitive_load   templates
```

#### Migration Readiness
- ✅ Schema.sql created with proper relationships
- ✅ .env file with Supabase credentials
- ❌ Scripts still using CSV/JSON outputs
- ❌ No data loader implemented
- ❌ No caching for LLM calls

## Prioritized Action Plan

### Phase 1.5: Fix Critical Issues (Before Database Migration)

#### Priority 1: Data Quality Fixes
1. **Fix position tracking** (2 hours)
   - Update `analyze_lessons_phrases.py` to include lesson/position
   - Update `analyze_lessons_utterances.py` to track `idx_in_lesson`
   
2. **Fix repetition density** (1 hour)
   - Update calculation in `cognitive_load_analysis.py`
   - Add unit test to verify density > 1.0

3. **Implement proper new/review tracking** (3 hours)
   - Add `seen_phrases` tracking in `cross_lesson_integration.py`
   - Update lifecycle calculation logic
   - Mark first occurrence as `is_new=True`, later as `is_review=True`

4. **Recalibrate cognitive load** (2 hours)
   - Implement new formula with review weight
   - Split new items into core vs derived
   - Remove or reduce front-loading bias

#### Priority 2: Database Migration Prep
5. **Create unified schema** (2 hours)
   - Define `UnifiedUtterance` dataclass
   - Standardize all outputs to single format
   
6. **Build database loader** (4 hours)
   - Create `load_to_supabase.py` script
   - Handle existing CSV/JSON data
   - Add transaction wrapping for safety

### Phase 2: Supabase Migration

#### Database Operations
7. **Apply schema to Supabase** (1 hour)
   - Use MCP tool or SQL editor
   - Verify all tables created correctly

8. **Implement caching** (2 hours)
   - Create `llm_cache` table
   - Check before API calls
   - Store prompt hash + response

9. **Refactor scripts for DB** (6 hours)
   - Update all scripts to read/write from Supabase
   - Remove CSV/JSON intermediate files
   - Add proper error handling

#### Quality Assurance
10. **Add comprehensive tests** (3 hours)
    - Test repetition density calculation
    - Test new/review classification
    - Test cognitive load metrics

11. **Implement audit feature** (1 hour)
    - Add `--audit-sample 0.1` flag
    - Random sample for human review

### Phase 3: Scale to Full Dataset

12. **Process remaining lessons** (4 hours)
    - Run utterance extraction for lessons 11-30
    - Verify data quality at each step
    - Monitor for edge cases

13. **Performance optimization** (2 hours)
    - Batch database operations
    - Add indices for common queries
    - Profile and optimize slow queries

## Technical Decisions

### Database Connection Strategy
```python
# Using psycopg2 for direct PostgreSQL access
import psycopg2
from psycopg2.extras import RealDictCursor

# Connection from .env
DATABASE_URL = os.getenv('SUPABASE_DB_URL')
```

### ORM vs Direct SQL
- **Recommendation**: Start with direct SQL for clarity
- **Future**: Consider SQLAlchemy once patterns stabilize

### Data Pipeline Architecture
```
Transcripts → Extract → Validate → Load → Analyze → Report
                ↓                    ↓
            LLM Cache           Supabase DB
```

## Questions for Clarification

1. **MCP Server Usage**: Should we integrate with your local MCP server for database operations, or use standard Python libraries?

2. **Existing Data**: Should we migrate all Phase 1 CSV/JSON data to Supabase, or re-run analysis from scratch?

3. **LLM Caching Strategy**: Cache all LLM calls, or only expensive ones (e.g., full utterance analysis)?

4. **Audit Workflow**: For the 10% manual audit, should this output to console, separate file, or database table?

5. **Testing Database**: Create separate test schema in same Supabase instance, or use SQLite for tests?

## Immediate Next Steps

1. **Today**: Fix repetition density calculation (Issue #1)
2. **Tomorrow**: Add position tracking to extraction scripts
3. **This Week**: Complete all Priority 1 fixes
4. **Next Week**: Begin Supabase migration

## Success Metrics

- [ ] Repetition density > 1.0 for lessons with practice
- [ ] Cognitive load scores show realistic progression (4-8 range)
- [ ] 90%+ phrases correctly classified as new/review
- [ ] All data trackable to source (lesson + position)
- [ ] Database load time < 5 minutes for 30 lessons
- [ ] Zero data loss during migration

## Risk Mitigation

1. **Data Loss**: Keep CSV backups until DB proven stable
2. **API Costs**: Implement caching before re-running extractions
3. **Schema Changes**: Use migrations, not direct SQL edits
4. **Performance**: Add indexes before scaling to 30 lessons

---

**Recommendation**: Fix critical issues (#1-4) before database migration. The current metrics are misleading and will propagate errors if we migrate as-is. Once fixed, the Supabase migration will provide a solid foundation for scaling to the full curriculum analysis.