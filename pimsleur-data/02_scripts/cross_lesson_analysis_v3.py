#!/usr/bin/env python3
"""
Cross-lesson utterance pattern analysis V3.
Utterance-centric approach that tracks all speech patterns across lessons.
"""

import sys
import pathlib
import json
import argparse
from collections import defaultdict, Counter
from typing import Dict, List, Any
from alive_progress import alive_bar  # type: ignore

# Add path for database writer
sys.path.append(str(pathlib.Path(__file__).parent.parent))
from db.database_writer import DatabaseWriter

def normalize_utterance_text(text: str) -> str:
    """Normalize utterance text for comparison (case-insensitive, minimal cleanup)."""
    return text.lower().strip()

def calculate_persistence_score(lesson_counts: Dict[int, int], total_lessons: int) -> float:
    """Calculate how persistent an utterance is across lessons."""
    lessons_with_utterance = len(lesson_counts)
    return lessons_with_utterance / total_lessons if total_lessons > 0 else 0.0

def classify_pattern_type(lesson_counts: Dict[int, int], first_lesson: int, last_lesson: int) -> str:
    """Classify the pattern type based on lesson distribution."""
    lesson_span = last_lesson - first_lesson + 1
    total_lessons_with_utterance = len(lesson_counts)
    
    if total_lessons_with_utterance == 1:
        return "single_lesson"
    elif lesson_span <= 2:
        return "clustered"
    elif total_lessons_with_utterance >= lesson_span * 0.7:
        return "persistent"
    else:
        return "recurring"

