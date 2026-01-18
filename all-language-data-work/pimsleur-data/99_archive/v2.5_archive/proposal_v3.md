# Pimsleur French Curriculum Reverse-Engineering: Technical Workflow & Recommendations

## Executive Summary

This document outlines a comprehensive technical approach to reverse-engineer Pimsleur's French curriculum, focusing on uncovering sequencing logic, repetition patterns, and cognitive load management strategies. The proposed workflow addresses data integration, deduplication, categorization, and analysis across ~30 lessons of extracted content.

## Key Insights from Data Analysis

### Lesson Structure Patterns (from Lesson 5 transcript)
- **Opening**: Contextual conversation demonstrating target language
- **Explicit teaching**: New vocabulary/phrases with clear pedagogical cues
- **Intensive practice**: Multiple repetitions with variations
- **Recombination**: Mixing new and familiar elements
- **Consolidation**: Return to conversational context

### Pedagogical Techniques Observed
1. **Scaffolding**: Core structures (je, vous, est-ce que) appear constantly
2. **Spaced introduction**: New content introduced when learner has foundation
3. **Contrastive teaching**: "Je vais" vs "Je veux" to highlight differences
4. **Template patterns**: "Est-ce que + [pronoun] + [verb]" systematic variations
5. **Cognitive cycling**: Heavy practice → decay → reactivation

### Data Quality Findings
- Utterance analysis captures granular repetition patterns well
- Explicit phrase extraction identifies teaching moments effectively
- Missing cross-lesson tracking prevents full pattern analysis
- Template extraction would reveal systematic language building

### Visualization Mockup Insights (pimsleur_algorithm_viz_archive.tsx)
The existing React visualization reveals Pimsleur's sophisticated vocabulary management:

1. **Four-Tier System**:
   - **Scaffolding**: Foundation items (je, vous) with stable high usage (17-26 per lesson)
   - **Core Conversational**: Social phrases peak at introduction then maintain (2-7 uses)
   - **Spaced Repetition**: Topic vocabulary with clear decay curves (12→0 over 7 lessons)
   - **Contextual Building**: New concepts introduced in thematic clusters

2. **Cognitive Load Balance**:
   - Total repetitions remain stable (80-140 per lesson)
   - New introductions carefully controlled (0-4 per lesson)
   - Active vocabulary managed to prevent overload

3. **Strategic Patterns**:
   - "Pardon" shows cyclical revival for politeness reinforcement
   - Time expressions cluster in lessons 9-11
   - "Je voudrais" introduced lesson 5, peaks lesson 7 (restaurant context)

## 1. Data Merging & Deduplication Pipeline

### 1.1 Proposed Pipeline Architecture

```python
# Conceptual pipeline structure
Pipeline:
  1. Load & Normalize → 2. Align & Merge → 3. Deduplicate → 4. Enrich → 5. Index
```

### 1.2 Alignment Strategy

**Primary alignment key**: Lesson number + utterance order index
**Secondary alignment**: Fuzzy matching for explicit phrases to utterances

```python
# Alignment algorithm
def align_datasets(explicit_phrases, utterances):
    aligned_records = []
    for utterance in utterances:
        # Direct match on normalized text
        explicit_match = find_explicit_phrase(
            utterance.text, 
            explicit_phrases[utterance.lesson]
        )
        
        # Fuzzy match for partial overlaps
        if not explicit_match:
            explicit_match = fuzzy_match(
                utterance.text,
                explicit_phrases[utterance.lesson],
                threshold=0.85
            )
        
        aligned_records.append({
            'utterance_id': utterance.id,
            'lesson': utterance.lesson,
            'order_index': utterance.order,
            'text': utterance.text,
            'explicit_phrase_id': explicit_match.id if explicit_match else None,
            'teaching_context': explicit_match.context if explicit_match else None
        })
```

### 1.3 Deduplication Rules

**Three-tier deduplication strategy**:

1. **Exact match**: Character-for-character identical
2. **Normalized match**: Lowercased, punctuation removed, accents normalized
3. **Lemmatized match**: Using spaCy French model for lemma comparison

```python
def create_dedup_key(text, level='normalized'):
    if level == 'exact':
        return text
    elif level == 'normalized':
        return normalize_text(text)  # lowercase, remove punct
    elif level == 'lemmatized':
        doc = nlp(text)
        return ' '.join([token.lemma_ for token in doc])
```

### 1.4 Cross-Lesson Tracking Structure

