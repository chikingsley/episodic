#!/usr/bin/env python3
"""
Deduplicates utterances from lesson CSV files.
Creates new files with _dedup.csv suffix containing unique utterances.
"""

import csv
import pathlib
import argparse
from typing import Dict, List, Set
from collections import OrderedDict


def deduplicate_utterances(input_path: pathlib.Path, output_path: pathlib.Path):
    """
    Read CSV file and create deduplicated version.
    Keeps first occurrence of each unique utterance text.
    """
    
    # Track unique utterances while preserving order
    seen_texts: Set[str] = set()
    unique_rows: List[Dict[str, str]] = []
    
    # Read the CSV file
    with open(input_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            utterance_text = row['text']
            
            # Only add if we haven't seen this text before
            if utterance_text not in seen_texts:
                seen_texts.add(utterance_text)
                unique_rows.append(row)
    
    # Write deduplicated data to new CSV
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        if unique_rows:
            fieldnames = unique_rows[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for row in unique_rows:
                writer.writerow(row)
    
    # Print statistics
    print(f"📊 Deduplication Statistics for {input_path.name}:")
    print(f"   Original utterances: {len(seen_texts) + (reader.line_num - len(unique_rows) - 1)}")
    print(f"   Unique utterances: {len(unique_rows)}")
    print(f"   Duplicates removed: {reader.line_num - len(unique_rows) - 1}")
    print(f"   💾 Saved to: {output_path}")


def main():
    """Main function with argument parsing."""
    parser = argparse.ArgumentParser(
        description="Deduplicate utterances from lesson CSV files"
    )
    parser.add_argument(
        "--input",
        type=str,
        default="02_scripts/analysis/lesson_01_utterances.csv",
        help="Input CSV file path (default: 02_scripts/analysis/lesson_01_utterances.csv)",
    )
    parser.add_argument(
        "--lesson",
        type=int,
        help="Lesson number (alternative to --input, e.g., --lesson 1)",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all lesson files in the analysis directory",
    )
    
    args = parser.parse_args()
    
    project_root = pathlib.Path(__file__).parent.parent
    analysis_dir = project_root / "02_scripts" / "analysis"
    
    # Determine which files to process
    files_to_process = []
    
    if args.all:
        # Process all lesson files
        files_to_process = sorted(analysis_dir.glob("lesson_*_utterances.csv"))
        if not files_to_process:
            print("❌ No lesson files found in analysis directory")
            return
    elif args.lesson:
        # Process specific lesson by number
        input_path = analysis_dir / f"lesson_{args.lesson:02d}_utterances.csv"
        if not input_path.exists():
            print(f"❌ File not found: {input_path}")
            return
        files_to_process = [input_path]
    else:
        # Process file specified by --input
        input_path = pathlib.Path(args.input)
        if not input_path.is_absolute():
            input_path = project_root / input_path
        if not input_path.exists():
            print(f"❌ File not found: {input_path}")
            return
        files_to_process = [input_path]
    
    print("🚀 Deduplicating utterances")
    print("=" * 60)
    
    # Process each file
    for input_path in files_to_process:
        # Create output filename
        output_filename = input_path.stem + "_dedup.csv"
        output_path = input_path.parent / output_filename
        
        deduplicate_utterances(input_path, output_path)
        print()
    
    print("=" * 60)
    print("🎉 Deduplication complete!")


if __name__ == "__main__":
    main()