#!/usr/bin/env python3
"""
Cognitive load analysis V4 for Pimsleur French lessons.
Utterance-centric approach that builds on utterance patterns with punctuation normalization.
"""

import re
import json
import argparse
from collections import defaultdict
from typing import Dict, List, Tuple
from dataclasses import dataclass
from alive_progress import alive_bar

from database_writer import DatabaseWriter


@dataclass
class CognitiveLoadMetrics:
    """Metrics for cognitive load in a lesson."""
    lesson_number: int
    total_utterances: int = 0
    unique_utterances: int = 0
    new_utterances: int = 0
    familiar_utterances: int = 0
    
    # Pattern-based metrics
    persistent_utterances: int = 0
    recurring_utterances: int = 0
    clustered_utterances: int = 0
    single_lesson_utterances: int = 0
    
    # Calculated metrics
    novelty_ratio: float = 0.0
    repetition_density: float = 0.0
    persistence_score: float = 0.0
    cognitive_load_score: float = 0.0


def normalize_utterance_text(text: str) -> str:
    """Normalize utterance text by removing punctuation and converting to lowercase."""
    # Remove trailing punctuation and normalize case
    normalized = re.sub(r'[.!?,:;]+$', '', text.strip()).lower()
    return normalized


def calculate_cognitive_load_score(metrics: CognitiveLoadMetrics) -> float:
    """Calculate overall cognitive load score (0-10) based on multiple factors."""
    if metrics.total_utterances == 0:
        return 0.0
    
    # Weight factors for cognitive load
    novelty_weight = 4.0      # New items create high load
    density_weight = 2.0      # Repetition reduces load
    persistence_weight = -1.0 # Persistent items reduce load (familiar)
    single_lesson_weight = 1.5 # Single-lesson items add load (no reinforcement)
    
    # Calculate component scores (0-1 range)
    novelty_component = metrics.novelty_ratio
    density_component = min(metrics.repetition_density / 3.0, 1.0)  # Cap at 3x repetition
    persistence_component = metrics.persistence_score
    single_lesson_component = metrics.single_lesson_utterances / metrics.total_utterances
    
    # Weighted combination
    raw_score = (
        (novelty_component * novelty_weight) +
        (density_component * density_weight) +
        (persistence_component * persistence_weight) +
        (single_lesson_component * single_lesson_weight)
    )
    
    # Scale to 0-10 range
    scaled_score = max(0, min(10, raw_score * 1.5))
    return round(scaled_score, 2)