```sql
-- Core tracking table
CREATE TABLE phrase_occurrences (
    phrase_id UUID PRIMARY KEY,
    canonical_form TEXT,
    normalized_form TEXT,
    lemmatized_form TEXT,
    first_lesson INT,
    first_position INT,
    total_occurrences INT,
    lessons_appeared JSON,  -- [{lesson: 1, positions: [15, 89, 234]}]
    teaching_contexts JSON  -- ['vocabulary_intro', 'practice', ...]
);

-- Occurrence details
CREATE TABLE occurrence_details (
    occurrence_id UUID PRIMARY KEY,
    phrase_id UUID REFERENCES phrase_occurrences,
    lesson INT,
    position INT,
    speaker TEXT,
    context TEXT,
    preceding_phrase_id UUID,
    following_phrase_id UUID
);
```

## 2. Enhanced Categorization & Tagging System

### 2.1 Improved Context Taxonomy

**Primary Categories** (mutually exclusive):

- `introduction` - First presentation of new material
- `practice` - Guided repetition/drill
- `application` - Using in new contexts
- `review` - Explicit revisiting of prior material
- `assessment` - Testing comprehension

**Secondary Tags** (multiple allowed):

- `grammar_focus` - Explicit grammar teaching
- `pronunciation` - Pronunciation breakdown
- `cultural_context` - Cultural notes
- `formulaic` - Fixed expressions
- `productive` - Template-based construction
- `receptive` - Comprehension only

### 2.2 LLM-Enhanced Categorization (Using Mistral-Medium)

```python
def enhance_context_categorization(phrase_record, lesson_context):
    # Use Mistral-Medium for context refinement
    prompt = f"""
    Phrase: {phrase_record['text']}
    Teaching cue: {phrase_record['teaching_cue']}
    Surrounding context: {lesson_context}
    
    Categorize this teaching moment:
    1. Primary category: [introduction|practice|application|review|assessment]
    2. Secondary tags: [list applicable tags]
    3. Pedagogical intent: [brief description]
    """
    
    response = MISTRAL_CLIENT.chat(
        model="mistral-medium-latest",
        response_format={"type": "json_object"},
        messages=[
            ChatMessage(role="system", content=categorization_prompt),
            ChatMessage(role="user", content=prompt)
        ],
        temperature=0.0
    )
    return parse_llm_response(response.choices[0].message.content)
```

### 2.3 Dataset Focus Recommendation

**Recommendation**: Maintain both datasets but prioritize utterances for analysis

- **Utterances**: Complete picture of exposure and practice
- **Explicit phrases**: Critical for understanding pedagogical intent
- **Integration**: Link explicit phrases as metadata to utterances

## 3. Progression & Lifecycle Tracking

### 3.1 Lifecycle Model

```python
class PhraseLifecycle:
    STAGES = {
        'introduction': 'First appearance with explicit teaching',
        'intensive_practice': 'High frequency within 1-2 lessons',
        'consolidation': 'Regular appearance across 3-5 lessons',
        'maintenance': 'Periodic review after 5+ lessons',
        'dormant': 'No appearance for 5+ lessons',
        'reactivation': 'Reappearance after dormancy'
    }
    
    def calculate_stage(self, phrase_id, current_lesson):
        occurrences = get_phrase_occurrences(phrase_id)
        first_lesson = occurrences[0].lesson
        last_lesson = occurrences[-1].lesson
        frequency = calculate_frequency_curve(occurrences)
        
        # Stage determination logic
        if current_lesson == first_lesson:
            return 'introduction'
        elif current_lesson - first_lesson <= 2 and frequency > 0.1:
            return 'intensive_practice'
        # ... additional logic
```

### 3.2 Visualization Approaches

**React-Based Visualization (Lower Priority)**:
- Existing mockup in `pimsleur_algorithm_viz_archive.tsx`
- Shows tier-based vocabulary management
- Includes decay curves and usage patterns
- Visualizes cognitive load across lessons

**Key Visualization Components**:
1. **Vocabulary Tiers**:
   - Scaffolding (never dropped)
   - Core conversational (peak then maintenance)
   - Spaced repetition (clear decay)
   - Contextual building (module-based)

2. **Metrics Displayed**:
   - Usage frequency heatmaps
   - Decay curves by vocabulary tier
   - Cognitive load bar charts
   - New introductions vs active vocabulary

**Implementation Note**: React visualization is lower priority - focus on data analysis first

## 4. Data Structure Recommendations

### 4.1 Primary Data Model