def analyze_utterance_patterns(lessons: List[int]) -> int:
    """Analyze utterance patterns across the specified lessons."""
    
    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            print(f"🔍 Analyzing utterance patterns across lessons {min(lessons)}-{max(lessons)}")
            
            # Clear existing pattern data
            cur.execute("DELETE FROM utterance_patterns")
            print("🧹 Cleared existing pattern data")
            
            # Get all utterances for the specified lessons
            lesson_placeholders = ",".join(["%s"] * len(lessons))
            cur.execute(f"""
                SELECT u.text, l.lesson_number, COUNT(*) as count
                FROM utterances u
                JOIN lessons l ON u.lesson_id = l.id
                WHERE l.lesson_number IN ({lesson_placeholders})
                  AND u.text IS NOT NULL 
                  AND LENGTH(TRIM(u.text)) > 0
                GROUP BY u.text, l.lesson_number
                ORDER BY u.text, l.lesson_number
            """, lessons)
            
            utterance_data = cur.fetchall()
            print(f"📊 Found {len(utterance_data)} unique utterance-lesson combinations")
            
            # Group by normalized utterance text
            pattern_data = defaultdict(lambda: {"lessons": {}, "total_count": 0})
            
            print("📈 Processing utterance patterns...")
            with alive_bar(len(utterance_data), title="Processing patterns", force_tty=True) as bar:
                for text, lesson_num, count in utterance_data:
                    normalized_text = normalize_utterance_text(text)
                    pattern_data[normalized_text]["lessons"][lesson_num] = count
                    pattern_data[normalized_text]["total_count"] += count
                    pattern_data[normalized_text]["original_text"] = text  # Keep one original for display
                    bar()
            
            print(f"🎯 Found {len(pattern_data)} unique utterance patterns")
            
            # Calculate pattern metrics and insert into database
            patterns_to_insert = []
            
            print("🧮 Calculating pattern metrics...")
            with alive_bar(len(pattern_data), title="Calculating metrics", force_tty=True) as bar:
                for normalized_text, data in pattern_data.items():
                    lesson_counts = data["lessons"]
                    first_lesson = min(lesson_counts.keys())
                    last_lesson = max(lesson_counts.keys())
                    total_lessons_covered = len(lessons)
                    
                    persistence_score = calculate_persistence_score(lesson_counts, total_lessons_covered)
                    pattern_type = classify_pattern_type(lesson_counts, first_lesson, last_lesson)
                    
                    patterns_to_insert.append((
                        data["original_text"],  # Use original text for readability
                        first_lesson,
                        last_lesson,
                        len(lesson_counts),
                        json.dumps(lesson_counts),  # Store as JSON
                        persistence_score,
                        pattern_type
                    ))
                    bar()
            
            # Insert patterns into database
            print("💾 Inserting patterns into database...")
            with alive_bar(len(patterns_to_insert), title="Inserting patterns", force_tty=True) as bar:
                for pattern in patterns_to_insert:
                    cur.execute("""
                        INSERT INTO utterance_patterns 
                        (utterance_text, first_lesson, last_lesson, total_lessons, lesson_counts, persistence_score, pattern_type)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, pattern)
                    bar()
            
            # Generate summary statistics
            print("\n" + "="*60)
            print("📊 PATTERN ANALYSIS SUMMARY")
            print("="*60)
            
            # Pattern type distribution
            cur.execute("""
                SELECT pattern_type, COUNT(*) as count, 
                       ROUND(AVG(persistence_score)::numeric, 3) as avg_persistence
                FROM utterance_patterns 
                GROUP BY pattern_type 
                ORDER BY count DESC
            """)
            
            print("\n🏷️  Pattern Types:")
            for pattern_type, count, avg_persistence in cur.fetchall():
                print(f"   {pattern_type}: {count} patterns (avg persistence: {avg_persistence})")
            
            # Most persistent utterances
            print("\n🎯 Most Persistent Utterances (appear in many lessons):")
            cur.execute("""
                SELECT utterance_text, total_lessons, persistence_score, lesson_counts
                FROM utterance_patterns 
                WHERE pattern_type = 'persistent' 
                ORDER BY persistence_score DESC, total_lessons DESC
                LIMIT 10
            """)
            
            for text, total_lessons, persistence, lesson_counts_json in cur.fetchall():
                lesson_counts = json.loads(lesson_counts_json)
                lessons_str = ", ".join([f"L{k}:{v}" for k, v in sorted(lesson_counts.items())])
                print(f"   '{text[:50]}...' - {total_lessons} lessons ({persistence:.2f})")
                print(f"     Distribution: {lessons_str}")
            
            # Single lesson utterances (potential practice/pronunciation)
            print("\n🔤 Single-Lesson Utterances (pronunciation/practice patterns):")
            cur.execute("""
                SELECT first_lesson, COUNT(*) as count
                FROM utterance_patterns 
                WHERE pattern_type = 'single_lesson'
                GROUP BY first_lesson
                ORDER BY first_lesson
            """)
            
            for lesson_num, count in cur.fetchall():
                print(f"   Lesson {lesson_num}: {count} single-use utterances")
            
            # Recurring patterns (spaced repetition candidates)
            print("\n🔄 Recurring Patterns (spaced repetition):")
            cur.execute("""
                SELECT utterance_text, lesson_counts, total_lessons
                FROM utterance_patterns 
                WHERE pattern_type = 'recurring' 
                  AND total_lessons >= 3
                ORDER BY total_lessons DESC
                LIMIT 5
            """)
            
            for text, lesson_counts_json, total_lessons in cur.fetchall():
                lesson_counts = json.loads(lesson_counts_json)
                lessons_str = ", ".join([f"L{k}:{v}" for k, v in sorted(lesson_counts.items())])
                print(f"   '{text[:40]}...' ({total_lessons} lessons)")
                print(f"     Pattern: {lessons_str}")
            
            return len(patterns_to_insert)

def main():
    """Main function for cross-lesson pattern analysis."""
    parser = argparse.ArgumentParser(
        description="Cross-Lesson Utterance Pattern Analysis V3"
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        type=int,
        default=list(range(1, 11)),  # Default to lessons 1-10
        help="Lesson numbers to analyze (default: 1-10)"
    )
    
    args = parser.parse_args()
    
    print("🚀 Cross-Lesson Utterance Pattern Analysis V3")
    print("="*60)
    print(f"📚 Analyzing lessons: {args.lessons}")
    print("="*60)
    
    total_patterns = analyze_utterance_patterns(args.lessons)
    
    print(f"\n✅ Analysis complete! Generated {total_patterns} utterance patterns.")
    print("🎯 Next steps: Review pattern data in utterance_patterns table")

if __name__ == "__main__":
    main()