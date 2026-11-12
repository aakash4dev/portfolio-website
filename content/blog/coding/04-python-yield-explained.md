---
title: What Does yield Do in Python? Generators Explained Simply
description: yield turns a function into a generator that produces values one at a time and pauses between them. Learn how it works, with clear examples.
tags: Python, Generators, Basics
keywords: python yield, what does yield do in python, python generators explained, yield vs return, python generator example, yield from
cover: code PY repeat
---

In Python, `yield` turns a function into a **generator**. A normal function runs to the end and returns one value. A generator function produces a value, **pauses** and remembers where it was, and continues from that point when the next value is requested. This lets you work through a long or endless sequence without holding all of it in memory.

## return vs yield

```python
def numbers_list():
    return [1, 2, 3]          # builds the whole list, then returns it

def numbers_gen():
    yield 1                   # gives 1, pauses
    yield 2                   # gives 2, pauses
    yield 3                   # gives 3, pauses

for n in numbers_gen():
    print(n)                  # 1, 2, 3
```

| | `return` | `yield` |
|---|---|---|
| Ends the function | Yes | No, it pauses it |
| How many values | One | Many, one at a time |
| Local variables | Lost | Kept between values |
| Memory | Whole result at once | One item at a time |

## What happens step by step

Calling a generator function does **not** run its code. It returns a generator object.

```python
def countdown(n):
    print("starting")
    while n > 0:
        yield n
        n -= 1
    print("done")

gen = countdown(3)        # nothing is printed yet
print(next(gen))          # prints "starting", then 3
print(next(gen))          # 2
print(next(gen))          # 1
print(next(gen))          # prints "done", then raises StopIteration
```

1. `next(gen)` runs the code until the first `yield` and hands back that value.
2. The function freezes there. `n` keeps its value.
3. The next `next(gen)` continues on the line after `yield`.
4. When the function ends, Python raises `StopIteration`.

A `for` loop calls `next()` for you and stops quietly at `StopIteration`.

## Why use generators? Memory

```python
import sys

big_list = [x * 2 for x in range(1_000_000)]
big_gen = (x * 2 for x in range(1_000_000))

print(sys.getsizeof(big_list))   # about 8,000,000 bytes
print(sys.getsizeof(big_gen))    # about 200 bytes
```

The list holds a million numbers. The generator holds only the recipe for the next one.

The second line uses a **generator expression**: the same syntax as a list comprehension, with round brackets.

## Real example: read a huge file

```python
def read_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            yield line.rstrip("\n")

def errors_only(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

for line in errors_only(read_lines("server.log")):
    print(line)
```

This works on a 50 GB log file with a few kilobytes of memory, because only one line exists at a time. Using `readlines()` would try to load the whole file.

## Generators are lazy

Nothing is calculated until it is asked for. That makes endless sequences possible:

```python
def fibonacci():
    a, b = 0, 1
    while True:              # never ends, and that is fine
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

`itertools.islice` takes the first 10 values and then stops asking.

## Pipelines

Generators connect like pipes. Each step pulls one item from the step before.

```python
def read_numbers(path):
    with open(path) as file:
        for line in file:
            yield int(line)

def only_even(numbers):
    for n in numbers:
        if n % 2 == 0:
            yield n

def squared(numbers):
    for n in numbers:
        yield n * n

total = sum(squared(only_even(read_numbers("numbers.txt"))))
```

No list is ever built, however large the file is.

## A generator can be used only once

This surprises many people.

```python
gen = (x for x in range(3))
print(list(gen))   # [0, 1, 2]
print(list(gen))   # []  - already used up
```

If you need the values twice, create the generator again or store the results in a list.

## yield from

`yield from` passes on every value from another generator or iterable.

```python
def chain(*iterables):
    for iterable in iterables:
        yield from iterable        # same as: for item in iterable: yield item

print(list(chain([1, 2], "ab", (3, 4))))   # [1, 2, 'a', 'b', 3, 4]
```

It is very useful for recursion:

```python
def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], 5])))   # [1, 2, 3, 4, 5]
```

## Sending values into a generator

`yield` is also an expression. It can receive a value through `.send()`.

```python
def running_average():
    total, count, average = 0, 0, None
    while True:
        value = yield average
        total += value
        count += 1
        average = total / count

avg = running_average()
next(avg)                 # run to the first yield
print(avg.send(10))       # 10.0
print(avg.send(20))       # 15.0
print(avg.send(30))       # 20.0
```

This two-way use is less common today. Python's `async` and `await` grew out of the same mechanism. See [async and await in JavaScript](/blogs/javascript-async-await) for the same idea in another language.

## yield in context managers and tests

`yield` is also used to split "before" and "after" code.

```python
from contextlib import contextmanager
import time

@contextmanager
def timer(label):
    start = time.perf_counter()
    yield                                    # the body of the with-block runs here
    print(f"{label}: {time.perf_counter() - start:.3f}s")

with timer("load data"):
    data = [x ** 2 for x in range(1_000_000)]
```

pytest fixtures use the same pattern: code before `yield` is setup, and code after it is cleanup.

## When to use a generator, and when not to

**Use a generator when:**

- The data is large or endless.
- You only need to loop over it once.
- You are reading from a file, a network stream, or a database cursor.
- You want to stop early without doing unneeded work.

**Use a list when:**

- You need the length, indexing (`items[5]`), or slicing.
- You need to loop over the data more than once.
- The data is small. A list is simpler and often a little faster.

## Common mistakes

- **Expecting the function to run when called.** It runs only when you loop over it or call `next()`.
- **Using a generator twice.**
- **Calling `len()` on a generator.** It has no length. Use `sum(1 for _ in gen)` if you must count.
- **Mixing `return value` with `yield`.** In a generator, `return` ends it. The returned value is attached to `StopIteration` and is ignored by a `for` loop.
- **Late errors.** An error inside a generator appears when the value is requested, not when the generator is created.

For another part of Python that confuses beginners, see [what `if __name__ == "__main__"` does](/blogs/python-if-name-main).

## FAQ

### What does yield do in Python?

It makes a function produce a value and pause, keeping its state, so it can continue from the same place when the next value is requested.

### What is the difference between yield and return?

`return` sends back one value and ends the function. `yield` sends back a value and pauses the function, which can then yield more values later.

### What is a generator in Python?

A generator is an object that produces values one at a time, on demand. You create one with a function that uses `yield` or with a generator expression in round brackets.

### When should I use yield instead of a list?

When the data is large, comes from a stream, or might not all be needed. A generator uses very little memory because it holds only one item at a time.
