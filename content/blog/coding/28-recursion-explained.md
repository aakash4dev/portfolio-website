---
title: What Is Recursion in Programming? Explained With Examples
description: Recursion is a function that calls itself to solve a smaller version of the same problem. Learn base cases, the call stack, and when to use it.
tags: Recursion, Algorithms, Fundamentals
keywords: what is recursion, recursion in python, recursion explained, recursion examples, recursion vs iteration, base case recursion
cover: hero repeat layers git-branch undo-2 list-tree
---

**Recursion** is when a function calls itself to solve a smaller version of the same problem. Every recursive function needs two parts: a **base case** that stops it, and a **recursive case** that moves toward the base case. Recursion fits problems that have a repeating, nested structure, such as folders inside folders, trees, and problems that split into smaller copies of themselves.

## A first example: countdown

```python
def countdown(n):
    if n == 0:                # base case: stop
        print("Go!")
        return
    print(n)
    countdown(n - 1)          # recursive case: a smaller problem

countdown(3)
# 3
# 2
# 1
# Go!
```

The function prints one number and hands the rest of the job to itself with a smaller number. When the number reaches 0, it stops.

## The two parts

### 1. The base case

The simplest version of the problem, which can be answered directly. Without it, the function calls itself forever, until the program crashes.

### 2. The recursive case

The function calls itself with an input that is **closer to the base case**.

```python
def broken(n):
    return broken(n - 1)       # no base case

broken(5)
# RecursionError: maximum recursion depth exceeded
```

## The classic example: factorial

The factorial of 5, written 5!, is 5 × 4 × 3 × 2 × 1 = 120.

Notice that 5! = 5 × 4!. The problem contains a smaller copy of itself.

```python
def factorial(n):
    if n <= 1:                         # base case
        return 1
    return n * factorial(n - 1)        # recursive case

print(factorial(5))                    # 120
```

## How it works: the call stack

Each function call is placed on the **call stack** and waits there until it can finish.

```text
factorial(5)
  = 5 * factorial(4)
        = 4 * factorial(3)
              = 3 * factorial(2)
                    = 2 * factorial(1)
                          = 1              <- base case reached
                    = 2 * 1 = 2
              = 3 * 2 = 6
        = 4 * 6 = 24
  = 5 * 24 = 120
```

There are two phases:

1. **Going down:** calls pile up, each waiting for the next.
2. **Coming back:** the base case returns, and each waiting call finishes in reverse order.

Every waiting call uses memory. A recursion 1,000 levels deep holds 1,000 frames on the stack. If it goes too deep, you get a **stack overflow**. Python stops at about 1,000 levels by default and raises `RecursionError`.

## How to think recursively

Do not try to follow every call in your head. Use the **leap of faith**:

1. **Assume the function already works for a smaller input.**
2. **Use that result to solve the current input.**
3. **Handle the smallest case directly.**

Example: sum of a list.

- Assume `total(rest_of_list)` gives the right answer.
- Then the answer is `first_item + total(rest_of_list)`.
- The smallest case is an empty list, whose sum is 0.

```python
def total(numbers):
    if not numbers:
        return 0
    return numbers[0] + total(numbers[1:])

print(total([4, 2, 9]))        # 15
```

## More examples

### Reverse a string

```python
def reverse(text):
    if len(text) <= 1:
        return text
    return reverse(text[1:]) + text[0]

print(reverse("hello"))        # "olleh"
```

### Power

```python
def power(base, exponent):
    if exponent == 0:
        return 1
    half = power(base, exponent // 2)
    return half * half if exponent % 2 == 0 else half * half * base

print(power(2, 10))            # 1024
```

Halving the exponent each time makes this `O(log n)`, not `O(n)`.

### Binary search

```python
def binary_search(items, target, low=0, high=None):
    if high is None:
        high = len(items) - 1
    if low > high:
        return -1                               # base case: not found
    mid = (low + high) // 2
    if items[mid] == target:
        return mid                              # base case: found
    if items[mid] < target:
        return binary_search(items, target, mid + 1, high)
    return binary_search(items, target, low, mid - 1)
```

## Where recursion fits best: nested data

When the data is nested to an unknown depth, recursion is the natural tool. A loop alone cannot easily handle "folders inside folders inside folders".

### Add up the sizes of all files in a folder

```python
from pathlib import Path

def folder_size(path: Path) -> int:
    if path.is_file():
        return path.stat().st_size              # base case: a file
    return sum(folder_size(child) for child in path.iterdir())   # a folder: add up its contents
```

### Flatten a nested list

