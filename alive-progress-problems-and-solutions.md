# `alive-progress`: Common Problems & Solutions

This guide documents common issues encountered while implementing the `alive-progress` library in our Python scripts and the solutions used to resolve them.

---

### 1. Environment: `ModuleNotFoundError`

- **Problem**: The script fails with `ModuleNotFoundError: No module named 'alive_progress'`, even after the package has been installed.
- **Cause**: The script is being run in the global Python environment, not the project's virtual environment where `alive-progress` was installed.
- **Solution**: Always run scripts using `poetry run` to ensure they execute within the correct virtual environment.

  ```bash
  poetry run python your_script.py
  ```

---

### 2. Argument Parsing: Handling Multiple Inputs

- **Problem**: The argument parser was initially set up to accept only a single lesson, but we needed to process multiple lessons at once.
- **Cause**: The `add_argument` function was missing the `nargs` parameter to accept multiple values.
- **Solution**: Update `argparse` to accept a list of inputs by setting `nargs="+"`. This allows the script to receive one or more lesson numbers.

  ```python
  parser.add_argument(
      "--lessons",
      nargs="+",  # Accept one or more arguments
      type=int,
      help="One or more lesson numbers to process (e.g., 1 2 3)",
  )
  ```

---

### 3. UI: Unnecessary Progress Bar for Single Items

- **Problem**: Displaying a progress bar is unnecessary and adds visual clutter when processing only a single file.
- **Cause**: The progress bar logic was being invoked unconditionally.
- **Solution**: Wrap the `alive_bar` context manager in a conditional statement. The progress bar will only be displayed if there is more than one item to process.

  ```python
  if len(files_to_process) > 1:
      # Use a progress bar for multiple files
      with alive_bar(len(files_to_process)) as bar:
          for file in files_to_process:
              process_file(file)
              bar()
  else:
      # Process the single file directly without a progress bar
      process_file(files_to_process[0])
  ```

---

### 4. Input Handling: Supporting Number Ranges

- **Problem**: The argument parser needed to support convenient range inputs (e.g., `1-5`) in addition to single numbers (`1 2 3`).
- **Cause**: The script wasn't equipped to parse hyphenated range strings.
- **Solution**: Create a dedicated parsing function that runs _before_ the main processing logic. This function expands any range arguments into a complete list of numbers, which can then be used to build the final list of files to process.

  ```python
  def parse_lesson_range(lessons_arg: List[str]) -> List[int]:
      """
      Parses a list of strings, expanding ranges like "1-5" into individual numbers.
      """
      lesson_numbers = []
      for arg in lessons_arg:
          if '-' in arg:
              start, end = map(int, arg.split('-'))
              lesson_numbers.extend(range(start, end + 1))
          else:
              lesson_numbers.append(int(arg))
      # Return a sorted list of unique lesson numbers
      return sorted(list(set(lesson_numbers)))
  ```