```python
# Hierarchical structure
DataModel:
  ├── Lessons
  │   ├── lesson_id
  │   ├── metadata
  │   └── utterances[]
  ├── Phrases
  │   ├── phrase_id
  │   ├── canonical_form
  │   ├── variations[]
  │   └── occurrences[]
  ├── Templates
  │   ├── template_id
  │   ├── pattern
  │   ├── slots[]
  │   └── instances[]
  └── Progressions
      ├── phrase_progressions
      ├── template_progressions
      └── concept_progressions
```

### 4.2 Indexing Strategy

```sql
-- Optimized indices for common queries
CREATE INDEX idx_phrase_lesson ON occurrence_details(phrase_id, lesson);
CREATE INDEX idx_lesson_position ON occurrence_details(lesson, position);
CREATE INDEX idx_context_lesson ON occurrence_details(context, lesson);
CREATE INDEX idx_template_components ON templates(pattern_hash);
```

### 4.3 Graph Database Alternative

Consider Neo4j for relationship-heavy queries:

```cypher
// Find all phrases that co-occur with a target phrase
MATCH (p1:Phrase)-[:PRECEDES]->(target:Phrase)-[:PRECEDES]->(p2:Phrase)
WHERE target.text = "Est-ce que vous comprenez"
RETURN p1, target, p2
```

## 5. Analysis Methods for Sequencing & Cognitive Load

### 5.1 Sequencing Logic Discovery

**Dependency Mapping**:

```python
def build_dependency_graph(phrases):
    dependencies = {}
    for phrase in phrases:
        components = extract_linguistic_components(phrase)
        for component in components:
            if component not in dependencies:
                dependencies[component] = set()
            dependencies[component].update(
                get_prerequisite_components(component)
            )
    return topological_sort(dependencies)
```

**Complexity Progression**:

```python
def calculate_complexity_curve(lessons):
    metrics = []
    for lesson in lessons:
        metrics.append({
            'lesson': lesson.number,
            'new_vocabulary': count_new_words(lesson),
            'new_structures': count_new_grammatical_patterns(lesson),
            'avg_utterance_length': average_length(lesson.utterances),
            'template_complexity': calculate_template_complexity(lesson)
        })
    return metrics
```

### 5.2 Repetition Algorithm Analysis

**Spaced Repetition Detection**:

```python
def analyze_repetition_intervals(phrase_occurrences):
    intervals = []
    for i in range(1, len(phrase_occurrences)):
        interval = phrase_occurrences[i].lesson - phrase_occurrences[i-1].lesson
        intervals.append(interval)
    
    # Fit to known SR algorithms (Leitner, SM2, etc.)
    best_fit = fit_spaced_repetition_models(intervals)
    return best_fit
```

### 5.3 Cognitive Load Metrics

**Updated Definition**: Cognitive load = new vs familiar (review) items with nuanced lifecycle tracking
- Track total French words/phrases/sentences per lesson
- Track familiar words/phrases/sentences across lifecycle stages
- Distinguish between truly new material and review content
- Consider familiar concepts, pronunciation patterns, and sentence structures

```python
class CognitiveLoadAnalyzer:
    def calculate_lesson_load(self, lesson):
        return {
            'total_french_items': self.count_all_french_content(lesson),
            'new_items': self.count_new_items(lesson),
            'familiar_items': self.count_familiar_items_by_lifecycle(lesson),
            'review_items': self.count_review_items(lesson),
            'novelty_ratio': self.new_items / self.total_items,
            'lifecycle_distribution': self.get_lifecycle_stage_counts(lesson),
            'conceptual_familiarity': self.calculate_conceptual_overlap(lesson),
            'structural_familiarity': self.calculate_structural_patterns(lesson)
        }
```

## 6. Scalability & Extensibility

### 6.1 Modular Architecture

```yaml
PimsleurAnalyzer:
  Core:
    - TextProcessor (language-agnostic)
    - AlignmentEngine
    - DeduplicationService
    - CategorizationService
  
  LanguageModules:
    - FrenchModule:
        - Tokenizer
        - Lemmatizer
        - GrammarParser
    - SpanishModule: ...
    - JapaneseModule: ...
  
  AnalysisModules:
    - ProgressionAnalyzer
    - RepetitionAnalyzer
    - CognitiveLoadAnalyzer
    - VisualizationGenerator
```

### 6.2 Configuration-Driven Analysis

```json
{
  "language": "french",
  "analysis_config": {
    "deduplication_level": "lemmatized",
    "context_detection": "llm_enhanced",
    "progression_window": 5,
    "visualization_types": ["timeline", "network", "heatmap"]
  },
  "language_specific": {
    "accent_normalization": true,
    "compound_detection": true,
    "template_markers": ["est-ce que", "qu'est-ce que"]
  }
}
```

