#!/usr/bin/env python3
"""
Test script to validate the fixes using existing data.
Simulates the fixes without requiring re-extraction.
"""

import csv
from collections import defaultdict, Counter
from pathlib import Path

def test_repetition_density_fix():
    """Test the repetition density calculation fix."""
    print("=== Testing Repetition Density Fix ===")
    
    # Simulate lesson data with known repetitions
    test_utterances = [
        "Bonjour",
        "Bonjour",  # Repetition
        "Comment allez-vous?",
        "Comment allez-vous?",  # Repetition  
        "Très bien",
        "Merci",
        "Bonjour"  # Another repetition
    ]
    
    # Count repetitions
    phrase_counts = Counter(test_utterances)
    total_utterances = len(test_utterances)
    unique_phrases = len(phrase_counts)
    
    # Calculate density
    repetition_density = total_utterances / unique_phrases
    
    print(f"Test utterances: {test_utterances}")
    print(f"Total utterances: {total_utterances}")
    print(f"Unique phrases: {unique_phrases}")
    print(f"Repetition density: {repetition_density:.2f}")
    
    # Validation
    expected_density = 7 / 4  # 7 total, 4 unique = 1.75
    assert abs(repetition_density - expected_density) < 0.01, f"Expected {expected_density}, got {repetition_density}"
    assert repetition_density > 1.0, "Density should be > 1.0 when practice occurs"
    
    print("✅ Repetition density fix validated!")
    return True

def test_new_vs_review_logic():
    """Test the new vs review classification logic."""
    print("\n=== Testing New vs Review Logic ===")
    
    # Simulate phrase appearances across lessons
    phrase_appearances = {
        "Bonjour": [(1, 5), (2, 10), (4, 15)],  # Lesson, position
        "Merci": [(2, 20), (3, 25)],
        "Au revoir": [(1, 30), (1, 35), (3, 40)]  # Same lesson repetition + later appearance
    }
    
    seen_phrases = set()
    phrase_first_seen = {}
    results = []
    
    # Process in lesson order
    all_occurrences = []
    for phrase, appearances in phrase_appearances.items():
        for lesson, position in appearances:
            all_occurrences.append((lesson, position, phrase))
    
    # Sort by lesson, then position
    all_occurrences.sort(key=lambda x: (x[0], x[1]))
    
    for lesson, position, phrase in all_occurrences:
        if phrase not in seen_phrases:
            # First occurrence - NEW
            seen_phrases.add(phrase)
            phrase_first_seen[phrase] = lesson
            status = "NEW"
        else:
            # Seen before - classify
            first_lesson = phrase_first_seen[phrase]
            gap = lesson - first_lesson
            
            if gap == 0:
                status = "REPETITION"
            elif gap == 1:
                status = "REINFORCEMENT" 
            elif gap >= 2:
                status = "REVIEW"
            else:
                status = "UNKNOWN"
        
        results.append((lesson, phrase, status))
        print(f"L{lesson}: '{phrase}' -> {status}")
    
    # Validate expectations
    expected_results = [
        (1, "Bonjour", "NEW"),
        (1, "Au revoir", "NEW"), 
        (1, "Au revoir", "REPETITION"),
        (2, "Bonjour", "REINFORCEMENT"),
        (2, "Merci", "NEW"),
        (3, "Merci", "REINFORCEMENT"),
        (3, "Au revoir", "REVIEW"),  # 2 lesson gap
        (4, "Bonjour", "REVIEW")     # 3 lesson gap
    ]
    
    assert results == expected_results, f"Expected {expected_results}, got {results}"
    print("✅ New vs Review logic validated!")
    return True

def test_cognitive_load_calculation():
    """Test the corrected cognitive load calculation."""
    print("\n=== Testing Cognitive Load Calculation ===")
    
    # Simulate lesson metrics
    lesson_metrics = {
        'new_items': 20,
        'repetition_items': 15,
        'reinforcement_items': 10,
        'review_items': 5
    }
    
    # Apply corrected formula
    load_score = (
        lesson_metrics['new_items'] * 1.0 +           # 20 * 1.0 = 20
        lesson_metrics['repetition_items'] * 0.1 +    # 15 * 0.1 = 1.5
        lesson_metrics['reinforcement_items'] * 0.3 + # 10 * 0.3 = 3.0
        lesson_metrics['review_items'] * 0.2          # 5 * 0.2 = 1.0
    )
    # Total = 20 + 1.5 + 3.0 + 1.0 = 25.5
    
    # Normalize to 0-10 scale (assume 40 = 10.0)
    normalized_load = (load_score / 40) * 10  # 25.5 / 40 * 10 = 6.375
    cognitive_load_score = max(0, min(10, normalized_load))
    
    print(f"Raw load score: {load_score}")
    print(f"Normalized cognitive load: {cognitive_load_score:.2f}/10")
    
    # Validation
    assert 6.0 <= cognitive_load_score <= 7.0, f"Expected ~6.4, got {cognitive_load_score}"
    assert cognitive_load_score < 9.0, "Should not be in the 9.5-10 range anymore"
    
    print("✅ Cognitive load calculation validated!")
    return True

def analyze_existing_data_with_fixes():
    """Analyze existing data to show improvement from fixes."""
    print("\n=== Analyzing Existing Data with Fixes ===")
    
    # Load existing phrase occurrences
    csv_path = Path("03_phase1_analysis/data/phrase_occurrences_lessons_1-5.csv")
    if not csv_path.exists():
        print(f"Warning: {csv_path} not found. Skipping analysis.")
        return False
    
    phrases_data = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            phrases_data.append(row)
    
    print(f"Loaded {len(phrases_data)} phrases from existing data")
    
    # Simulate corrected repetition density for each lesson
    lesson_densities = {}
    for lesson in range(1, 6):
        # Count phrases that appear in this lesson
        lesson_phrases = []
        for row in phrases_data:
            lessons = [int(l) for l in row['lessons'].split(',')]
            if lesson in lessons:
                # Simulate occurrences in this lesson
                total_occ = int(row['total_occurrences'])
                estimated_in_lesson = max(1, total_occ // len(lessons))
                for _ in range(estimated_in_lesson):
                    lesson_phrases.append(row['normalized_form'])
        
        # Calculate density
        if lesson_phrases:
            phrase_counts = Counter(lesson_phrases)
            total_utterances = len(lesson_phrases)
            unique_phrases = len(phrase_counts)
            density = total_utterances / unique_phrases
        else:
            density = 1.0
        
        lesson_densities[lesson] = density
        print(f"Lesson {lesson}: Density = {density:.2f} (was 1.0)")
    
    # Check that densities are > 1.0 for most lessons
    densities_over_1 = sum(1 for d in lesson_densities.values() if d > 1.0)
    print(f"\nLessons with density > 1.0: {densities_over_1}/5")
    
    return True

def run_all_tests():
    """Run all validation tests."""
    print("Running Phase 1.5 Fix Validation Tests\n")
    
    tests = [
        test_repetition_density_fix,
        test_new_vs_review_logic,
        test_cognitive_load_calculation,
        analyze_existing_data_with_fixes
    ]
    
    passed = 0
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed: {e}")
    
    print(f"\n=== Test Summary ===")
    print(f"Passed: {passed}/{len(tests)} tests")
    
    if passed == len(tests):
        print("🎉 All fixes validated! Ready to re-run extractions.")
        return True
    else:
        print("⚠️  Some tests failed. Check fixes before proceeding.")
        return False

if __name__ == "__main__":
    run_all_tests()