# Phase 1.5 Implementation Guide: Critical Fixes

This guide provides specific code changes needed to fix the critical issues before migrating to Supabase.

## Fix 1: Add Position Tracking to Extraction Scripts

### 1A. Update analyze_lessons_utterances.py

Add position tracking when processing utterances:

```python
# Around line 250 where utterances are processed
@dataclass
class UtteranceAnalysis:
    lesson_number: int  # NEW
    position_in_lesson: int  # NEW
    utterance_text: str
    speaker: str
    utterance_type: str
    narrator_cue: str
    core_lemmas: List[str]

# In the process_lesson function, add:
def process_lesson(lesson_path: pathlib.Path) -> List[UtteranceAnalysis]:
    # Extract lesson number from filename
    lesson_num = int(lesson_path.stem.split("_")[3])  # "French_I_-_Lesson_01" -> 1
    
    # When iterating utterances:
    position = 0
    for utterance in utterances:
        position += 1
        analysis = UtteranceAnalysis(
            lesson_number=lesson_num,
            position_in_lesson=position,
            # ... rest of fields
        )

# Update CSV writer to include new columns
fieldnames = ['lesson_number', 'position_in_lesson', 'utterance_text', ...]
```

### 1B. Update analyze_lessons_phrases.py

Similar changes for explicit phrases:

```python
@dataclass
class ExplicitPhrase:
    lesson_number: int  # NEW
    position_in_lesson: int  # NEW
    phrase: str
    teaching_cue: str
    context: str
    speaker_response: str

# Track position when extracting phrases
position = 0
for phrase_data in extracted_phrases:
    position += 1
    # ... create ExplicitPhrase with position
```

## Fix 2: Correct Repetition Density Calculation

### Update cognitive_load_analysis.py

```python
# Current (WRONG):
metrics.repetition_density = metrics.total_french_items / metrics.unique_french_items

# Fixed:
# First, count actual repetitions within the lesson
utterance_counts = defaultdict(int)
for utterance in lesson_utterances:
    normalized = normalize_text(utterance.text)
    utterance_counts[normalized] += 1

# Calculate density as average repetitions per unique phrase
total_utterances = sum(utterance_counts.values())
unique_phrases = len(utterance_counts)
metrics.repetition_density = total_utterances / unique_phrases if unique_phrases > 0 else 1.0

# Alternatively, measure how many phrases appear more than once
repeated_phrases = sum(1 for count in utterance_counts.values() if count > 1)
metrics.repetition_rate = repeated_phrases / unique_phrases if unique_phrases > 0 else 0.0
```

## Fix 3: Implement Proper New/Review Tracking

### Update cross_lesson_integration.py

```python
class CrossLessonAnalyzer:
    def __init__(self):
        self.seen_phrases = set()  # Global tracker across all lessons
        self.phrase_first_seen = {}  # phrase -> (lesson, position)
    
    def process_lessons_sequentially(self):
        """Process lessons in order to track new vs review"""
        # MUST process in lesson order!
        for lesson_num in sorted(self.lessons):
            self.process_lesson(lesson_num)
    
    def process_phrase(self, phrase: str, lesson: int, position: int):
        normalized = normalize_text(phrase)
        
        if normalized not in self.seen_phrases:
            # First time seeing this phrase
            self.seen_phrases.add(normalized)
            self.phrase_first_seen[normalized] = (lesson, position)
            return {
                'is_new': True,
                'is_review': False,
                'first_seen_lesson': lesson,
                'first_seen_position': position
            }
        else:
            # Seen before - check if it's review
            first_lesson, first_pos = self.phrase_first_seen[normalized]
            lessons_gap = lesson - first_lesson
            
            return {
                'is_new': False,
                'is_review': lessons_gap >= 2,  # Review if 2+ lessons gap
                'is_repetition': lessons_gap == 0,  # Same lesson repetition
                'is_reinforcement': lessons_gap == 1,  # Next lesson reinforcement
                'first_seen_lesson': first_lesson,
                'lessons_since_introduction': lessons_gap
            }
```

## Fix 4: Recalibrate Cognitive Load Metrics

### Update cognitive_load_analysis.py formula

