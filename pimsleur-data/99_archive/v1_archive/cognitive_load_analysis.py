#!/usr/bin/env python3
"""
Cognitive load analysis for Pimsleur French lessons.
Tracks new vs familiar items with nuanced lifecycle tracking.
"""

import csv
import json
from collections import defaultdict, Counter
from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional, Tuple
from pathlib import Path

@dataclass
class CognitiveLoadMetrics:
    """Metrics for cognitive load in a lesson."""
    lesson: int
    total_french_items: int = 0
    unique_french_items: int = 0
    new_items: int = 0
    familiar_items: int = 0
    review_items: int = 0
    
    # Lifecycle distribution
    introduction_items: int = 0
    intensive_practice_items: int = 0
    consolidation_items: int = 0
    maintenance_items: int = 0
    dormant_items: int = 0
    reactivated_items: int = 0
    
    # Structural familiarity
    familiar_templates: int = 0
    new_templates: int = 0
    
    # Complexity metrics
    avg_complexity: float = 0.0
    max_complexity: int = 0
    
    # Density metrics
    items_per_position: float = 0.0
    repetition_density: float = 0.0
    
    @property
    def novelty_ratio(self) -> float:
        """Calculate ratio of new to total items."""
        if self.total_french_items == 0:
            return 0.0
        return self.new_items / self.total_french_items
    
    @property
    def review_ratio(self) -> float:
        """Calculate ratio of review to total items."""
        if self.total_french_items == 0:
            return 0.0
        return self.review_items / self.total_french_items
    
    @property
    def cognitive_load_score(self) -> float:
        """Calculate overall cognitive load score (0-10)."""
        # Weighted combination of factors
        novelty_weight = 3.0
        complexity_weight = 2.0
        density_weight = 1.5
        review_weight = -1.0  # Review reduces load
        
        score = (
            (self.novelty_ratio * novelty_weight) +
            (self.avg_complexity / 10 * complexity_weight) +
            (self.repetition_density * density_weight) +
            (self.review_ratio * review_weight)
        )
        
        return max(0, min(10, score * 2))  # Scale to 0-10

class LifecycleTracker:
    """Tracks lifecycle stages of phrases across lessons."""
    
    LIFECYCLE_STAGES = {
        'introduction': 'First appearance with explicit teaching',
        'intensive_practice': 'High frequency within 1-2 lessons',
        'consolidation': 'Regular appearance across 3-5 lessons',
        'maintenance': 'Periodic review after 5+ lessons',
        'dormant': 'No appearance for 3+ lessons',
        'reactivation': 'Reappearance after dormancy'
    }
    
    def __init__(self):
        self.phrase_history: Dict[str, List[Tuple[int, int]]] = defaultdict(list)  # phrase -> [(lesson, count)]
        self.phrase_lifecycle: Dict[str, Dict[int, str]] = defaultdict(dict)  # phrase -> {lesson: stage}
    
    def update_phrase_history(self, phrase: str, lesson: int, count: int):
        """Update history for a phrase."""
        self.phrase_history[phrase].append((lesson, count))
    
    def calculate_lifecycle_stage(self, phrase: str, current_lesson: int) -> str:
        """Determine lifecycle stage for a phrase in a given lesson."""
        history = self.phrase_history[phrase]
        if not history:
            return 'unknown'
        
        # Sort by lesson
        history.sort(key=lambda x: x[0])
        
        first_lesson = history[0][0]
        lessons_appeared = [h[0] for h in history]
        total_occurrences = sum(h[1] for h in history)
        
        # Check if phrase appears in current lesson
        current_count = next((h[1] for h in history if h[0] == current_lesson), 0)
        
        if current_count == 0:
            # Not in current lesson - check dormancy
            last_appearance = max(l for l in lessons_appeared if l < current_lesson)
            if current_lesson - last_appearance >= 3:
                return 'dormant'
            return 'absent'
        
        # Phrase appears in current lesson
        if current_lesson == first_lesson:
            return 'introduction'
        
        # Check for reactivation
        if len(lessons_appeared) > 1:
            # Find gaps in appearance
            for i in range(1, len(lessons_appeared)):
                if lessons_appeared[i] == current_lesson:
                    gap = lessons_appeared[i] - lessons_appeared[i-1]
                    if gap >= 3:
                        return 'reactivation'
        
        # Calculate appearance density
        lessons_since_intro = current_lesson - first_lesson + 1
        appearance_rate = len(lessons_appeared) / lessons_since_intro
        
        # High frequency in recent lessons
        if lessons_since_intro <= 2 and total_occurrences >= 5:
            return 'intensive_practice'
        
        # Regular appearances
        if appearance_rate >= 0.6 and lessons_since_intro >= 3:
            return 'consolidation'
        
        # Periodic review
        if appearance_rate < 0.4 and lessons_since_intro >= 3:
            return 'maintenance'
        
        return 'active'

