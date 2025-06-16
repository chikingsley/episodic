#!/usr/bin/env python3
"""
Cross-lesson integration pipeline that reads from and writes to Supabase database.
Production version for database-first analysis workflow.
"""

import os
import sys
import pathlib
from collections import defaultdict, Counter
from typing import List, Dict, Set, Optional, Tuple
import psycopg2
from dotenv import load_dotenv

# Import our database writer
sys.path.append(str(pathlib.Path(__file__).parent.parent))
from db.database_writer import DatabaseWriter

load_dotenv()

class DatabaseCrossLessonAnalyzer:
    """Performs cross-lesson analysis using database as source and target."""
    
    def __init__(self, lessons_to_analyze: List[int] = None):
        """Initialize with database connection."""
        self.lessons = lessons_to_analyze or list(range(1, 6))
        self.database_url = os.getenv("DATABASE_URL")
        
        if not self.database_url:
            raise ValueError("DATABASE_URL not found in environment variables")
        
        self.conn = psycopg2.connect(self.database_url)
        self.conn.autocommit = True
        
        # Analysis data
        self.seen_phrases = set()  # Global tracker
        self.phrase_first_seen = {}  # phrase -> (lesson, position)
        self.phrase_tracking = {}  # phrase -> tracking data
        self.all_utterances = []
        
        print(f"Connected to database for cross-lesson analysis")
    
    def load_data_from_database(self):
        """Load utterances and phrases from database."""
        print("Loading data from database...")
        
        with self.conn.cursor() as cur:
            # Load utterances with lesson information
            cur.execute("""
                SELECT l.lesson_number, u.position_in_lesson, u.speaker, u.text
                FROM utterances u
                JOIN lessons l ON u.lesson_id = l.id
                WHERE l.lesson_number = ANY(%s)
                ORDER BY l.lesson_number, u.position_in_lesson
            """, (self.lessons,))
            
            utterances = cur.fetchall()
            print(f"Loaded {len(utterances)} utterances from database")
            
            # Convert to our working format
            for lesson_num, position, speaker, text in utterances:
                self.all_utterances.append({
                    'lesson_number': lesson_num,
                    'position_in_lesson': position,
                    'speaker': speaker,
                    'text': text,
                    'normalized_text': self.normalize_text(text)
                })
    
    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison."""
        import re
        # Remove punctuation except apostrophes, lowercase, normalize whitespace
        text = re.sub(r"[^\w\s'-]", "", text.lower())
        return " ".join(text.split()).strip()
    
    def process_sequential_analysis(self):
        """Process utterances sequentially to track new vs review patterns."""
        print("Processing sequential cross-lesson analysis...")
        
        phrase_data = defaultdict(lambda: {
            'first_lesson': None,
            'first_position': None,
            'occurrences': 0,
            'lesson_counts': defaultdict(int),
            'lessons_appeared': set(),
            'is_new': True,
            'is_review': False,
            'is_reinforcement': False,
            'lessons_since_introduction': 0
        })
        
        for utterance in self.all_utterances:
            normalized = utterance['normalized_text']
            lesson = utterance['lesson_number']
            position = utterance['position_in_lesson']
            
            # Skip very short phrases
            if len(normalized.strip()) < 3:
                continue
            
            phrase_info = phrase_data[normalized]
            phrase_info['occurrences'] += 1
            phrase_info['lesson_counts'][lesson] += 1
            phrase_info['lessons_appeared'].add(lesson)
            
            if normalized not in self.seen_phrases:
                # First occurrence
                self.seen_phrases.add(normalized)
                phrase_info['first_lesson'] = lesson
                phrase_info['first_position'] = position
                phrase_info['is_new'] = True
                phrase_info['lessons_since_introduction'] = 0
            else:
                # Subsequent occurrence
                first_lesson = phrase_info['first_lesson']
                lessons_gap = lesson - first_lesson
                phrase_info['lessons_since_introduction'] = lessons_gap
                
                # Classify based on gap
                if lessons_gap == 0:
                    # Same lesson - practice
                    phrase_info['is_new'] = False
                    phrase_info['is_review'] = False
                    phrase_info['is_reinforcement'] = False
                elif lessons_gap == 1:
                    # Next lesson - reinforcement
                    phrase_info['is_new'] = False
                    phrase_info['is_review'] = False
                    phrase_info['is_reinforcement'] = True
                elif lessons_gap >= 2:
                    # 2+ lessons gap - spaced review
                    phrase_info['is_new'] = False
                    phrase_info['is_review'] = True
                    phrase_info['is_reinforcement'] = False
        
        self.phrase_tracking = phrase_data
        print(f"Analyzed {len(phrase_data)} unique phrases")
    
    def calculate_lesson_metrics(self):
        """Calculate metrics for each lesson."""
        lesson_metrics = {}
        
        for lesson in self.lessons:
            # Get utterances for this lesson
            lesson_utterances = [u for u in self.all_utterances if u['lesson_number'] == lesson]
            total_utterances = len(lesson_utterances)
            
            # Count unique phrases in this lesson
            unique_phrases = set()
            phrase_counts = Counter()
            
            for utterance in lesson_utterances:
                normalized = utterance['normalized_text']
                if len(normalized.strip()) >= 3:
                    unique_phrases.add(normalized)
                    phrase_counts[normalized] += 1
            
            unique_count = len(unique_phrases)
            repetition_density = total_utterances / unique_count if unique_count > 0 else 1.0
            repeated_phrases = sum(1 for count in phrase_counts.values() if count > 1)
            repetition_rate = repeated_phrases / unique_count if unique_count > 0 else 0.0
            
            # Calculate new vs review items
            new_items = 0
            review_items = 0
            reinforcement_items = 0
            repetition_items = 0
            
            for phrase_id, tracking in self.phrase_tracking.items():
                if lesson in tracking['lesson_counts']:
                    count = tracking['lesson_counts'][lesson]
                    
                    if tracking['first_lesson'] == lesson:
                        new_items += count
                    else:
                        gap = lesson - tracking['first_lesson']
                        if gap == 1:
                            reinforcement_items += count
                        elif gap >= 2:
                            review_items += count
                        else:
                            repetition_items += count
            
            total_items = new_items + review_items + reinforcement_items + repetition_items
            
            # Calculate cognitive load
            load_score = (
                new_items * 1.0 +
                repetition_items * 0.1 +
                reinforcement_items * 0.3 +
                review_items * 0.2
            )
            
            max_expected_load = 250
            normalized_load = (load_score / max_expected_load) * 10
            cognitive_load_score = max(0, min(10, normalized_load))
            
            lesson_metrics[lesson] = {
                'lesson': lesson,
                'total_utterances': total_utterances,
                'unique_phrases': unique_count,
                'repetition_density': round(repetition_density, 2),
                'repetition_rate': round(repetition_rate, 2),
                'phrases_with_practice': repeated_phrases,
                'new_items': new_items,
                'repetition_items': repetition_items,
                'reinforcement_items': reinforcement_items,
                'review_items': review_items,
                'total_items': total_items,
                'novelty_ratio': new_items / total_items if total_items > 0 else 0,
                'review_ratio': review_items / total_items if total_items > 0 else 0,
                'raw_load_score': round(load_score, 1),
                'cognitive_load_score': round(cognitive_load_score, 1)
            }
        
        return lesson_metrics
    
    def update_database_metrics(self, lesson_metrics: Dict[int, Dict]):
        """Update cognitive load metrics in database."""
        print("Updating cognitive load metrics in database...")
        
        with DatabaseWriter() as db:
            for lesson_num, metrics in lesson_metrics.items():
                db.update_cognitive_load(lesson_num, metrics)
        
        print(f"✅ Updated metrics for {len(lesson_metrics)} lessons")
    
    def run_full_analysis(self):
        """Run complete cross-lesson analysis and update database."""
        print("🚀 Starting database-first cross-lesson analysis...")
        print("=" * 60)
        
        # Load data from database
        self.load_data_from_database()
        
        # Process sequential analysis
        self.process_sequential_analysis()
        
        # Calculate metrics
        lesson_metrics = self.calculate_lesson_metrics()
        
        # Update database with results
        self.update_database_metrics(lesson_metrics)
        
        # Print summary
        print("\n" + "=" * 60)
        print("✅ Cross-lesson analysis complete!")
        print("\n📊 Lesson Metrics Summary:")
        
        for lesson, metrics in lesson_metrics.items():
            print(f"\nLesson {lesson}:")
            print(f"  Repetition density: {metrics['repetition_density']}x")
            print(f"  Novelty ratio: {metrics['novelty_ratio']:.1%}")
            print(f"  Review items: {metrics['review_items']}")
            print(f"  Cognitive load: {metrics['cognitive_load_score']}/10")
        
        # Validation summary
        print("\n🔍 Validation Results:")
        densities = [m['repetition_density'] for m in lesson_metrics.values()]
        all_good_density = all(d > 1.0 for d in densities)
        print(f"  Repetition densities > 1.0: {'✅' if all_good_density else '❌'}")
        
        lesson_3_novelty = lesson_metrics.get(3, {}).get('novelty_ratio', 1.0)
        good_novelty = lesson_3_novelty < 0.8
        print(f"  Lesson 3 novelty < 80%: {'✅' if good_novelty else '❌'} ({lesson_3_novelty:.1%})")
        
        total_review = sum(lesson_metrics.get(l, {}).get('review_items', 0) for l in [4, 5])
        has_review = total_review > 0
        print(f"  Review items in lessons 4-5: {'✅' if has_review else '❌'} ({total_review})")
        
        load_variation = max(m['cognitive_load_score'] for m in lesson_metrics.values()) - \
                        min(m['cognitive_load_score'] for m in lesson_metrics.values())
        good_variation = load_variation > 1.0
        print(f"  Cognitive load variation: {'✅' if good_variation else '❌'} ({load_variation:.1f})")
        
        print("\n🗄️  All metrics updated in Supabase database")
        
        self.conn.close()
        return lesson_metrics

def main():
    """Run database-first cross-lesson analysis."""
    try:
        analyzer = DatabaseCrossLessonAnalyzer(lessons_to_analyze=[1, 2, 3, 4, 5])
        analyzer.run_full_analysis()
        
        print("\n🎉 Database-first analysis pipeline complete!")
        print("Ready for production use with direct database operations.")
        
    except Exception as e:
        print(f"❌ Error in cross-lesson analysis: {e}")
        raise

if __name__ == "__main__":
    main()