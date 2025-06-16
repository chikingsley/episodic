#!/usr/bin/env python3
"""
Production pipeline for Pimsleur analysis with direct Supabase database operations.
Replaces CSV/JSON workflows with database-first approach for scalable production use.
"""

import os
import sys
import time
import pathlib
from typing import List, Optional

from dotenv import load_dotenv

# Import our database-first modules
sys.path.append(str(pathlib.Path(__file__).parent))
from extraction.analyze_lessons_utterances_db import process_lesson_to_db
from extraction.analyze_lessons_phrases_db import process_lesson_phrases_to_db
from analysis.cross_lesson_integration_db import DatabaseCrossLessonAnalyzer
from db.database_writer import DatabaseWriter

load_dotenv()

class ProductionPipeline:
    """Orchestrates the complete database-first analysis pipeline."""
    
    def __init__(self, lessons: List[int] = None):
        """Initialize production pipeline."""
        self.lessons = lessons or list(range(1, 6))
        self.project_root = pathlib.Path(__file__).parent.parent
        self.source_dir = self.project_root / "01_raw_data" / "transcripts"
        
        # Verify database connection
        try:
            with DatabaseWriter() as db:
                pass  # Just test connection
            print("✅ Database connection verified")
        except Exception as e:
            raise RuntimeError(f"❌ Database connection failed: {e}")
        
        # Check for required files
        missing_files = []
        for lesson in self.lessons:
            file_path = self.source_dir / f"French_I_-_Lesson_{lesson:02d}_human_eval.txt"
            if not file_path.exists():
                missing_files.append(str(file_path))
        
        if missing_files:
            raise FileNotFoundError(f"Missing transcript files: {missing_files}")
        
        print(f"✅ All required files found for lessons {self.lessons}")
    
    def run_utterance_extraction(self) -> int:
        """Run utterance extraction for all lessons."""
        print("\n" + "="*60)
        print("🗣️  PHASE 1: Utterance Extraction")
        print("="*60)
        
        model_name = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
        total_utterances = 0
        
        for lesson in self.lessons:
            file_path = self.source_dir / f"French_I_-_Lesson_{lesson:02d}_human_eval.txt"
            print(f"\nProcessing lesson {lesson}...")
            
            count = process_lesson_to_db(file_path, model_name)
            total_utterances += count
            
            # Small delay to be respectful to API
            time.sleep(1)
        
        print(f"\n✅ Utterance extraction complete: {total_utterances} utterances")
        return total_utterances
    
    def run_phrase_extraction(self) -> int:
        """Run phrase extraction for all lessons."""
        print("\n" + "="*60)
        print("📝 PHASE 2: Phrase Extraction")
        print("="*60)
        
        model_name = os.getenv("MISTRAL_MODEL", "mistral-medium-latest")
        total_phrases = 0
        
        for lesson in self.lessons:
            file_path = self.source_dir / f"French_I_-_Lesson_{lesson:02d}_human_eval.txt"
            print(f"\nProcessing lesson {lesson}...")
            
            count = process_lesson_phrases_to_db(file_path, model_name)
            total_phrases += count
            
            # Small delay to be respectful to API
            time.sleep(1)
        
        print(f"\n✅ Phrase extraction complete: {total_phrases} phrases")
        return total_phrases
    
    def run_cross_lesson_analysis(self):
        """Run cross-lesson analysis and update metrics."""
        print("\n" + "="*60)
        print("🔗 PHASE 3: Cross-Lesson Analysis")
        print("="*60)
        
        analyzer = DatabaseCrossLessonAnalyzer(lessons_to_analyze=self.lessons)
        lesson_metrics = analyzer.run_full_analysis()
        
        return lesson_metrics
    
    def run_validation_checks(self):
        """Run validation checks on the complete pipeline."""
        print("\n" + "="*60)
        print("✅ PHASE 4: Pipeline Validation")
        print("="*60)
        
        with DatabaseWriter() as db:
            conn = db.conn
            
            with conn.cursor() as cur:
                # Check data completeness
                cur.execute("""
                    SELECT l.lesson_number, COUNT(u.id) as utterance_count
                    FROM lessons l
                    LEFT JOIN utterances u ON l.id = u.lesson_id
                    WHERE l.lesson_number = ANY(%s)
                    GROUP BY l.lesson_number
                    ORDER BY l.lesson_number
                """, (self.lessons,))
                
                utterance_counts = cur.fetchall()
                print("\n📊 Data Completeness:")
                for lesson_num, count in utterance_counts:
                    print(f"  Lesson {lesson_num}: {count} utterances")
                
                # Check phrase counts
                cur.execute("SELECT COUNT(DISTINCT text) FROM phrases")
                phrase_count = cur.fetchone()[0]
                print(f"  Total unique phrases: {phrase_count}")
                
                # Check metrics
                cur.execute("""
                    SELECT l.lesson_number, cl.repetition_density, cl.load_score
                    FROM cognitive_load cl
                    JOIN lessons l ON cl.lesson_id = l.id
                    WHERE l.lesson_number = ANY(%s)
                    ORDER BY l.lesson_number
                """, (self.lessons,))
                
                metrics = cur.fetchall()
                print("\n🧠 Quality Metrics:")
                all_good = True
                
                for lesson_num, rep_density, cog_load in metrics:
                    density_ok = rep_density > 1.0
                    load_ok = 5.0 <= cog_load <= 10.0
                    
                    status = "✅" if (density_ok and load_ok) else "⚠️"
                    print(f"  Lesson {lesson_num}: density={rep_density:.2f}, load={cog_load:.1f} {status}")
                    
                    if not (density_ok and load_ok):
                        all_good = False
                
                print(f"\n🎯 Overall Quality: {'✅ PASS' if all_good else '⚠️  REVIEW NEEDED'}")
                return all_good
    
    def run_full_pipeline(self, skip_extraction: bool = False):
        """Run the complete production pipeline."""
        start_time = time.time()
        
        print("🚀 Starting Production Pipeline")
        print("="*60)
        print(f"📁 Source: {self.source_dir}")
        print(f"📊 Lessons: {self.lessons}")
        print(f"🗄️  Database: Direct Supabase operations")
        print(f"⏰ Started: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            if not skip_extraction:
                # Phase 1: Extract utterances
                utterance_count = self.run_utterance_extraction()
                
                # Phase 2: Extract phrases
                phrase_count = self.run_phrase_extraction()
            else:
                print("\n⏩ Skipping extraction phases (using existing data)")
                utterance_count = phrase_count = "existing"
            
            # Phase 3: Cross-lesson analysis
            lesson_metrics = self.run_cross_lesson_analysis()
            
            # Phase 4: Validation
            validation_passed = self.run_validation_checks()
            
            # Summary
            elapsed = time.time() - start_time
            
            print("\n" + "="*60)
            print("🎉 PRODUCTION PIPELINE COMPLETE")
            print("="*60)
            print(f"⏱️  Total time: {elapsed:.1f} seconds")
            print(f"🗣️  Utterances: {utterance_count}")
            print(f"📝 Phrases: {phrase_count}")
            print(f"📊 Lessons analyzed: {len(lesson_metrics)}")
            print(f"✅ Validation: {'PASSED' if validation_passed else 'NEEDS REVIEW'}")
            print(f"🗄️  All data in Supabase database")
            
            print("\n🚀 Ready for production queries and further analysis!")
            
            return {
                'success': True,
                'utterances': utterance_count,
                'phrases': phrase_count,
                'lessons': len(lesson_metrics),
                'validation_passed': validation_passed,
                'elapsed_time': elapsed
            }
            
        except Exception as e:
            print(f"\n❌ Pipeline failed: {e}")
            raise

def main():
    """Run the production pipeline."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Pimsleur Analysis Production Pipeline")
    parser.add_argument("--lessons", nargs="+", type=int, default=[1, 2, 3, 4, 5],
                       help="Lessons to process (default: 1 2 3 4 5)")
    parser.add_argument("--skip-extraction", action="store_true",
                       help="Skip extraction phases and only run analysis")
    parser.add_argument("--analysis-only", action="store_true",
                       help="Only run cross-lesson analysis")
    
    args = parser.parse_args()
    
    try:
        pipeline = ProductionPipeline(lessons=args.lessons)
        
        if args.analysis_only:
            print("🔗 Running analysis-only mode...")
            pipeline.run_cross_lesson_analysis()
            pipeline.run_validation_checks()
        else:
            result = pipeline.run_full_pipeline(skip_extraction=args.skip_extraction)
            
            if result['success'] and result['validation_passed']:
                print("\n🌟 Pipeline completed successfully!")
                sys.exit(0)
            else:
                print("\n⚠️  Pipeline completed with warnings.")
                sys.exit(1)
                
    except Exception as e:
        print(f"\n💥 Pipeline error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()