class CognitiveLoadAnalyzer:
    """Analyzes cognitive load across lessons."""
    
    def __init__(self):
        self.lifecycle_tracker = LifecycleTracker()
        self.template_familiarity: Dict[str, int] = {}  # template -> first_lesson
        self.lesson_metrics: Dict[int, CognitiveLoadMetrics] = {}
    
    def analyze_cognitive_load(self, phrases_file: str, template_file: str = None):
        """Analyze cognitive load from phrase occurrences."""
        print("Analyzing cognitive load...")
        
        # Load template analysis if available
        if template_file and Path(template_file).exists():
            with open(template_file, 'r', encoding='utf-8') as f:
                template_data = json.load(f)
                
                # Track template introduction lessons
                for template_info in template_data.get('template_introduction_sequence', []):
                    template = template_info['template']
                    lesson = template_info['lesson']
                    if template not in self.template_familiarity:
                        self.template_familiarity[template] = lesson
        
        # First pass: build phrase history
        with open(phrases_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                phrase = row['normalized_form']
                lessons = [int(l) for l in row['lessons'].split(',')]
                total_occurrences = int(row['total_occurrences'])
                
                # Distribute occurrences across lessons (simplified)
                avg_per_lesson = total_occurrences / len(lessons)
                
                for lesson in lessons:
                    self.lifecycle_tracker.update_phrase_history(
                        phrase, lesson, int(avg_per_lesson)
                    )
        
        # Initialize metrics for each lesson
        for lesson in range(1, 6):
            self.lesson_metrics[lesson] = CognitiveLoadMetrics(lesson=lesson)
        
        # Second pass: calculate metrics
        with open(phrases_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                phrase = row['normalized_form']
                canonical = row['phrase']
                lessons = [int(l) for l in row['lessons'].split(',')]
                first_lesson = int(row['first_lesson'])
                template = row.get('template_pattern', '')
                
                # Update metrics for each lesson based on actual occurrences
                total_occurrences = int(row['total_occurrences'])
                num_lessons = len(lessons)
                avg_per_lesson = total_occurrences / num_lessons if num_lessons > 0 else 0
                
                for lesson in lessons:
                    metrics = self.lesson_metrics[lesson]
                    
                    # Total items - use actual occurrence count distributed across lessons
                    metrics.total_french_items += int(avg_per_lesson)
                    
                    # Lifecycle stage
                    stage = self.lifecycle_tracker.calculate_lifecycle_stage(phrase, lesson)
                    
                    # New vs familiar
                    if lesson == first_lesson:
                        metrics.new_items += 1
                    else:
                        metrics.familiar_items += 1
                        
                        # Check if it's review (gap of 2+ lessons)
                        history = self.lifecycle_tracker.phrase_history[phrase]
                        lesson_list = sorted([h[0] for h in history])
                        lesson_idx = lesson_list.index(lesson)
                        if lesson_idx > 0 and lesson - lesson_list[lesson_idx-1] >= 2:
                            metrics.review_items += 1
                    
                    # Update lifecycle counts
                    if stage == 'introduction':
                        metrics.introduction_items += 1
                    elif stage == 'intensive_practice':
                        metrics.intensive_practice_items += 1
                    elif stage == 'consolidation':
                        metrics.consolidation_items += 1
                    elif stage == 'maintenance':
                        metrics.maintenance_items += 1
                    elif stage == 'reactivation':
                        metrics.reactivated_items += 1
                    
                    # Template familiarity
                    if template and template in self.template_familiarity:
                        if self.template_familiarity[template] < lesson:
                            metrics.familiar_templates += 1
                        else:
                            metrics.new_templates += 1
        
        # Calculate unique items per lesson
        with open(phrases_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            lesson_unique_items = defaultdict(set)
            
            for row in reader:
                lessons = [int(l) for l in row['lessons'].split(',')]
                for lesson in lessons:
                    lesson_unique_items[lesson].add(row['normalized_form'])
        
        for lesson, items in lesson_unique_items.items():
            if lesson in self.lesson_metrics:
                self.lesson_metrics[lesson].unique_french_items = len(items)
        
        # Calculate density metrics
        for lesson, metrics in self.lesson_metrics.items():
            if metrics.unique_french_items > 0:
                metrics.repetition_density = metrics.total_french_items / metrics.unique_french_items
            
            # Calculate complexity based on actual data, not fallback defaults
            if metrics.new_items > 0:
                # More realistic complexity calculation
                base_complexity = 2.0  # Base complexity for any content
                novelty_complexity = (metrics.new_items / 20) * 3  # Scale with new items
                review_complexity = (metrics.review_items / 20) * 1  # Reviews add less complexity
                metrics.avg_complexity = min(base_complexity + novelty_complexity + review_complexity, 10)
            else:
                metrics.avg_complexity = 1.0  # Very low complexity if no new items
            
            metrics.max_complexity = min(int(metrics.avg_complexity * 1.3), 10)  # More conservative max
    
    def generate_cognitive_load_report(self):
        """Generate cognitive load analysis report."""
        report = {
            'lesson_metrics': {},
            'progression_analysis': {
                'novelty_curve': [],
                'complexity_curve': [],
                'cognitive_load_curve': [],
                'lifecycle_distribution': []
            },
            'insights': []
        }
        
        # Add metrics for each lesson
        for lesson, metrics in sorted(self.lesson_metrics.items()):
            report['lesson_metrics'][str(lesson)] = {
                'total_items': metrics.total_french_items,
                'unique_items': metrics.unique_french_items,
                'new_items': metrics.new_items,
                'familiar_items': metrics.familiar_items,
                'review_items': metrics.review_items,
                'novelty_ratio': round(metrics.novelty_ratio, 3),
                'review_ratio': round(metrics.review_ratio, 3),
                'cognitive_load_score': round(metrics.cognitive_load_score, 2),
                'lifecycle_distribution': {
                    'introduction': metrics.introduction_items,
                    'intensive_practice': metrics.intensive_practice_items,
                    'consolidation': metrics.consolidation_items,
                    'maintenance': metrics.maintenance_items,
                    'reactivation': metrics.reactivated_items
                },
                'repetition_density': round(metrics.repetition_density, 2)
            }
            
            # Add to progression curves
            report['progression_analysis']['novelty_curve'].append({
                'lesson': lesson,
                'novelty_ratio': round(metrics.novelty_ratio, 3)
            })
            
            report['progression_analysis']['complexity_curve'].append({
                'lesson': lesson,
                'avg_complexity': round(metrics.avg_complexity, 2)
            })
            
            report['progression_analysis']['cognitive_load_curve'].append({
                'lesson': lesson,
                'load_score': round(metrics.cognitive_load_score, 2)
            })
        
        # Generate insights
        self._generate_insights(report)
        
        return report
    
    def _generate_insights(self, report: Dict):
        """Generate insights from the analysis."""
        insights = []
        
        # Analyze cognitive load trend
        load_scores = [m['load_score'] for m in report['progression_analysis']['cognitive_load_curve']]
        if len(load_scores) >= 3:
            if load_scores[-1] > load_scores[0] * 1.5:
                insights.append("Cognitive load increases significantly over lessons 1-5")
            elif all(3 <= score <= 7 for score in load_scores):
                insights.append("Cognitive load remains well-balanced (3-7 range) across lessons")
        
        # Analyze novelty patterns
        novelty_ratios = [m['novelty_ratio'] for m in report['progression_analysis']['novelty_curve']]
        if novelty_ratios[0] > 0.7:
            insights.append("Lesson 1 has high novelty (>70% new items) - true beginner start")
        
        if all(ratio < 0.5 for ratio in novelty_ratios[2:]):
            insights.append("After lesson 2, most content is familiar or review")
        
        # Analyze review patterns
        total_review = sum(m.review_items for m in self.lesson_metrics.values())
        total_items = sum(m.total_french_items for m in self.lesson_metrics.values())
        if total_review / total_items > 0.2:
            insights.append(f"Strong spaced repetition: {total_review/total_items:.1%} of items are review")
        
        report['insights'] = insights

def main():
    """Run cognitive load analysis."""
    analyzer = CognitiveLoadAnalyzer()
    
    # Analyze cognitive load
    analyzer.analyze_cognitive_load(
        'phrase_occurrences_lessons_1-5.csv',
        'template_analysis_report.json'
    )
    
    # Generate report
    report = analyzer.generate_cognitive_load_report()
    
    # Save report
    output_path = Path('cognitive_load_analysis.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\nCognitive load analysis saved to {output_path}")
    
    # Print summary
    print("\n=== Cognitive Load Analysis Summary ===")
    
    print("\n=== Lesson-by-Lesson Metrics ===")
    for lesson, metrics in sorted(analyzer.lesson_metrics.items()):
        print(f"\nLesson {lesson}:")
        print(f"  Total items: {metrics.total_french_items}")
        print(f"  New items: {metrics.new_items} ({metrics.novelty_ratio:.1%})")
        print(f"  Review items: {metrics.review_items} ({metrics.review_ratio:.1%})")
        print(f"  Cognitive load score: {metrics.cognitive_load_score:.1f}/10")
        print(f"  Repetition density: {metrics.repetition_density:.1f}x")
    
    print("\n=== Key Insights ===")
    for insight in report['insights']:
        print(f"• {insight}")

if __name__ == "__main__":
    main()