def analyze_lesson_cognitive_load(lessons: List[int]) -> Dict[int, CognitiveLoadMetrics]:
    """Analyze cognitive load for specified lessons using utterance patterns."""
    
    lesson_metrics = {}
    
    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            print(f"🧠 Analyzing cognitive load for lessons {min(lessons)}-{max(lessons)}")
            
            # Get utterance patterns for normalization and grouping
            cur.execute("""
                SELECT utterance_text, first_lesson, last_lesson, total_lessons, 
                       lesson_counts, persistence_score, pattern_type
                FROM utterance_patterns
            """)
            
            pattern_data = cur.fetchall()
            print(f"📊 Processing {len(pattern_data)} utterance patterns")
            
            # Normalize patterns to handle punctuation variants
            normalized_patterns = defaultdict(list)
            
            with alive_bar(len(pattern_data), title="Normalizing patterns", force_tty=True) as bar:
                for row in pattern_data:
                    text, first_lesson, last_lesson, total_lessons, lesson_counts, persistence_score, pattern_type = row
                    
                    normalized_text = normalize_utterance_text(text)
                    
                    # Handle lesson_counts (might be JSON string or dict)
                    if isinstance(lesson_counts, str):
                        lesson_counts_dict = json.loads(lesson_counts)
                    else:
                        lesson_counts_dict = lesson_counts
                    
                    normalized_patterns[normalized_text].append({
                        'original_text': text,
                        'first_lesson': first_lesson,
                        'last_lesson': last_lesson,
                        'total_lessons': total_lessons,
                        'lesson_counts': lesson_counts_dict,
                        'persistence_score': persistence_score,
                        'pattern_type': pattern_type
                    })
                    bar()
            
            # Merge punctuation variants and calculate lesson metrics
            print(f"🔄 Merged into {len(normalized_patterns)} normalized patterns")
            
            # Initialize metrics for each lesson
            for lesson in lessons:
                lesson_metrics[lesson] = CognitiveLoadMetrics(lesson_number=lesson)
            
            # Process normalized patterns
            with alive_bar(len(normalized_patterns), title="Calculating metrics", force_tty=True) as bar:
                for normalized_text, variants in normalized_patterns.items():
                    # Merge variants into single pattern
                    merged_lesson_counts = defaultdict(int)
                    first_appearance = min(v['first_lesson'] for v in variants)
                    last_appearance = max(v['last_lesson'] for v in variants)
                    total_persistence = max(v['persistence_score'] for v in variants)
                    
                    # Merge lesson counts from all variants
                    for variant in variants:
                        for lesson_num, count in variant['lesson_counts'].items():
                            merged_lesson_counts[int(lesson_num)] += count
                    
                    # Determine dominant pattern type
                    pattern_types = [v['pattern_type'] for v in variants]
                    if 'persistent' in pattern_types:
                        dominant_pattern = 'persistent'
                    elif 'recurring' in pattern_types:
                        dominant_pattern = 'recurring'
                    elif 'clustered' in pattern_types:
                        dominant_pattern = 'clustered'
                    else:
                        dominant_pattern = 'single_lesson'
                    
                    # Update lesson metrics
                    for lesson_num in lessons:
                        if lesson_num in merged_lesson_counts:
                            metrics = lesson_metrics[lesson_num]
                            count = merged_lesson_counts[lesson_num]
                            
                            # Basic counts
                            metrics.total_utterances += count
                            metrics.unique_utterances += 1
                            
                            # New vs familiar
                            if lesson_num == first_appearance:
                                metrics.new_utterances += 1
                            else:
                                metrics.familiar_utterances += 1
                            
                            # Pattern type counts
                            if dominant_pattern == 'persistent':
                                metrics.persistent_utterances += 1
                            elif dominant_pattern == 'recurring':
                                metrics.recurring_utterances += 1
                            elif dominant_pattern == 'clustered':
                                metrics.clustered_utterances += 1
                            else:
                                metrics.single_lesson_utterances += 1
                    
                    bar()
            
            # Calculate derived metrics
            for lesson_num, metrics in lesson_metrics.items():
                if metrics.total_utterances > 0:
                    metrics.novelty_ratio = metrics.new_utterances / metrics.unique_utterances
                    
                    if metrics.unique_utterances > 0:
                        metrics.repetition_density = metrics.total_utterances / metrics.unique_utterances
                    
                    if metrics.unique_utterances > 0:
                        metrics.persistence_score = metrics.persistent_utterances / metrics.unique_utterances
                    
                    metrics.cognitive_load_score = calculate_cognitive_load_score(metrics)
    
    return lesson_metrics


