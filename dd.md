# Alive-Progress Implementation Guide

## Overview

This document details the implementation of `alive-progress` in the Pimsleur data processing scripts, including issues encountered and solutions applied.

## Implementation Details

### Basic Setup

```python
from alive_progress import alive_bar

# For multiple file processing with progress tracking
if len(files_to_process) > 1:
    with alive_bar(
        len(files_to_process),
        title="📚 Processing lessons",
        spinner="waves",
        dual_line=True,
        length=40,
        force_tty=True,
    ) as bar:
        for transcript_path in files_to_process:
            lesson_num = int(transcript_path.stem.split("_")[4])
            bar.text = f"📖 Lesson {lesson_num}"
            count = process_lesson(transcript_path, output_dir)
            total_conversations += count
            bar()  # Increment progress
```

### Configuration Parameters

- `title`: Main progress bar label with emoji for visual appeal
- `spinner`: Animation style ("waves" provides smooth visual feedback)
- `dual_line`: Enables secondary text line for detailed status
- `length`: Progress bar width (40 characters for terminal compatibility)
- `force_tty`: Ensures progress bar displays even in non-interactive environments
- `bar.text`: Dynamic status updates showing current item being processed

### Key Features Used

#### Dynamic Text Updates

```python
bar.text = f"📖 Lesson {lesson_num}"
```

Updates the secondary line with current processing status.

#### Manual Progress Increment

```python
bar()  # Increment by 1
```

Called after each item is processed to advance the progress bar.

## Issues Encountered & Solutions

### Issue 1: Environment Dependencies

**Problem**: `ModuleNotFoundError: No module named 'alive_progress'`
**Solution**: Use poetry environment to access installed dependencies:

```bash
poetry run python script.py
```

### Issue 2: Multiple Lesson Support

**Problem**: Original argument parsing only supported single lesson (`--lesson`)
**Solution**: Updated to support multiple lessons with `nargs="+"`

```python
parser.add_argument(
    "--lessons",
    nargs="+",
    type=int,
    help="Lesson numbers to process (e.g., --lessons 1 2 3 or --lessons 1-5)",
)
```

### Issue 3: Progress Bar for Single vs Multiple Items

**Problem**: Progress bar unnecessary for single item processing
**Solution**: Conditional progress bar activation:

```python
if len(files_to_process) > 1:
    # Use progress bar for multiple files
    with alive_bar(...) as bar:
        # Process with progress tracking
else:
    # Process single file without progress bar
    process_lesson(files_to_process[0], output_dir)
```

### Issue 4: Range Parsing Integration

**Problem**: Supporting lesson ranges (e.g., "1-5") while maintaining progress tracking
**Solution**: Parse ranges first, then apply progress bar to resulting file list:

```python
def parse_lesson_range(lessons_arg: List[str]) -> List[int]:
    lesson_numbers = []
    for arg in lessons_arg:
        if '-' in arg:
            start, end = map(int, arg.split('-'))
            lesson_numbers.extend(range(start, end + 1))
        else:
            lesson_numbers.append(int(arg))
    return sorted(list(set(lesson_numbers)))
```

## Best Practices Applied

### 1. Conditional Progress Bars

Only show progress bars when processing multiple items to avoid unnecessary overhead for single operations.

### 2. Meaningful Status Updates

Use `bar.text` to show current processing context, making it clear what's happening at each step.

### 3. Visual Enhancement

- Use emojis in titles and status text for better visual appeal
- Choose appropriate spinner styles that match the operation type

### 4. Terminal Compatibility

- Set `force_tty=True` for consistent behavior across different terminal environments
- Use reasonable progress bar lengths (40 characters) that work in standard terminals

## Final Working Implementation

The successful implementation in `extract_conversations.py` demonstrates:

- Clean conditional progress bar usage
- Dynamic status updates with meaningful context
- Proper integration with existing argument parsing
- Consistent visual styling across the project

This approach can be replicated in other scripts requiring progress tracking for batch operations.

## Official Best Practices & Advanced Features

### Recommended Usage Patterns

Based on the official documentation, here are patterns we could improve:

#### 1. Using `alive_it()` for Simpler Iteration

```python
# Instead of manual bar() calls
from alive_progress import alive_it

for transcript_path in alive_it(files_to_process, title="📚 Processing lessons"):
    lesson_num = int(transcript_path.stem.split("_")[4])
    count = process_lesson(transcript_path, output_dir)
    total_conversations += count
```

#### 2. Mode Selection Optimization

Our current implementation uses "Auto mode" (with known total), which is optimal for:

- Full widget support including ETA and throughput
- Most accurate progress tracking
- Better user experience

#### 3. Enhanced Configuration Options

```python
with alive_bar(
    len(files_to_process),
    title="📚 Processing lessons",
    spinner="waves",
    dual_line=True,
    length=40,
    force_tty=True,
    # Additional official options we could use:
    manual=False,  # Auto mode (default)
    file=sys.stdout,  # Output destination
    bar="classic",  # Bar style
    theme="smooth",  # Matching spinner/bar set
) as bar:
    # Processing loop
```

### Advanced Features We Could Leverage

#### 1. Skip Tracking for Better Throughput

```python
# Mark items as skipped for more accurate metrics
if should_skip_file(transcript_path):
    bar.skip()
    continue
```

#### 2. Units and Scaling

```python
# For file processing with size information
with alive_bar(
    total_size,
    title="📚 Processing data",
    unit="B",  # Bytes
    scale="SI"  # SI scaling (KB, MB, GB)
) as bar:
    # Update with actual bytes processed
    bar(bytes_processed)
```

#### 3. Final Receipt Information

The library automatically provides detailed statistics after completion:

- Total items processed
- Processing throughput
- Elapsed time
- ETA accuracy

### Performance Optimizations

#### 1. Multithreaded Updates

Alive-progress automatically uses multithreaded bar updates to minimize CPU overhead during intensive processing.

#### 2. Intelligent ETA Calculation

Uses Exponential Smoothing Algorithm for accurate ETA predictions, especially beneficial for variable processing times.

#### 3. Dynamic Spinner Speed

Spinner speed automatically reflects processing throughput, providing visual feedback about performance.

### Alternative Patterns to Consider

#### For Unknown Total Counts

```python
# "Unknown mode" for indeterminate progress
with alive_bar() as bar:  # No total specified
    for item in items:
        process_item(item)
        bar()  # Still increment for throughput tracking
```

#### For Manual Control

```python
# "Manual mode" for percentage-based control
with alive_bar(manual=True) as bar:
    for i, item in enumerate(items):
        process_item(item)
        percentage = (i + 1) / len(items)
        bar(percentage)  # Set exact percentage
```

## Recommendations for Enhancement

### 1. Consider `alive_it()` for Cleaner Code

Our current implementation could be simplified using `alive_it()` for automatic iteration tracking.

### 2. Add Error Handling with Progress

```python
with alive_bar(len(files_to_process), title="📚 Processing lessons") as bar:
    for transcript_path in files_to_process:
        try:
            count = process_lesson(transcript_path, output_dir)
            total_conversations += count
        except Exception as e:
            bar.skip()  # Mark as skipped rather than failed increment
            logger.error(f"Failed to process {transcript_path}: {e}")
            continue
        bar()
```

### 3. Leverage Final Statistics

The automatic final receipt provides valuable metrics that could be logged or displayed for performance analysis.

### 4. Consider Theme Consistency

Using `theme="smooth"` ensures spinner and bar styles are visually consistent across the application.
