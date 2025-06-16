# Pimsleur Phrase Extraction System: Implementation Proposal

## Executive Summary

Based on analysis of Pimsleur French lessons 1-3, this proposal outlines a comprehensive system for extracting and tracking pedagogically meaningful phrases that bridge the gap between individual words and complete sentences. The system aims to capture both **formulaic expressions** (stored as units) and **productive patterns** (templates with variable slots) while scaling to all 30 lessons.

## Current State Analysis

### What We Have

- ✅ **Words CSV**: Individual vocabulary with frequencies
- ✅ **Sentences CSV**: Complete utterances with frequencies  
- ✅ **Pronunciation Breakdowns CSV**: Syllable-level analysis

### The Gap

- ❌ **Phrase-level constructs**: Multi-word units between words and sentences
- ❌ **Pattern recognition**: Grammatical templates with variable slots
- ❌ **Pedagogical tracking**: What Pimsleur explicitly teaches vs. emergent patterns
- ❌ **Cross-lesson progression**: How phrases build and evolve across lessons

## Proposed Solution: Multi-Tier Phrase Extraction System

### Tier 1: Explicit Teaching Moments

**Goal**: Capture phrases that Pimsleur explicitly introduces and teaches

**Implementation**:

```python
def extract_explicit_phrases(speaker_events):
    """Extract phrases from narrator-cued teaching moments"""
    teaching_cues = [
        "Here's how to say",
        "Listen and repeat", 
        "First, the word",
        "Now, the word",
        "Here's the phrase that"
    ]
    # Extract French content following these cues
```

**Output**: `explicit_phrases.csv`

```csv
phrase,lesson,teaching_cue,context,frequency
"Est-ce que",1,"Here's the phrase that makes a question","question formation",56
"un peu",1,"Here's how to say","quantity expression",24
"s'il vous plaît",3,"Now let's learn how to say","politeness marker",12
```

### Tier 2: Formulaic Expression Detection

**Goal**: Identify fixed multi-word expressions that function as unanalyzed units

**Implementation**:

```python
def extract_formulaic_expressions():
    """Detect high-frequency multi-word units"""
    formulaic_patterns = [
        # Social formulas
        r"(Bonjour|Au revoir),?\s+(Monsieur|Mademoiselle|Madame)",
        r"Comment allez-vous\?",
        r"(Très|Pas très)\s+bien",
        
        # Grammatical formulas  
        r"Est-ce que\s+vous",
        r"Je ne\s+\w+\s+pas",
        r"S'il vous plaît",
        
        # Response formulas
        r"(Oui|Non),?\s+(Monsieur|Mademoiselle|Madame)",
    ]
```

**Output**: `formulaic_phrases.csv`

```csv
phrase,type,frequency,lessons_appearing,example_context
"Est-ce que vous",grammatical,127,"1,2,3,4,5","Est-ce que vous comprenez?"
"Très bien",evaluative,45,"2,3,4,5","Comment allez-vous? Très bien."
"Bonjour Monsieur",social,18,"2,3,4","Bonjour Monsieur. Comment allez-vous?"
```

### Tier 3: Productive Pattern Recognition

**Goal**: Identify templates with variable slots that generate multiple sentences

**Implementation**:

```python
def extract_productive_patterns():
    """Identify sentence templates with variable slots"""
    templates = [
        # Question patterns
        "Est-ce que [PRONOUN] [VERB] [OBJECT]?",
        "[PRONOUN] [VERB] [ADVERB] [OBJECT]?",
        
        # Statement patterns  
        "Je [VERB] [ADVERB] le [LANGUAGE]",
        "[PRONOUN] [VERB] [NATIONALITY]",
        
        # Negation patterns
        "Je ne [VERB] pas [OBJECT]",
        "[PRONOUN] n'[VERB] pas [ADJECTIVE]"
    ]
```

**Output**: `productive_patterns.csv`

```csv
pattern,template,slot_fillers,frequency,lessons
"question_formation","Est-ce que [PRONOUN] [VERB] [OBJECT]?","vous|comprenez|l'anglais,le français",89,"1,2,3,4,5"
"negation","Je ne [VERB] pas [OBJECT]","comprends|l'anglais,le français",34,"1,2,3,4"
```

### Tier 4: N-Gram Analysis (Filtered)

**Goal**: Capture emergent multi-word patterns not caught by explicit rules

**Implementation**:

```python
def extract_filtered_ngrams():
    """Generate 2-4 gram phrases with intelligent filtering"""
    # Filter criteria:
    # - Must contain at least one content word
    # - Must appear in multiple contexts  
    # - Must span speaker boundaries (not just sentence fragments)
    # - Must have pedagogical relevance
```

**Output**: `ngram_phrases.csv` (heavily filtered)