## 7. Immediate Next Steps

### Updated Phased Implementation Approach

#### Phase 1: Small-Scale Validation (First 5 Lessons)
1. Implement alignment pipeline for existing CSVs
2. Build deduplication service
3. Create cross-lesson tracking for lessons 1-5
4. Validate approach and identify any issues
5. Stay with CSV format for rapid iteration

#### Phase 2: Extended Validation (Lessons 1-10)
1. Extend analysis to all 10 utterance lessons
2. Implement LLM-based context refinement
3. Build progression tracking system
4. Begin template pattern extraction
5. Generate initial findings report

#### Phase 3: Full Dataset Analysis (All 30 Lessons)
1. Complete utterance extraction for lessons 11-30
2. Migrate to PostgreSQL for full dataset
3. Implement comprehensive lifecycle tracking
4. Build cognitive load metrics
5. Create React-based visualizations (lower priority)

#### Phase 4: Cross-Level Validation (French II)
1. Apply methodology to French II
2. Validate patterns across levels
3. Refine algorithms based on findings
4. Prepare for cross-language analysis (Spanish I-V)

### Decision Points

1. ~~**Database choice**: PostgreSQL vs Neo4j vs hybrid?~~ **[RESOLVED: PostgreSQL]**
2. ~~**LLM integration**: GPT-4 API vs local model for categorization?~~ **[RESOLVED: Mistral-Medium]**
3. ~~**Visualization platform**: D3.js custom vs Tableau vs Python notebooks?~~ **[RESOLVED: React visualization - lower priority, mockup exists in pimsleur_algorithm_viz_archive.tsx]**
4. ~~**Focus depth**: Complete 10 lessons perfectly vs rough analysis of all 30?~~ **[RESOLVED: Phased approach - 5 lessons → 10 lessons → 30 lessons → French II]**

### Remaining Questions Before Implementation

1. ~~**Data Integration Priority**: Should we first complete utterance analysis for lessons 11-30, or begin cross-lesson integration with current data?~~ **[RESOLVED: Start cross-lesson integration with current data immediately]**
2. ~~**Manual Validation Sample**: What percentage of LLM outputs should we manually validate? (Suggested: 10% random sample + all edge cases)~~ **[RESOLVED: 10% manual validation sample accepted]**
3. ~~**Template Extraction Method**: Automatic pattern detection vs. manual template definition?~~ **[RESOLVED: Automatic template extraction to discover emergent patterns]**
4. ~~**Cognitive Load Metrics**: Which specific metrics are most important? (e.g., new items per minute, grammatical complexity score, vocabulary density)~~ **[RESOLVED: New vs review (familiar) items with nuanced lifecycle tracking]**
5. ~~**Output Format Preference**: Continue with CSVs or migrate to JSON/PostgreSQL immediately?~~ **[RESOLVED: Stay with CSVs for initial validation phase (5 lessons), then transition]**

## Open Questions for Discussion

1. ~~**Temporal resolution**: Should we track within-lesson position more granularly?~~ **[RESOLVED: Yes, add temporal resolution for spaced repetition analysis within lessons - but lower priority]**
2. ~~**Multi-modal integration**: How to incorporate audio timing/prosody data?~~ **[RESOLVED: No audio timing/prosody - too much manual verification required]**
3. ~~**Comparative analysis**: Should we analyze other Pimsleur languages in parallel?~~ **[RESOLVED: Yes - French levels 2-5 first for pattern validation, then Spanish levels 1-5 for cross-language confirmation]**
4. ~~**Production optimization**: How to balance analysis depth with implementation speed?~~ **[RESOLVED: No time constraints - focus on thorough understanding, accurate cognitive load measurement, and iterative improvement]**
5. ~~**Validation methodology**: How to verify our reverse-engineered patterns match actual Pimsleur methodology?~~ **[RESOLVED: Cross-validate patterns across French levels 2-5 and Spanish levels 1-5]**

## Additional Clarifications

### Technology Stack

- **Database**: PostgreSQL (confirmed)
- **LLM**: Mistral-Medium (as used in current scripts)
- **Language Models**: spaCy for French NLP, Lingua for language detection

### Current Data Status

- **Utterances**: 10 lessons analyzed (lessons 1-10)
- **Explicit Phrases**: 30 lessons analyzed (lessons 1-30)

### Project Philosophy

- No time pressure - quality over speed
- Focus on deep understanding of pedagogical patterns
- Develop robust cognitive load metrics
- Build system for recreation and improvement of methodology

## Recommended Script Improvements

### analyze_lessons_v2.py (Utterances)

