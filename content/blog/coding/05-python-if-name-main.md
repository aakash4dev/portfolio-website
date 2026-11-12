---
title: What Does if __name__ == "__main__" Do in Python?
description: This line makes code run only when a file is executed directly, not when it is imported. Learn how __name__ works and when you need it.
tags: Python, Basics, Modules
keywords: if __name__ == __main__, python if name main, what does if name main do, python __name__, python main function
cover: code PY play
---

The line `if __name__ == "__main__":` makes a block of code run **only when the file is started directly**, for example with `python my_file.py`. When the same file is **imported** by another file, that block is skipped. It lets one file work both as a script you run and as a module you import.

## A short example

```python
# greet.py
def hello(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(hello("world"))
```

Run it directly:

```bash
python greet.py
# Hello, world!
```

Import it from another file:

```python
# app.py
import greet

print(greet.hello("Asha"))
# Hello, Asha!
```

When `app.py` runs, the line `print(hello("world"))` inside `greet.py` does **not** run. You get the function and nothing extra.

## How it works

Every Python file is a **module**, and Python sets a variable named `__name__` in each one.

- If the file is the one you started, `__name__` is the string `"__main__"`.
- If the file was imported, `__name__` is the module's name, such as `"greet"`.

See it for yourself:

```python
# show_name.py
print("My name is:", __name__)
```

```bash
python show_name.py
# My name is: __main__

python -c "import show_name"
# My name is: show_name
```

So the `if` is a plain comparison of two strings. There is nothing special about it beyond that.

## Why you need it

Python **runs all top-level code** in a file when the file is imported. Without the guard, importing a file has side effects.

```python
# report.py (without a guard)
def build_report():
    return "report data"

print("Building report...")        # runs on import!
send_email(build_report())         # runs on import!
```

```python
# other.py
from report import build_report    # prints and sends an email. Not what you wanted.
```

With the guard, importing gives you the function and nothing else:

```python
# report.py (with a guard)
def build_report():
    return "report data"

if __name__ == "__main__":
    print("Building report...")
    send_email(build_report())
```

## The recommended pattern: a main function

Keep the logic in a function named `main`, and call it from the guard.

```python
import sys

def add(a: float, b: float) -> float:
    return a + b

def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python add.py <a> <b>")
        return 1
    print(add(float(sys.argv[1]), float(sys.argv[2])))
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

Why this is better than putting the code straight under the `if`:

- **No accidental global variables.** Variables created under the `if` are global to the module. Inside `main()` they are local.
- **Testable.** A test can import the file and call `main()` or `add()` directly.
- **Reusable.** Other tools can call `main()` as an entry point.
- **Exit codes.** `sys.exit(main())` passes 0 for success or another number for failure to the shell.

## Where it matters most

### 1. Files that are both a library and a script

A module with useful functions that also does something when run.

### 2. Tests

Test tools import your files. Without a guard, your script would start running during the tests.

### 3. Multiprocessing

On Windows and macOS, Python starts worker processes by importing your main file again. Without the guard, each worker would start new workers, without end.

```python
from multiprocessing import Pool

def square(n):
    return n * n

if __name__ == "__main__":          # required here
    with Pool(4) as pool:
        print(pool.map(square, range(10)))
```

Leaving it out gives a `RuntimeError` about starting a process before the current one has finished its startup.

### 4. Quick demos

A small example of how to use the module, which runs only when someone executes the file.

## When you do not need it

- **A file that only defines functions and classes** and has no code to run.
- **A script nobody will ever import.** It still does no harm to add it, and it is a good habit.
- **Jupyter notebooks.** Cells are run directly.

## Running a package: `__main__.py`

A folder can be made runnable with `python -m`. Python looks for a file named `__main__.py` inside it.

```text
mytool/
  __init__.py
  __main__.py      <- runs when you type: python -m mytool
  core.py
```

```python
# mytool/__main__.py
from .core import main

main()
```

```bash
python -m mytool
```

This is how commands such as `python -m http.server` and `python -m venv` work.

## Does Python have a main function like C or Java?

No. In C and Java, the program starts at a function named `main`. Python simply runs the file from top to bottom. The name `main()` is a convention, and the `if __name__ == "__main__":` line is how you say "start here when this file is run".

## Common mistakes

- **Typing it wrong.** It needs two underscores on each side of `name` and of `main`, and `"__main__"` is a string in quotes.

```python
if __name__ == "__main__":     # correct
if __name__ == "main":         # wrong: never true
if name == "__main__":         # wrong: NameError
```

- **Defining functions inside the guard.** They would not exist when the file is imported. Define them above it.
- **Putting imports inside the guard** that the rest of the module needs.
- **Forgetting it in a multiprocessing script.**
- **Relative imports failing when a file inside a package is run directly.** Run it as a module from the project root: `python -m package.module`.

## A complete template

```python
"""Short description of what this script does."""

import argparse

def process(path: str, verbose: bool = False) -> int:
    """Do the real work. Returns the number of lines."""
    with open(path, encoding="utf-8") as file:
        count = sum(1 for _ in file)
    if verbose:
        print(f"Read {count} lines from {path}")
    return count

def main() -> None:
    parser = argparse.ArgumentParser(description="Count the lines in a file.")
    parser.add_argument("path")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()
    print(process(args.path, args.verbose))

if __name__ == "__main__":
    main()
```

This file can be run from the command line, imported in a test, and reused by other code.

For other Python features that often confuse beginners, see [what `yield` does](/blogs/python-yield-explained). To set up a project properly, see [Python virtual environments](/blogs/python-virtual-environments).

## FAQ

### What does if __name__ == "__main__" mean in Python?

It checks whether the file is being run directly. If so, the code under it runs. If the file is imported by another file, that code is skipped.

### Is if __name__ == "__main__" required?

No. A script runs without it. It is needed when the file may be imported, when you write tests, and when you use multiprocessing.

### What is __name__ in Python?

A built-in variable that holds the module's name. It is `"__main__"` in the file you started and the file's module name when it is imported.

### Should I put code directly under the guard or in a main function?

Put it in a `main()` function and call that from the guard. It avoids global variables and makes the code easier to test and reuse.
