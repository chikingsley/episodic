#!/usr/bin/env python3
"""
Analyze the phrases table to understand data quality issues.
"""

import sys
import pathlib
import re
from collections import Counter

# Add path for database writer
sys.path.append(str(pathlib.Path(__file__).parent / "02_scripts"))
from db.database_writer import DatabaseWriter

def analyze_phrases_table():
    """Analyze the phrases table for data quality issues."""
    
    with DatabaseWriter() as db:
        with db.conn.cursor() as cur:
            print("=== PHRASES TABLE ANALYSIS ===\n")
            
            # 1. Get sample of recent phrases
            print("📋 Sample of recent phrases:")
            cur.execute("SELECT id, text FROM phrases ORDER BY id DESC LIMIT 20")
            for id, text in cur.fetchall():
                print(f"   ID {id}: {text}")
            
            # 2. Overall statistics
            print("\n📊 Overall statistics:")
            cur.execute("""
                SELECT 
                    COUNT(*) as total_phrases,
                    COUNT(DISTINCT text) as unique_phrases,
                    AVG(LENGTH(text)) as avg_length,
                    MIN(LENGTH(text)) as min_length,
                    MAX(LENGTH(text)) as max_length
                FROM phrases
            """)
            stats = cur.fetchone()
            print(f"   Total phrases: {stats[0]}")
            print(f"   Unique phrases: {stats[1]}")
            print(f"   Duplicates: {stats[0] - stats[1]}")
            print(f"   Average length: {stats[2]:.1f}")
            print(f"   Length range: {stats[3]} - {stats[4]}")
            
            # 3. Find exact duplicates
            print("\n🔄 Exact duplicates:")
            cur.execute("""
                SELECT text, COUNT(*) as count 
                FROM phrases 
                GROUP BY text 
                HAVING COUNT(*) > 1 
                ORDER BY count DESC
                LIMIT 10
            """)
            duplicates = cur.fetchall()
            for text, count in duplicates:
                print(f"   '{text}' appears {count} times")
            
            # 4. Find near-duplicates (punctuation differences)
            print("\n🔄 Near-duplicates (punctuation differences):")
            cur.execute("SELECT id, text FROM phrases")
            all_phrases = cur.fetchall()
            
            # Group by normalized text
            normalized_groups = {}
            for id, text in all_phrases:
                # Remove punctuation and normalize
                normalized = re.sub(r'[^\w\s]', '', text.lower()).strip()
                if normalized not in normalized_groups:
                    normalized_groups[normalized] = []
                normalized_groups[normalized].append((id, text))
            
            # Find groups with multiple variations
            near_dupes = [(k, v) for k, v in normalized_groups.items() if len(v) > 1]
            for norm_text, variations in sorted(near_dupes, key=lambda x: len(x[1]), reverse=True)[:10]:
                if len(variations) > 1:
                    print(f"\n   Base: '{norm_text}'")
                    for id, text in variations[:3]:  # Show first 3 variations
                        print(f"      - ID {id}: '{text}'")
                    if len(variations) > 3:
                        print(f"      ... and {len(variations) - 3} more variations")
            
            # 5. Find very short phrases (fragments)
            print("\n📏 Very short phrases (likely fragments):")
            cur.execute("""
                SELECT id, text, LENGTH(text) as len
                FROM phrases
                WHERE LENGTH(text) < 10
                ORDER BY len
                LIMIT 10
            """)
            for id, text, length in cur.fetchall():
                print(f"   ID {id} ({length} chars): '{text}'")
            
            # 6. Find very long phrases (multiple sentences)
            print("\n📏 Very long phrases (likely multiple sentences):")
            cur.execute("""
                SELECT id, text, LENGTH(text) as len
                FROM phrases
                WHERE LENGTH(text) > 80
                ORDER BY len DESC
                LIMIT 10
            """)
            for id, text, length in cur.fetchall():
                print(f"   ID {id} ({length} chars): '{text[:60]}...'")
            
            # 7. Find English or mixed language entries
            print("\n🌐 Potential English/mixed language entries:")
            cur.execute("SELECT id, text FROM phrases")
            english_pattern = re.compile(r'^[a-zA-Z\s\.,!?]+$')  # Only English chars
            french_pattern = re.compile(r'[àâäçèéêëîïôùûüÿæœÀÂÄÇÈÉÊËÎÏÔÙÛÜŸÆŒ]')
            
            for id, text in cur.fetchall()[:500]:  # Check first 500
                if english_pattern.match(text) and not french_pattern.search(text):
                    print(f"   ID {id}: '{text}'")
                    if id > 10:  # Just show first 10
                        break
            
            # 8. Analyze phrase patterns
            print("\n📊 Common phrase starters:")
            starters = Counter()
            for id, text in all_phrases:
                words = text.split()
                if words:
                    starters[words[0].lower()] += 1
            
            for starter, count in starters.most_common(10):
                print(f"   '{starter}': {count} phrases")

if __name__ == "__main__":
    analyze_phrases_table()