```csv
ngram,n,frequency,linguistic_category,pedagogical_value
"allez bien",2,15,"verb_phrase","greeting_response"
"parlez très",2,12,"adverb_placement","quality_assessment"
"rue Saint-Jacques",3,22,"proper_noun","location_reference"
```

## Detailed Implementation Plan

### Phase 1: Foundation (Week 1)

1. **Extend current analyzer** with phrase extraction capabilities
2. **Implement Tier 1**: Narrator-cued explicit teaching extraction
3. **Create phrase validation framework** for manual review
4. **Test on lessons 1-5** to validate approach

### Phase 2: Pattern Recognition (Week 2)  

1. **Implement Tier 2**: Formulaic expression detection using regex patterns
2. **Implement Tier 3**: Productive pattern recognition with slot identification
3. **Cross-validate against linguistic analysis** of what Pimsleur actually teaches
4. **Refine filtering criteria** based on pedagogical relevance

### Phase 3: Advanced Analysis (Week 3)

1. **Implement Tier 4**: Filtered n-gram analysis  
2. **Create cross-lesson tracking** to identify phrase progression
3. **Implement phrase frequency analysis** across lesson boundaries
4. **Add phrase categorization** (grammatical, lexical, social, phonological)

### Phase 4: Scale & Validate (Week 4)

1. **Scale to all 30 lessons** in the dataset
2. **Validate phrase extraction quality** through manual sampling
3. **Generate phrase progression analysis** showing how complexity builds
4. **Create comprehensive phrase taxonomy** for the full course

## Technical Architecture

### Data Structure

```python
@dataclass
class ExtractedPhrase:
    text: str
    type: PhraseType  # explicit, formulaic, productive, ngram
    frequency: int
    lessons: List[int]
    contexts: List[str] 
    teaching_cue: Optional[str]
    pattern_template: Optional[str]
    slot_fillers: Optional[Dict[str, List[str]]]
    linguistic_category: str
    pedagogical_function: str
```

### Output Files Structure

```
analysis_results/
├── phrases/
│   ├── explicit_phrases.csv           # Narrator-taught phrases
│   ├── formulaic_phrases.csv          # Fixed expressions  
│   ├── productive_patterns.csv        # Template patterns
│   ├── ngram_phrases.csv              # Emergent patterns
│   └── phrase_progression.csv         # Cross-lesson tracking
├── combined/
│   ├── all_phrases_by_lesson.csv      # Complete phrase inventory
│   └── phrase_taxonomy.csv            # Categorized phrase types
└── analysis/
    ├── phrase_frequency_analysis.csv   # Statistical analysis
    └── pedagogical_progression.csv     # Learning sequence analysis
```

### Integration with Existing System

- **Extend `analyze_lessons.py`** with phrase extraction modules
- **Maintain backward compatibility** with current word/sentence extraction
- **Add phrase validation pipeline** for quality control
- **Implement progressive complexity scoring** for pedagogical analysis

## Success Metrics

### Quantitative Measures

- **Coverage**: 95%+ of pedagogically relevant multi-word units captured
- **Precision**: 90%+ of extracted phrases are linguistically/pedagogically valid
- **Scalability**: System processes all 30 lessons in <5 minutes
- **Consistency**: Phrase extraction results are reproducible across runs

### Qualitative Measures  

- **Pedagogical alignment**: Extracted phrases match what language teachers identify as important
- **Linguistic validity**: Phrases represent coherent grammatical/semantic units
- **Learning progression**: Clear patterns emerge showing how phrases build complexity
- **Practical utility**: Results enable better understanding of Pimsleur's methodology

## Risk Mitigation

### Technical Risks

- **Over-extraction**: Mitigated by strict filtering criteria and manual validation
- **Under-extraction**: Mitigated by multiple complementary extraction methods
- **Performance**: Mitigated by efficient algorithms and incremental processing

### Linguistic Risks  

- **False positives**: Mitigated by linguistic knowledge integration and expert review
- **Missing contexts**: Mitigated by comprehensive context capture and cross-referencing
- **Pattern overgeneralization**: Mitigated by careful template validation

## Next Steps

1. **Approve this proposal** and prioritize implementation phases
2. **Begin Phase 1 implementation** with Tier 1 explicit phrase extraction
3. **Establish validation criteria** for phrase quality assessment
4. **Create test dataset** using lessons 1-5 for initial validation
5. **Schedule regular review points** to assess progress and refine approach

## Expected Outcomes

Upon completion, this system will provide:

- **Complete phrase inventory** for all 30 Pimsleur French lessons
- **Pedagogical progression mapping** showing how phrases build across lessons  
- **Pattern analysis** distinguishing explicit teaching from emergent learning
- **Linguistic taxonomy** categorizing phrases by function and complexity
- **Scalable methodology** applicable to other Pimsleur language courses

This comprehensive phrase extraction system will bridge the current gap between word-level and sentence-level analysis, providing unprecedented insight into Pimsleur's pedagogical methodology and enabling more sophisticated language learning analytics.
