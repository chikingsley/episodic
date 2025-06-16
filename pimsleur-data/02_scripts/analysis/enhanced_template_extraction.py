#!/usr/bin/env python3
"""
Enhanced template extraction for Pimsleur French patterns.
Identifies grammatical templates and structural patterns.
"""

import re
import csv
import json
from collections import defaultdict, Counter
from pathlib import Path
from typing import List, Dict, Set, Optional, Tuple

class EnhancedTemplateExtractor:
    """Advanced template pattern extraction."""
    
    # Pronouns and determiners
    PRONOUNS = {'je', 'vous', 'tu', 'il', 'elle', 'nous', 'ils', 'elles', 'on', 'moi'}
    DETERMINERS = {'le', 'la', 'les', 'un', 'une', 'des', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'votre', 'vos'}
    
    # Common verbs to track
    COMMON_VERBS = {
        'être': ['suis', 'êtes', 'est', 'sommes', 'sont'],
        'avoir': ['ai', 'avez', 'a', 'avons', 'ont'],
        'comprendre': ['comprends', 'comprenez', 'comprend', 'comprenons', 'comprennent'],
        'parler': ['parle', 'parlez', 'parlons', 'parlent'],
        'vouloir': ['veux', 'voulez', 'veut', 'voulons', 'veulent', 'voudrais', 'voudriez'],
        'aller': ['vais', 'allez', 'va', 'allons', 'vont'],
        'savoir': ['sais', 'savez', 'sait', 'savons', 'savent'],
        'faire': ['fais', 'faites', 'fait', 'faisons', 'font']
    }
    
    # Time expressions
    TIME_MARKERS = {'heure', 'heures', 'maintenant', 'tard', 'tôt', 'après', 'avant'}
    NUMBERS = {'un', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'}
    
    # Question markers
    QUESTION_MARKERS = {'est-ce que', "qu'est-ce que", 'où', 'quand', 'comment', 'pourquoi', 'qui', 'que', 'quoi', 'quel', 'quelle'}
    
    # Negation patterns
    NEGATION_MARKERS = {'ne', 'pas', 'plus', 'jamais', 'rien', 'personne'}
    
    @classmethod
    def extract_advanced_template(cls, text: str) -> Dict[str, any]:
        """Extract comprehensive template information."""
        result = {
            'template': None,
            'structure_type': None,
            'grammatical_features': [],
            'complexity_score': 0
        }
        
        normalized = text.lower().strip()
        words = normalized.split()
        
        # Identify structure type
        if any(marker in normalized for marker in cls.QUESTION_MARKERS):
            result['structure_type'] = 'question'
            
            # Specific question patterns
            if normalized.startswith('est-ce que'):
                if 'vous' in words:
                    verb_idx = words.index('vous') + 1 if words.index('vous') < len(words) - 1 else -1
                    if verb_idx > 0:
                        result['template'] = f"est-ce que vous [VERB:{words[verb_idx]}]"
                else:
                    result['template'] = "est-ce que [SUBJECT] [VERB]"
            
            elif normalized.startswith("qu'est-ce que"):
                result['template'] = "qu'est-ce que [SUBJECT] [VERB]"
            
            elif normalized.startswith('où'):
                if 'est' in words:
                    result['template'] = "où est [NOUN_PHRASE]"
                else:
                    result['template'] = "où [VERB] [SUBJECT]"
            
            elif normalized.startswith('comment'):
                if 'allez-vous' in normalized:
                    result['template'] = "comment allez-vous"
                else:
                    result['template'] = "comment [VERB_PHRASE]"
            
            elif normalized.startswith('à quelle heure'):
                result['template'] = "à quelle heure [ACTION]"
        
        # Negation patterns
        elif 'ne' in words and 'pas' in words:
            result['structure_type'] = 'negation'
            ne_idx = words.index('ne')
            pas_idx = words.index('pas')
            
            if ne_idx < len(words) - 1:
                subject = words[ne_idx - 1] if ne_idx > 0 and words[ne_idx - 1] in cls.PRONOUNS else '[SUBJECT]'
                verb = words[ne_idx + 1] if ne_idx < len(words) - 1 else '[VERB]'
                result['template'] = f"{subject} ne {verb} pas [COMPLEMENT]"
        
        # Declarative patterns
        else:
            result['structure_type'] = 'declarative'
            
            # Subject-verb patterns
            if len(words) > 0 and words[0] in cls.PRONOUNS:
                pronoun = words[0]
                if len(words) > 1:
                    verb = words[1]
                    # Check if it's a known verb form
                    verb_infinitive = cls._get_verb_infinitive(verb)
                    if verb_infinitive:
                        result['template'] = f"{pronoun} [{verb_infinitive.upper()}]"
                    else:
                        result['template'] = f"{pronoun} [VERB:{verb}]"
                    
                    # Add object/complement info
                    if len(words) > 2:
                        if words[2] in cls.DETERMINERS:
                            result['template'] += " [DET] [NOUN]"
                        elif words[2] in ['bien', 'mal', 'très', 'un peu']:
                            result['template'] += " [ADVERB]"
        
        # Extract grammatical features
        cls._extract_grammatical_features(words, result)
        
        # Calculate complexity score
        result['complexity_score'] = cls._calculate_complexity(words, result)
        
        return result
    
    @classmethod
    def _get_verb_infinitive(cls, verb_form: str) -> Optional[str]:
        """Find the infinitive form of a conjugated verb."""
        for infinitive, forms in cls.COMMON_VERBS.items():
            if verb_form in forms:
                return infinitive
        return None
    
    @classmethod
    def _extract_grammatical_features(cls, words: List[str], result: Dict):
        """Extract grammatical features from the phrase."""
        features = result['grammatical_features']
        
        # Tense/mood indicators
        if any(word in ['vais', 'allez', 'va'] for word in words):
            features.append('future_proche')
        if any(word in ['voudrais', 'voudriez'] for word in words):
            features.append('conditional')
        
        # Politeness markers
        if 's\'il vous plaît' in ' '.join(words):
            features.append('polite_request')
        if 'merci' in words:
            features.append('politeness')
        
        # Time references
        if any(word in cls.TIME_MARKERS for word in words):
            features.append('temporal_reference')
        
        # Numbers
        if any(word in cls.NUMBERS for word in words):
            features.append('numerical')
    
    @classmethod
    def _calculate_complexity(cls, words: List[str], result: Dict) -> int:
        """Calculate linguistic complexity score (0-10)."""
        score = 0
        
        # Base score from length
        score += min(len(words) / 3, 3)  # Max 3 points for length
        
        # Structure complexity
        if result['structure_type'] == 'question':
            score += 1
        if result['structure_type'] == 'negation':
            score += 2
        
        # Grammatical features
        score += len(result['grammatical_features']) * 0.5
        
        # Subordinate clauses
        if any(word in ['que', 'qui', 'où', 'quand'] for word in words[1:]):
            score += 2
        
        return min(int(score), 10)

class TemplatePatternAnalyzer:
    """Analyzes template patterns across lessons."""
    
    def __init__(self):
        self.extractor = EnhancedTemplateExtractor()
        self.template_occurrences = defaultdict(list)
        self.structure_progression = defaultdict(lambda: defaultdict(int))
        self.complexity_progression = defaultdict(list)
    
    def analyze_phrase_patterns(self, phrases_file: str):
        """Analyze patterns in the phrase occurrences file."""
        print(f"Analyzing patterns in {phrases_file}...")
        
        with open(phrases_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                phrase = row['phrase']
                lessons = [int(l) for l in row['lessons'].split(',')]
                first_lesson = int(row['first_lesson'])
                
                # Extract template info
                template_info = self.extractor.extract_advanced_template(phrase)
                
                # Track template occurrences
                if template_info['template']:
                    self.template_occurrences[template_info['template']].append({
                        'phrase': phrase,
                        'first_lesson': first_lesson,
                        'lessons': lessons,
                        'structure_type': template_info['structure_type'],
                        'features': template_info['grammatical_features'],
                        'complexity': template_info['complexity_score']
                    })
                
                # Track structure progression
                for lesson in lessons:
                    self.structure_progression[lesson][template_info['structure_type']] += 1
                
                # Track complexity progression
                self.complexity_progression[first_lesson].append(template_info['complexity_score'])
    
    def generate_template_report(self):
        """Generate comprehensive template analysis report."""
        report = {
            'template_patterns': {},
            'structure_progression': {},
            'complexity_progression': {},
            'grammatical_feature_distribution': defaultdict(int),
            'template_introduction_sequence': []
        }
        
        # Analyze template patterns
        for template, occurrences in sorted(
            self.template_occurrences.items(),
            key=lambda x: len(x[1]),
            reverse=True
        ):
            if len(occurrences) >= 2:  # Only include templates with multiple occurrences
                report['template_patterns'][template] = {
                    'count': len(occurrences),
                    'examples': [occ['phrase'] for occ in occurrences[:3]],
                    'first_introduced': min(occ['first_lesson'] for occ in occurrences),
                    'structure_type': occurrences[0]['structure_type'],
                    'avg_complexity': sum(occ['complexity'] for occ in occurrences) / len(occurrences)
                }
                
                # Track grammatical features
                for occ in occurrences:
                    for feature in occ['features']:
                        report['grammatical_feature_distribution'][feature] += 1
        
        # Structure progression by lesson
        for lesson in sorted(self.structure_progression.keys()):
            report['structure_progression'][str(lesson)] = dict(self.structure_progression[lesson])
        
        # Complexity progression
        for lesson in sorted(self.complexity_progression.keys()):
            scores = self.complexity_progression[lesson]
            if scores:
                report['complexity_progression'][str(lesson)] = {
                    'avg_complexity': sum(scores) / len(scores),
                    'max_complexity': max(scores),
                    'num_introductions': len(scores)
                }
        
        # Template introduction sequence
        template_intros = []
        for template, occurrences in self.template_occurrences.items():
            if occurrences:
                first_occ = min(occurrences, key=lambda x: x['first_lesson'])
                template_intros.append({
                    'lesson': first_occ['first_lesson'],
                    'template': template,
                    'example': first_occ['phrase'],
                    'type': first_occ['structure_type'],
                    'complexity': first_occ['complexity']
                })
        
        report['template_introduction_sequence'] = sorted(
            template_intros,
            key=lambda x: x['lesson']
        )[:50]  # Top 50 earliest templates
        
        return report

def analyze_templates():
    """Main function to run template analysis."""
    analyzer = TemplatePatternAnalyzer()
    
    # Analyze the phrase occurrences file
    analyzer.analyze_phrase_patterns('phrase_occurrences_lessons_1-5.csv')
    
    # Generate report
    report = analyzer.generate_template_report()
    
    # Save report
    output_path = Path('template_analysis_report.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\nTemplate analysis saved to {output_path}")
    
    # Print summary
    print("\n=== Template Pattern Summary ===")
    print(f"Total unique templates: {len(report['template_patterns'])}")
    
    print("\n=== Top 10 Templates by Frequency ===")
    for template, info in list(report['template_patterns'].items())[:10]:
        print(f"\n{template} ({info['count']} occurrences)")
        print(f"  Type: {info['structure_type']}")
        print(f"  First introduced: Lesson {info['first_introduced']}")
        print(f"  Avg complexity: {info['avg_complexity']:.1f}")
        print(f"  Examples: {', '.join(info['examples'][:2])}")
    
    print("\n=== Structure Type Distribution ===")
    total_by_type = defaultdict(int)
    for lesson_data in report['structure_progression'].values():
        for struct_type, count in lesson_data.items():
            total_by_type[struct_type] += count
    
    for struct_type, count in sorted(total_by_type.items(), key=lambda x: x[1], reverse=True):
        print(f"{struct_type}: {count}")
    
    print("\n=== Complexity Progression ===")
    for lesson, data in sorted(report['complexity_progression'].items())[:5]:
        print(f"Lesson {lesson}: avg complexity {data['avg_complexity']:.1f}, "
              f"max {data['max_complexity']}, {data['num_introductions']} new items")

if __name__ == "__main__":
    analyze_templates()