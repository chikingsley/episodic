#!/usr/bin/env python3
"""
Migration script to implement utterance-centric architecture.
This will:
1. Add missing columns to utterances table
2. Drop phrase-related tables
3. Create new utterance_patterns table
"""

import sys
import pathlib

# Add path for database writer
sys.path.append(str(pathlib.Path(__file__).parent))
from database_writer import DatabaseWriter

def run_migration():
    """Execute the database migration."""
    
    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            print("🚀 Starting migration to utterance-centric architecture...")
            
            # Step 1: Add missing columns to utterances table
            print("\n1️⃣ Adding missing columns to utterances table...")
            
            try:
                cur.execute("""
                    ALTER TABLE utterances 
                    ADD COLUMN IF NOT EXISTS utterance_type VARCHAR(50),
                    ADD COLUMN IF NOT EXISTS narrator_cue TEXT,
                    ADD COLUMN IF NOT EXISTS core_lemmas TEXT
                """)
                print("   ✅ Added utterance_type, narrator_cue, core_lemmas columns")
            except Exception as e:
                print(f"   ⚠️  Column addition warning: {e}")
            
            # Step 2: Create new utterance_patterns table
            print("\n2️⃣ Creating utterance_patterns table...")
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS utterance_patterns (
                    id SERIAL PRIMARY KEY,
                    utterance_text TEXT UNIQUE NOT NULL,
                    first_lesson INT NOT NULL,
                    last_lesson INT NOT NULL,
                    total_lessons INT NOT NULL,
                    lesson_counts JSONB NOT NULL,
                    persistence_score FLOAT,
                    pattern_type VARCHAR(50),
                    created_at TIMESTAMPTZ DEFAULT NOW()
                )
            """)
            print("   ✅ Created utterance_patterns table")
            
            # Step 3: Drop phrase-related tables (with CASCADE to handle dependencies)
            print("\n3️⃣ Dropping phrase-related tables...")
            
            tables_to_drop = ['templates', 'phrase_occurrences', 'phrases']
            
            for table in tables_to_drop:
                try:
                    cur.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
                    print(f"   ✅ Dropped {table} table")
                except Exception as e:
                    print(f"   ⚠️  Warning dropping {table}: {e}")
            
            # Step 4: Update schema version (if you have a version table)
            print("\n4️⃣ Updating schema...")
            
            # Check current schema state
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """)
            
            tables = [row[0] for row in cur.fetchall()]
            print(f"   📊 Current tables: {', '.join(tables)}")
            
            # Verify utterances table structure
            cur.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'utterances'
                ORDER BY ordinal_position
            """)
            
            columns = cur.fetchall()
            print(f"   📊 Utterances table columns:")
            for col_name, col_type in columns:
                print(f"      - {col_name}: {col_type}")
                
            print("\n✅ Migration completed successfully!")
            print("\n📋 Next steps:")
            print("   1. Update V2 utterance script to populate new fields")
            print("   2. Create cross_lesson_analysis_v3.py script")
            print("   3. Re-run utterance extraction on lessons 1-10")
            print("   4. Run cross-lesson pattern analysis")

if __name__ == "__main__":
    run_migration()