```python
def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))        # go one level deeper
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, [4]], 5]]))           # [1, 2, 3, 4, 5]
```

### Walk a tree

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right

def depth(node):
    if node is None:
        return 0
    return 1 + max(depth(node.left), depth(node.right))

def in_order(node):
    if node is None:
        return []
    return in_order(node.left) + [node.value] + in_order(node.right)
```

A tree is defined recursively: a node whose children are smaller trees. The code mirrors the shape of the data. The same applies to JSON, HTML documents, comment threads, and organization charts.

## The trap: repeated work

The Fibonacci sequence is 0, 1, 1, 2, 3, 5, 8, and so on. Each number is the sum of the two before.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

It is correct and very slow. `fib(5)` calls `fib(3)` twice, `fib(2)` three times, and so on. The number of calls roughly doubles with each step: `O(2ⁿ)`. `fib(35)` makes about 30 million calls.

```text
                    fib(5)
                 /          \
            fib(4)            fib(3)
           /      \          /      \
       fib(3)    fib(2)   fib(2)   fib(1)
       /    \
   fib(2)  fib(1)        <- the same values are computed again and again
```

### Fix 1: memoization

Store each result the first time, and reuse it.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(100))        # instant: 354224848179261915075
```

Now each value is computed once: `O(n)`.

### Fix 2: a loop

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

`O(n)` time and `O(1)` space, with no risk of a stack overflow.

Storing answers to repeated subproblems is the heart of **dynamic programming**. See [coding interview patterns](/blogs/coding-interview-patterns) and [Big O notation](/blogs/big-o-notation).

## Recursion vs iteration

Anything written with recursion can be written with a loop, and the reverse.

```python
# Recursive
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

# Iterative
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

| | Recursion | Loop |
|---|---|---|
| Readability for nested problems | Often clearer | Often needs a manual stack |
| Memory | One stack frame per call | Constant, usually |
| Speed | Slightly slower: function call overhead | Slightly faster |
| Risk | Stack overflow on deep input | None of that kind |
| Best for | Trees, graphs, divide and conquer, backtracking | Simple repetition and counting |

**Use recursion when** the problem or data is nested or branches: trees, graphs, nested structures, all combinations, divide-and-conquer algorithms such as merge sort.

**Use a loop when** you are simply repeating a step or walking a flat list, or when the depth could be very large.

## Tail recursion

A call is a **tail call** when it is the very last thing the function does.

```python
def factorial(n, result=1):
    if n <= 1:
        return result
    return factorial(n - 1, result * n)     # nothing left to do after this call
```

Some languages, including Scheme, Haskell, and Scala, turn tail calls into loops automatically, so they use no extra stack. **Python and most JavaScript engines do not.** In those, deep recursion still overflows, and a loop is the safe choice.

## Divide and conquer

Many fast algorithms split the problem into parts, solve each part recursively, and combine the results.

```python
def merge_sort(items):
    if len(items) <= 1:
        return items                                    # base case
    middle = len(items) // 2
    left = merge_sort(items[:middle])                   # sort each half
    right = merge_sort(items[middle:])

    merged, i, j = [], 0, 0                             # merge the sorted halves
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    return merged + left[i:] + right[j:]

print(merge_sort([5, 2, 9, 1, 7]))                      # [1, 2, 5, 7, 9]
```

## Common mistakes

- **No base case**, or one that is never reached.
- **Not moving toward the base case**, such as calling with the same argument.
- **Forgetting `return`** in the recursive case, so the result is lost and you get `None`.
- **Repeated work** without memoization.
- **Very deep recursion** on large inputs in a language without tail-call optimization.
- **Changing a shared list** across calls without copying or undoing the change.

## How to debug a recursive function

1. Test the base case alone.
2. Test the smallest input that makes one recursive call.
3. Print the arguments with indentation to see the calls:

```python
def factorial(n, depth=0):
    print("  " * depth + f"factorial({n})")
    return 1 if n <= 1 else n * factorial(n - 1, depth + 1)
```

4. Check that each call receives a smaller input.

## FAQ

### What is recursion in simple words?

It is when a function solves a problem by calling itself on a smaller part of the same problem, until it reaches a case simple enough to answer directly.

### What is a base case in recursion?

The condition under which the function stops calling itself and returns an answer. Without it, the recursion never ends and the program crashes.

### Is recursion better than a loop?

Neither is better in general. Recursion is clearer for nested data such as trees and for problems that split into subproblems. Loops use less memory and are safer for long, flat repetition.

### What causes a stack overflow in recursion?

Each call takes space on the call stack until it returns. If the recursion goes too deep, or never reaches its base case, the stack runs out of space.
