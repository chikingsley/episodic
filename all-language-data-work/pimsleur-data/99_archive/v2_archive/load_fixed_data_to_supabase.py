#!/usr/bin/env python3
"""
Load corrected Phase 1.5 analysis data to Supabase.
This script loads the fixed analysis data into the database for testing and validation.
"""

import csv
import json
import os
from pathlib import Path
from typing import Dict, List, Optional

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class SupabaseDataLoader:
    """Loads corrected analysis data to Supabase."""
    
    def __init__(self):
        """Initialize Supabase client."""
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError(
                "Missing Supabase credentials. Please set SUPABASE_URL and "
                "SUPABASE_ANON_KEY (or SUPABASE_SERVICE_KEY) in your .env file"
            )
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        print(f"Connected to Supabase at {self.supabase_url}")
    
    def clear_existing_data(self):
        """Clear existing data for clean load."""
        print("Clearing existing data...")
        
        # Delete in reverse dependency order
        tables = ["phrase_occurrences", "cognitive_load", "templates", "utterances", "phrases", "lessons"]
        
        for table in tables:
            try:
                result = self.supabase.table(table).delete().gte("id", 0).execute()
                print(f"Cleared {table}: {len(result.data) if result.data else 0} rows")
            except Exception as e:
                print(f"Warning: Could not clear {table}: {e}")
    
    def load_lessons(self, lessons_data: List[int]):
        """Load lesson metadata."""
        print("Loading lessons...")
        
        lesson_records = []
        for lesson_num in lessons_data:
            lesson_records.append({
                "lesson_number": lesson_num,
                "title": f"French I - Lesson {lesson_num:02d}"
            })
        
        result = self.supabase.table("lessons").insert(lesson_records).execute()
        print(f"Loaded {len(result.data)} lessons")
        
        # Return lesson_number -> id mapping
        lesson_map = {row["lesson_number"]: row["id"] for row in result.data}
        return lesson_map
    
    def load_utterances_from_analysis(self, lesson_map: Dict[int, int]):
        """Load utterances from the utterance analysis files."""
        print("Loading utterances from analysis files...")
        
        utterances_dir = Path("01_raw_data/analysis_outputs/utterances")
        utterance_records = []
        
        for lesson_num in sorted(lesson_map.keys()):
            file_path = utterances_dir / f"French_I_-_Lesson_{lesson_num:02d}_utterance_analysis_fixed.csv"
            
            if not file_path.exists():
                print(f"Warning: {file_path} not found")
                continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    utterance_records.append({
                        "lesson_id": lesson_map[lesson_num],
                        "position_in_lesson": int(row["position_in_lesson"]),
                        "speaker": row["speaker"],
                        "text": row["utterance_text"],
                        "language": "fr"
                    })
        
        # Insert in batches
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(utterance_records), batch_size):
            batch = utterance_records[i:i + batch_size]
            result = self.supabase.table("utterances").insert(batch).execute()
            total_inserted += len(result.data)
            print(f"Loaded utterances batch: {len(result.data)} records")
        
        print(f"Total utterances loaded: {total_inserted}")
        return total_inserted
    
    def load_phrases_and_occurrences(self, lesson_map: Dict[int, int]):
        """Load phrases and their occurrences from phrase tracking data."""
        print("Loading phrases and occurrences...")
        
        # Load phrase tracking data
        phrase_tracking_path = Path("03_phase1_analysis/data/phrase_tracking_fixed_lessons_1-5.csv")
        
        if not phrase_tracking_path.exists():
            print(f"Warning: {phrase_tracking_path} not found")
            return 0, 0
        
        # First, collect unique phrases
        unique_phrases = set()
        phrase_data = []
        
        with open(phrase_tracking_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                phrase_text = row["phrase"]
                unique_phrases.add(phrase_text)
                phrase_data.append(row)
        
        # Insert unique phrases
        phrase_records = [{"text": phrase} for phrase in unique_phrases]
        phrases_result = self.supabase.table("phrases").insert(phrase_records).execute()
        print(f"Loaded {len(phrases_result.data)} unique phrases")
        
        # Create phrase text -> id mapping
        phrase_map = {row["text"]: row["id"] for row in phrases_result.data}
        
        # Get utterances for phrase occurrences mapping
        utterances_result = self.supabase.table("utterances").select("*").execute()
        utterance_map = {}  # (lesson_id, position) -> utterance_id
        
        for utterance in utterances_result.data:
            key = (utterance["lesson_id"], utterance["position_in_lesson"])
            utterance_map[key] = utterance["id"]
        
        # Create phrase occurrences
        occurrence_records = []
        
        for row in phrase_data:
            phrase_text = row["phrase"]
            phrase_id = phrase_map[phrase_text]
            first_lesson = int(row["first_lesson"])
            first_position = int(row["first_position"])
            is_new = row["is_new"].lower() == "true"
            is_review = row["is_review"].lower() == "true"
            
            # Find the utterance_id for this phrase's first occurrence
            lesson_id = lesson_map.get(first_lesson)
            if lesson_id:
                utterance_key = (lesson_id, first_position)
                utterance_id = utterance_map.get(utterance_key)
                
                if utterance_id:
                    occurrence_records.append({
                        "phrase_id": phrase_id,
                        "utterance_id": utterance_id,
                        "is_new": is_new,
                        "is_review": is_review
                    })
        
        # Insert phrase occurrences
        if occurrence_records:
            occurrences_result = self.supabase.table("phrase_occurrences").insert(occurrence_records).execute()
            print(f"Loaded {len(occurrences_result.data)} phrase occurrences")
            return len(phrases_result.data), len(occurrences_result.data)
        
        return len(phrases_result.data), 0
    
    def load_cognitive_load_metrics(self, lesson_map: Dict[int, int]):
        """Load cognitive load metrics from the analysis data."""
        print("Loading cognitive load metrics...")
        
        analysis_path = Path("03_phase1_analysis/data/cross_lesson_analysis_phase1_5_fixed.json")
        
        if not analysis_path.exists():
            print(f"Warning: {analysis_path} not found")
            return 0
        
        with open(analysis_path, 'r', encoding='utf-8') as f:
            analysis_data = json.load(f)
        
        load_records = []
        lesson_metrics = analysis_data.get("lesson_metrics", {})
        
        for lesson_str, metrics in lesson_metrics.items():
            lesson_num = int(lesson_str)
            lesson_id = lesson_map.get(lesson_num)
            
            if lesson_id:
                load_records.append({
                    "lesson_id": lesson_id,
                    "load_score": metrics.get("cognitive_load_score"),
                    "novelty_ratio": metrics.get("novelty_ratio"),
                    "repetition_density": metrics.get("repetition_density"),
                    "core_introductions": metrics.get("new_items"),
                    "derived_phrases": metrics.get("review_items", 0) + metrics.get("reinforcement_items", 0)
                })
        
        if load_records:
            result = self.supabase.table("cognitive_load").insert(load_records).execute()
            print(f"Loaded {len(result.data)} cognitive load records")
            return len(result.data)
        
        return 0
    
    def load_all_data(self, clear_existing: bool = True):
        """Load all corrected data to Supabase."""
        print("=== Loading Fixed Phase 1.5 Data to Supabase ===")
        
        if clear_existing:
            self.clear_existing_data()
        
        # Load lessons (1-5 from our analysis)
        lessons_analyzed = [1, 2, 3, 4, 5]
        lesson_map = self.load_lessons(lessons_analyzed)
        
        # Load utterances
        utterances_count = self.load_utterances_from_analysis(lesson_map)
        
        # Load phrases and occurrences
        phrases_count, occurrences_count = self.load_phrases_and_occurrences(lesson_map)
        
        # Load cognitive load metrics
        load_count = self.load_cognitive_load_metrics(lesson_map)
        
        print("\n=== Load Summary ===")
        print(f"Lessons: {len(lesson_map)}")
        print(f"Utterances: {utterances_count}")
        print(f"Unique phrases: {phrases_count}")
        print(f"Phrase occurrences: {occurrences_count}")
        print(f"Cognitive load records: {load_count}")
        print("\nData loading complete!")

def main():
    """Load the corrected data to Supabase."""
    try:
        loader = SupabaseDataLoader()
        loader.load_all_data(clear_existing=True)
        
        print("\n✅ Fixed analysis data successfully loaded to Supabase!")
        print("\nNow you can query the database to validate the fixes:")
        print("- Check repetition densities are > 1.0")
        print("- Verify review items exist in lessons 4-5")
        print("- Confirm cognitive load scores show variation")
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        raise

if __name__ == "__main__":
    main()