def save_cognitive_load_to_db(lesson_metrics: Dict[int, CognitiveLoadMetrics]):
    """Save cognitive load metrics to the database."""
    
    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            print("💾 Saving cognitive load metrics to database...")
            
            # Clear existing cognitive load data
            cur.execute("DELETE FROM cognitive_load")
            
            with alive_bar(len(lesson_metrics), title="Saving metrics", force_tty=True) as bar:
                for lesson_num, metrics in lesson_metrics.items():
                    # Ensure lesson exists
                    lesson_id = db.ensure_lesson_exists(lesson_num)
                    
                    # Insert cognitive load metrics
                    cur.execute("""
                        INSERT INTO cognitive_load 
                        (lesson_id, load_score, novelty_ratio, repetition_density, 
                         core_introductions, derived_phrases)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        lesson_id,
                        metrics.cognitive_load_score,
                        metrics.novelty_ratio,
                        metrics.repetition_density,
                        metrics.new_utterances,  # core_introductions
                        metrics.familiar_utterances  # derived_phrases (reusing field)
                    ))
                    bar()


def generate_cognitive_load_report(lesson_metrics: Dict[int, CognitiveLoadMetrics]):
    """Generate and display cognitive load analysis report."""
    
    print("\n" + "="*70)
    print("🧠 COGNITIVE LOAD ANALYSIS REPORT")
    print("="*70)
    
    # Lesson-by-lesson breakdown
    print("\n📖 Lesson-by-Lesson Metrics:")
    print("-" * 50)
    
    for lesson_num in sorted(lesson_metrics.keys()):
        metrics = lesson_metrics[lesson_num]
        
        print(f"\n📚 Lesson {lesson_num}:")
        print(f"   Total utterances: {metrics.total_utterances}")
        print(f"   Unique utterances: {metrics.unique_utterances}")
        print(f"   New utterances: {metrics.new_utterances} ({metrics.novelty_ratio:.1%})")
        print(f"   Familiar utterances: {metrics.familiar_utterances}")
        print(f"   Repetition density: {metrics.repetition_density:.1f}x")
        print(f"   Persistence score: {metrics.persistence_score:.2f}")
        print(f"   🧠 Cognitive load: {metrics.cognitive_load_score:.1f}/10")
        
        # Pattern distribution
        print(f"   Pattern distribution:")
        print(f"     • Persistent: {metrics.persistent_utterances}")
        print(f"     • Recurring: {metrics.recurring_utterances}")
        print(f"     • Clustered: {metrics.clustered_utterances}")
        print(f"     • Single-lesson: {metrics.single_lesson_utterances}")
    
    # Overall insights
    print("\n🎯 Key Insights:")
    print("-" * 30)
    
    load_scores = [m.cognitive_load_score for m in lesson_metrics.values()]
    novelty_ratios = [m.novelty_ratio for m in lesson_metrics.values()]
    
    # Load progression
    if len(load_scores) >= 2:
        if load_scores[-1] > load_scores[0] * 1.3:
            print("• Cognitive load increases significantly across lessons")
        elif all(3 <= score <= 7 for score in load_scores):
            print("• Cognitive load remains well-balanced (3-7 range)")
        else:
            print("• Cognitive load shows varied progression")
    
    # Novelty patterns
    if novelty_ratios[0] > 0.6:
        print("• High novelty in early lessons (>60% new content)")
    
    avg_novelty = sum(novelty_ratios) / len(novelty_ratios)
    if avg_novelty < 0.3:
        print(f"• Strong familiarity emphasis (avg {avg_novelty:.1%} novelty)")
    
    # Repetition patterns
    avg_density = sum(m.repetition_density for m in lesson_metrics.values()) / len(lesson_metrics)
    if avg_density > 2.0:
        print(f"• Strong repetition pattern (avg {avg_density:.1f}x density)")
    
    print(f"\n📊 Overall averages:")
    print(f"   Cognitive load: {sum(load_scores)/len(load_scores):.1f}/10")
    print(f"   Novelty ratio: {avg_novelty:.1%}")
    print(f"   Repetition density: {avg_density:.1f}x")


def main():
    """Main function for cognitive load analysis."""
    parser = argparse.ArgumentParser(
        description="Cognitive Load Analysis V4 - Utterance-Centric"
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        type=int,
        default=list(range(1, 11)),  # Default to lessons 1-10
        help="Lesson numbers to analyze (default: 1-10)"
    )
    
    args = parser.parse_args()
    
    print("🚀 Cognitive Load Analysis V4 - Utterance-Centric")
    print("="*60)
    print(f"📚 Analyzing lessons: {args.lessons}")
    print("="*60)
    
    # Analyze cognitive load
    lesson_metrics = analyze_lesson_cognitive_load(args.lessons)
    
    # Save to database
    save_cognitive_load_to_db(lesson_metrics)
    
    # Generate report
    generate_cognitive_load_report(lesson_metrics)
    
    print(f"\n✅ Cognitive load analysis complete!")


if __name__ == "__main__":
    main()