1. **Add lesson metadata extraction**: Capture lesson number directly in the output
2. **Include position index**: Add utterance order within lesson for temporal analysis
3. **Expand utterance types**: Consider adding `Transformation` (modifying a known phrase) and `Synthesis` (combining known elements)
4. **Add confidence scoring**: Have LLM provide confidence for categorization

### analyze_lessons.py (Explicit Phrases)

1. **Standardize context categories**: Align with utterance categories for consistency
2. **Add preceding/following context**: Capture what comes before/after for better sequence understanding
3. **Extract template patterns**: Identify variable slots in phrases (e.g., "Est-ce que vous [VERB]")
4. **Add lesson number to output**: Currently missing from the CSV structure

### Both Scripts

1. **Unified output schema**: Ensure both scripts produce compatible data structures
2. **Add retry logic**: More robust error handling for API timeouts
3. **Batch processing**: Process multiple utterances/phrases in single API calls to reduce costs
4. **Progress tracking**: Save intermediate results to handle interruptions
5. **Validation step**: Add a post-processing validation to catch LLM errors

### Proposed Unified Schema

```python
@dataclass
class UnifiedUtterance:
    lesson: int
    position: int
    text: str
    normalized_text: str  # lowercase, punctuation normalized
    speaker: str
    utterance_type: str
    pedagogical_function: str  # maps to your primary categories
    teaching_cue: Optional[str]
    template_pattern: Optional[str]  # e.g., "Est-ce que [PRONOUN] [VERB]"
    core_lemmas: List[str]
    is_explicit_teaching: bool
    confidence: float
```

## Key Observations from Current Data

### Explicit Phrases (30 lessons)

- Clear progression from simple to complex structures
- Context categories need standardization (e.g., "vocabulary_review" vs "vocabulary_introduction")
- Missing lesson number in output files
- Good coverage of teaching cues but could benefit from template extraction

### Utterances (10 lessons)

- Strong categorization of pedagogical functions
- ConversationalExchange dominates later lessons
- Core lemmas properly extracted
- Missing explicit link to teaching moments

### Data Quality Assessment

- **Strengths**: Consistent extraction, good coverage, lemmatization working well
- **Gaps**: No cross-lesson tracking, inconsistent categorization, missing temporal indices
- **Opportunities**: Template pattern extraction, cognitive load metrics, progression visualization

## Appendix: Sample Analysis Output

```python
# Example: Phrase "Est-ce que vous comprenez"
{
    "phrase_id": "uuid-12345",
    "canonical_form": "Est-ce que vous comprenez",
    "first_appearance": {"lesson": 1, "position": 89},
    "total_occurrences": 47,
    "lifecycle_stages": [
        {"lesson": 1, "stage": "introduction", "frequency": 8},
        {"lesson": 2, "stage": "intensive_practice", "frequency": 12},
        {"lesson": 3-5, "stage": "consolidation", "frequency": 20},
        {"lesson": 6-10, "stage": "maintenance", "frequency": 7}
    ],
    "template_pattern": "Est-ce que + [pronoun] + [verb]",
    "related_phrases": ["Est-ce que vous parlez", "Est-ce que vous êtes"],
    "pedagogical_role": "question_formation_introduction"
}
```

## Final Recommendations

### Immediate Actions
1. **Start with 5 lessons** for rapid validation of approach
2. **Focus on cross-lesson tracking** using existing CSV data
3. **Implement automatic template extraction** to discover patterns
4. **Build lifecycle tracking** with nuanced new vs familiar metrics

### Technical Priorities
1. **Data Integration**: Unify utterances and explicit phrases data
2. **Deduplication**: Three-tier approach (exact, normalized, lemmatized)
3. **Pattern Detection**: Automatic template extraction for emergent patterns
4. **Cognitive Load**: Track new vs review with lifecycle stage context

### Deferred Items (Lower Priority)
1. **React Visualization**: Mockup exists, implement after core analysis
2. **Temporal Resolution**: Within-lesson timing analysis
3. **PostgreSQL Migration**: After CSV validation phase

### Key Success Metrics
1. **Pattern Discovery**: Identify Pimsleur's sequencing algorithms
2. **Cognitive Load Model**: Accurate prediction of lesson difficulty
3. **Template Extraction**: Reveal systematic language building approach
4. **Cross-Level Validation**: Patterns hold across French II-V and Spanish I-V

### Project Philosophy
- Quality over speed - no time pressure
- Deep understanding of pedagogical patterns
- Build foundation for recreation and improvement
- Maintain flexibility for iterative refinement