```python
def calculate_cognitive_load(self, lesson_metrics):
    """Calculate cognitive load with proper weighting"""
    
    # Count different types of items
    new_items = lesson_metrics.new_items
    repetitions = lesson_metrics.same_lesson_repetitions  
    reinforcements = lesson_metrics.next_lesson_reinforcements
    reviews = lesson_metrics.spaced_reviews
    
    # Weighted formula - reviews reduce cognitive load
    cognitive_load = (
        new_items * 1.0 +           # New items have full weight
        repetitions * 0.1 +         # Same-lesson reps have minimal load
        reinforcements * 0.3 +      # Next-lesson items have moderate load
        reviews * 0.2               # Spaced reviews have low load
    )
    
    # Normalize to 0-10 scale based on expected ranges
    # Assume 20-60 new items is typical range
    normalized_load = (cognitive_load / 40) * 10  
    
    return min(10, max(0, normalized_load))  # Clamp to 0-10

def calculate_novelty_ratio(self, lesson_metrics):
    """Calculate true novelty ratio"""
    total_items = (
        lesson_metrics.new_items + 
        lesson_metrics.repetitions + 
        lesson_metrics.reinforcements + 
        lesson_metrics.reviews
    )
    
    if total_items == 0:
        return 0.0
        
    # Only truly new items count toward novelty
    return lesson_metrics.new_items / total_items
```

## Fix 5: Remove Template Complexity Fallback

### Update enhanced_template_extraction.py

```python
def calculate_template_complexity(self, template: str) -> Optional[int]:
    """Calculate complexity without fallback default"""
    
    try:
        # Existing complexity calculation logic
        complexity = 0
        
        # ... calculation code ...
        
        if complexity == 0:
            # Log for debugging instead of defaulting
            print(f"Warning: Zero complexity for template: {template}")
            return None  # Return None instead of default 8
            
        return complexity
        
    except Exception as e:
        print(f"Error calculating complexity for {template}: {e}")
        return None  # Return None to indicate failure

# In the main processing:
complexity = calculate_template_complexity(template)
if complexity is None:
    # Track failed templates for manual review
    failed_templates.append(template)
    complexity = 0  # Use 0 for database, not 8
```

## Testing Requirements

Create `test_fixes.py`:

```python
import pytest
from pathlib import Path

def test_repetition_density():
    """Verify repetition density > 1.0 for lessons with practice"""
    # Create test data with known repetitions
    test_utterances = [
        "Bonjour",
        "Bonjour",  # Repetition
        "Comment allez-vous?",
        "Comment allez-vous?",  # Repetition
        "Très bien"
    ]
    
    density = calculate_repetition_density(test_utterances)
    assert density == 5/3  # 5 total, 3 unique = 1.67
    assert density > 1.0

def test_new_vs_review_classification():
    """Verify correct classification of new vs review"""
    analyzer = CrossLessonAnalyzer()
    
    # Lesson 1: introduce phrase
    result1 = analyzer.process_phrase("Bonjour", lesson=1, position=10)
    assert result1['is_new'] == True
    assert result1['is_review'] == False
    
    # Lesson 2: reinforcement (not review yet)
    result2 = analyzer.process_phrase("Bonjour", lesson=2, position=5)
    assert result2['is_new'] == False
    assert result2['is_review'] == False
    assert result2['is_reinforcement'] == True
    
    # Lesson 4: spaced review
    result3 = analyzer.process_phrase("Bonjour", lesson=4, position=20)
    assert result3['is_new'] == False
    assert result3['is_review'] == True

def test_cognitive_load_range():
    """Verify cognitive load in reasonable range"""
    # Typical lesson metrics
    metrics = LessonMetrics(
        new_items=30,
        repetitions=40,
        reinforcements=15,
        reviews=10
    )
    
    load = calculate_cognitive_load(metrics)
    assert 3.0 <= load <= 8.0  # Reasonable range, not 9.5-10
```

## Validation Checklist

Before proceeding to database migration:

- [ ] All utterance CSVs include lesson_number and position_in_lesson
- [ ] All phrase CSVs include lesson_number and position_in_lesson  
- [ ] Repetition density > 1.0 for at least 50% of lessons
- [ ] Cognitive load scores distributed between 3-8 (not all 9.5-10)
- [ ] At least 20% of phrases marked as review in lessons 3-5
- [ ] No template complexities defaulting to 8
- [ ] All tests passing
- [ ] Manual spot-check of 10 phrases confirms new/review accuracy

## Quick Test Commands

```bash
# Test individual fixes
python -m pytest test_fixes.py::test_repetition_density -v
python -m pytest test_fixes.py::test_new_vs_review_classification -v

# Re-run analysis on lesson 1 with fixes
python 02_scripts/extraction/analyze_lessons_utterances.py \
    01_raw_data/transcripts/French_I_-_Lesson_01_human_eval.txt

# Check output has position columns
head -n 5 output.csv | cut -d',' -f1-3
```

Once all fixes are verified, proceed with Supabase migration using the schema already created.