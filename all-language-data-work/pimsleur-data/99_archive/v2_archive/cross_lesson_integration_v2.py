#!/usr/bin/env python3
"""
Cross-lesson integration pipeline v2 with proper new/review tracking.
Fixes critical issues from v1.
"""

import csv
import json
import re
from collections import defaultdict, Counter
from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional, Tuple
from pathlib import Path

@dataclass
class ProcessedUtterance:
    """Unified data structure for utterances with position tracking."""
    lesson_number: int
    position_in_lesson: int
    text: str
    normalized_text: str
    speaker: str
    utterance_type: Optional[str] = None
    pedagogical_function: Optional[str] = None
    teaching_cue: Optional[str] = None
    core_lemmas: List[str] = field(default_factory=list)
    is_explicit_teaching: bool = False
    source: str = "utterance"

@dataclass 
class PhraseTracking:
    """Tracks new vs review status for phrases across lessons."""
    phrase_id: str
    normalized_text: str
    first_lesson: int
    first_position: int
    total_occurrences: int = 0
    lesson_occurrences: Dict[int, int] = field(default_factory=dict)
    is_new: bool = True
    is_review: bool = False
    is_reinforcement: bool = False
    lessons_since_introduction: int = 0

class TextNormalizer:
    """Handles text normalization."""
    
    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize text for comparison."""
        # Remove punctuation except apostrophes, lowercase, normalize whitespace
        text = re.sub(r"[^\w\s'-]", "", text.lower())
        return " ".join(text.split()).strip()

class ImprovedCrossLessonAnalyzer:
    """Improved analyzer with proper sequential processing."""
    
    def __init__(self, lessons_to_analyze: List[int] = None):
        self.lessons = lessons_to_analyze or list(range(1, 6))
        self.seen_phrases = set()  # Global tracker
        self.phrase_first_seen = {}  # phrase -> (lesson, position)
        self.phrase_tracking = {}  # phrase -> PhraseTracking
        self.normalizer = TextNormalizer()
        
        # All processed utterances in order
        self.all_utterances = []
    
    def load_updated_data(self):
        """Load data from updated extraction scripts with position tracking."""
        print("Loading updated data with position tracking...")
        
        # Load utterances
        utterances_dir = Path("01_raw_data/analysis_outputs/utterances")
        for lesson_num in self.lessons:
            file_path = utterances_dir / f"French_I_-_Lesson_{lesson_num:02d}_utterance_analysis_fixed.csv"
            if not file_path.exists():
                print(f"Warning: {file_path} not found")
                continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    utterance = ProcessedUtterance(
                        lesson_number=int(row['lesson_number']),
                        position_in_lesson=int(row['position_in_lesson']),
                        text=row['utterance_text'],
                        normalized_text=self.normalizer.normalize_text(row['utterance_text']),
                        speaker=row['speaker'],
                        utterance_type=row.get('utterance_type'),
                        teaching_cue=row.get('narrator_cue'),
                        core_lemmas=row.get('core_lemmas', '').split() if row.get('core_lemmas') else [],
                        source="utterance"
                    )
                    self.all_utterances.append(utterance)
        
        # Load explicit phrases
        phrases_dir = Path("01_raw_data/analysis_outputs/explicit_phrases")
        for lesson_num in self.lessons:
            file_path = phrases_dir / f"French_I_-_Lesson_{lesson_num:02d}_explicit_phrases_fixed.csv"
            if not file_path.exists():
                print(f"Warning: {file_path} not found")
                continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    phrase = ProcessedUtterance(
                        lesson_number=int(row['lesson_number']),
                        position_in_lesson=int(row['position_in_lesson']),
                        text=row['phrase'],
                        normalized_text=self.normalizer.normalize_text(row['phrase']),
                        speaker=row.get('speaker_response', 'Unknown'),
                        pedagogical_function=row.get('context'),
                        teaching_cue=row.get('teaching_cue'),
                        is_explicit_teaching=True,
                        source="explicit"
                    )
                    self.all_utterances.append(phrase)
        
        # Sort by lesson, then position for proper sequential processing
        self.all_utterances.sort(key=lambda x: (x.lesson_number, x.position_in_lesson))
        print(f"Loaded {len(self.all_utterances)} total items from {len(self.lessons)} lessons")
    
    def process_sequentially(self):
        """Process all utterances in lesson order to track new vs review."""
        print("Processing utterances sequentially...")
        
        for utterance in self.all_utterances:
            normalized = utterance.normalized_text
            lesson = utterance.lesson_number
            position = utterance.position_in_lesson
            
            # Skip empty or very short phrases
            if len(normalized.strip()) < 3:
                continue
            
            if normalized not in self.seen_phrases:
                # First time seeing this phrase - it's NEW
                self.seen_phrases.add(normalized)
                self.phrase_first_seen[normalized] = (lesson, position)
                
                tracking = PhraseTracking(
                    phrase_id=normalized,
                    normalized_text=normalized,
                    first_lesson=lesson,
                    first_position=position,
                    total_occurrences=1,
                    is_new=True,
                    is_review=False,
                    lessons_since_introduction=0
                )
                tracking.lesson_occurrences[lesson] = 1
                self.phrase_tracking[normalized] = tracking
                
            else:
                # Seen before - determine status
                tracking = self.phrase_tracking[normalized]
                tracking.total_occurrences += 1
                
                if lesson not in tracking.lesson_occurrences:
                    tracking.lesson_occurrences[lesson] = 0
                tracking.lesson_occurrences[lesson] += 1
                
                first_lesson, _ = self.phrase_first_seen[normalized]
                lessons_gap = lesson - first_lesson
                tracking.lessons_since_introduction = lessons_gap
                
                # Classify based on gap
                if lessons_gap == 0:
                    # Same lesson repetition - practice
                    tracking.is_new = False
                    tracking.is_review = False
                    tracking.is_reinforcement = False
                elif lessons_gap == 1:
                    # Next lesson - reinforcement
                    tracking.is_new = False
                    tracking.is_review = False  
                    tracking.is_reinforcement = True
                elif lessons_gap >= 2:
                    # 2+ lessons gap - spaced review
                    tracking.is_new = False
                    tracking.is_review = True
                    tracking.is_reinforcement = False
    
    def calculate_correct_repetition_density(self):
        """Calculate repetition density correctly."""
        lesson_metrics = {}
        
        for lesson in self.lessons:
            # Count actual utterances in this lesson
            lesson_utterances = [u for u in self.all_utterances if u.lesson_number == lesson]
            total_utterances = len(lesson_utterances)
            
            # Count unique phrases
            unique_phrases = set()
            phrase_counts = Counter()
            
            for utterance in lesson_utterances:
                normalized = utterance.normalized_text
                if len(normalized.strip()) >= 3:  # Skip very short
                    unique_phrases.add(normalized)
                    phrase_counts[normalized] += 1
            
            unique_count = len(unique_phrases)
            
            # Repetition density = total utterances / unique phrases
            repetition_density = total_utterances / unique_count if unique_count > 0 else 1.0
            
            # Count phrases that appear more than once (practice indicators)
            repeated_phrases = sum(1 for count in phrase_counts.values() if count > 1)
            repetition_rate = repeated_phrases / unique_count if unique_count > 0 else 0.0
            
            lesson_metrics[lesson] = {
                'total_utterances': total_utterances,
                'unique_phrases': unique_count,
                'repetition_density': round(repetition_density, 2),
                'repetition_rate': round(repetition_rate, 2),
                'phrases_with_practice': repeated_phrases
            }
        
        return lesson_metrics
    
    def calculate_new_vs_review_metrics(self):
        """Calculate new vs review metrics per lesson."""
        lesson_metrics = {}
        
        for lesson in self.lessons:
            new_items = 0
            review_items = 0
            reinforcement_items = 0
            repetition_items = 0
            
            for phrase_id, tracking in self.phrase_tracking.items():
                if lesson in tracking.lesson_occurrences:
                    count = tracking.lesson_occurrences[lesson]
                    
                    if tracking.first_lesson == lesson:
                        new_items += count
                    else:
                        gap = lesson - tracking.first_lesson
                        if gap == 1:
                            reinforcement_items += count
                        elif gap >= 2:
                            review_items += count
                        else:
                            repetition_items += count
            
            total_items = new_items + review_items + reinforcement_items + repetition_items
            
            lesson_metrics[lesson] = {
                'new_items': new_items,
                'repetition_items': repetition_items,
                'reinforcement_items': reinforcement_items,
                'review_items': review_items,
                'total_items': total_items,
                'novelty_ratio': new_items / total_items if total_items > 0 else 0,
                'review_ratio': review_items / total_items if total_items > 0 else 0
            }
        
        return lesson_metrics
    
    def calculate_corrected_cognitive_load(self, new_vs_review):
        """Calculate cognitive load with proper weighting."""
        cognitive_load_metrics = {}
        
        for lesson in self.lessons:
            metrics = new_vs_review[lesson]
            
            # Weighted cognitive load formula
            load_score = (
                metrics['new_items'] * 1.0 +           # New items have full weight
                metrics['repetition_items'] * 0.1 +    # Same-lesson practice has minimal load
                metrics['reinforcement_items'] * 0.3 + # Next-lesson reinforcement moderate load
                metrics['review_items'] * 0.2          # Spaced reviews have low load
            )
            
            # Normalize to 0-10 scale based on actual data range
            # Observed range: 181-238, so scale accordingly
            max_expected_load = 250  # Based on our data
            normalized_load = (load_score / max_expected_load) * 10
            cognitive_load_score = max(0, min(10, normalized_load))
            
            cognitive_load_metrics[lesson] = {
                'raw_load_score': round(load_score, 1),
                'cognitive_load_score': round(cognitive_load_score, 1),
                'novelty_ratio': round(metrics['novelty_ratio'], 3),
                'review_ratio': round(metrics['review_ratio'], 3)
            }
        
        return cognitive_load_metrics
    
    def generate_fixed_analysis_report(self):
        """Generate corrected analysis report."""
        print("Generating fixed analysis report...")
        
        # Calculate all metrics
        repetition_metrics = self.calculate_correct_repetition_density()
        new_vs_review = self.calculate_new_vs_review_metrics()
        cognitive_load = self.calculate_corrected_cognitive_load(new_vs_review)
        
        report = {
            'summary': {
                'total_utterances': len(self.all_utterances),
                'unique_phrases': len(self.phrase_tracking),
                'lessons_analyzed': self.lessons,
                'fixes_applied': [
                    'Added position tracking',
                    'Fixed repetition density calculation',
                    'Implemented sequential new/review tracking',
                    'Corrected cognitive load formula'
                ]
            },
            'lesson_metrics': {},
            'phrase_progression': [],
            'validation_tests': {}
        }
        
        # Combine metrics per lesson
        for lesson in self.lessons:
            combined_metrics = {
                'lesson': lesson,
                **repetition_metrics[lesson],
                **new_vs_review[lesson],
                **cognitive_load[lesson]
            }
            report['lesson_metrics'][str(lesson)] = combined_metrics
        
        # Add phrase progression examples
        progression_examples = []
        for phrase_id, tracking in sorted(
            self.phrase_tracking.items(),
            key=lambda x: x[1].total_occurrences,
            reverse=True
        )[:20]:
            progression_examples.append({
                'phrase': phrase_id,
                'first_lesson': tracking.first_lesson,
                'total_occurrences': tracking.total_occurrences,
                'lessons_appeared': list(tracking.lesson_occurrences.keys()),
                'lesson_counts': dict(tracking.lesson_occurrences)
            })
        
        report['phrase_progression'] = progression_examples
        
        # Validation tests
        validation = self.run_validation_tests(repetition_metrics, new_vs_review)
        report['validation_tests'] = validation
        
        return report
    
    def run_validation_tests(self, repetition_metrics, new_vs_review):
        """Run validation tests to verify fixes."""
        tests = {}
        
        # Test 1: Repetition density should be > 1.0 for most lessons
        densities = [m['repetition_density'] for m in repetition_metrics.values()]
        tests['repetition_density_test'] = {
            'passed': sum(1 for d in densities if d > 1.0) >= len(densities) * 0.5,
            'densities': densities,
            'message': 'At least 50% of lessons should have repetition density > 1.0'
        }
        
        # Test 2: Not all items should be "new" in later lessons
        lesson_3_novelty = new_vs_review.get(3, {}).get('novelty_ratio', 1.0)
        tests['novelty_reduction_test'] = {
            'passed': lesson_3_novelty < 0.8,
            'lesson_3_novelty': lesson_3_novelty,
            'message': 'Lesson 3 should have < 80% new items'
        }
        
        # Test 3: Should have some review items by lesson 4-5
        total_review = sum(new_vs_review.get(l, {}).get('review_items', 0) for l in [4, 5])
        tests['review_items_test'] = {
            'passed': total_review > 0,
            'total_review_items_l4_l5': total_review,
            'message': 'Should have some review items in lessons 4-5'
        }
        
        return tests
    
    def save_corrected_data(self, report):
        """Save corrected analysis data."""
        output_dir = Path("03_phase1_analysis/data")
        
        # Save comprehensive report
        report_path = output_dir / "cross_lesson_analysis_phase1_5_fixed.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        # Save phrase tracking CSV
        csv_path = output_dir / "phrase_tracking_fixed_lessons_1-5.csv"
        with open(csv_path, 'w', encoding='utf-8', newline='') as f:
            fieldnames = [
                'phrase', 'first_lesson', 'first_position', 'total_occurrences',
                'lessons_appeared', 'is_new', 'is_review', 'is_reinforcement',
                'lessons_since_introduction'
            ]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for phrase_id, tracking in sorted(
                self.phrase_tracking.items(),
                key=lambda x: x[1].total_occurrences,
                reverse=True
            ):
                writer.writerow({
                    'phrase': phrase_id,
                    'first_lesson': tracking.first_lesson,
                    'first_position': tracking.first_position,
                    'total_occurrences': tracking.total_occurrences,
                    'lessons_appeared': ','.join(map(str, sorted(tracking.lesson_occurrences.keys()))),
                    'is_new': tracking.first_lesson == max(tracking.lesson_occurrences.keys()),
                    'is_review': tracking.lessons_since_introduction >= 2,
                    'is_reinforcement': tracking.lessons_since_introduction == 1,
                    'lessons_since_introduction': tracking.lessons_since_introduction
                })
        
        print(f"Fixed analysis saved to {report_path}")
        print(f"Phrase tracking saved to {csv_path}")

def main():
    """Run fixed cross-lesson analysis."""
    analyzer = ImprovedCrossLessonAnalyzer(lessons_to_analyze=[1, 2, 3, 4, 5])
    
    # Load updated data
    analyzer.load_updated_data()
    
    # Process sequentially to track new vs review
    analyzer.process_sequentially()
    
    # Generate fixed report
    report = analyzer.generate_fixed_analysis_report()
    
    # Save results
    analyzer.save_corrected_data(report)
    
    # Print summary
    print("\n=== Fixed Analysis Summary ===")
    print(f"Total utterances processed: {len(analyzer.all_utterances)}")
    print(f"Unique phrases tracked: {len(analyzer.phrase_tracking)}")
    
    print("\n=== Lesson Metrics (Fixed) ===")
    for lesson, metrics in report['lesson_metrics'].items():
        print(f"\nLesson {lesson}:")
        print(f"  Repetition density: {metrics['repetition_density']} (was 1.0)")
        print(f"  Novelty ratio: {metrics['novelty_ratio']:.1%} (was ~100%)")
        print(f"  Cognitive load: {metrics['cognitive_load_score']}/10 (was 9.5-10)")
        print(f"  New items: {metrics['new_items']}")
        print(f"  Review items: {metrics['review_items']}")
    
    print("\n=== Validation Results ===")
    for test_name, result in report['validation_tests'].items():
        status = "✅ PASS" if result['passed'] else "❌ FAIL"
        print(f"{test_name}: {status}")
        print(f"  {result['message']}")

if __name__ == "__main__":
    main()