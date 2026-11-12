---
title: Big O Notation Explained With Simple Examples
description: Big O describes how an algorithm slows down as its input grows. Learn O(1), O(log n), O(n), O(n log n), and O(n²) with code and a cheat sheet.
tags: Algorithms, Big O, Interviews
keywords: big o notation, big o notation examples, big o notation explained, time complexity, space complexity, big o cheat sheet
cover: hero chart-line timer layers search list-ordered
---

**Big O notation** describes how the running time or memory use of an algorithm grows as the size of its input grows. It does not measure seconds. It describes the **shape of the growth**. An `O(n)` algorithm takes about twice as long when the input doubles. An `O(n²)` algorithm takes about four times as long. An `O(1)` algorithm takes the same time whatever the size. Big O lets you compare solutions and predict which one will still work when the data gets large.

## Why it matters

Two functions can both be correct and behave very differently at scale.

| Input size (n) | O(log n) | O(n) | O(n log n) | O(n²) |
|---|---|---|---|---|
| 10 | 3 | 10 | 33 | 100 |
| 1,000 | 10 | 1,000 | 10,000 | 1,000,000 |
| 1,000,000 | 20 | 1,000,000 | 20,000,000 | 1,000,000,000,000 |

At a million items, the `O(n)` solution finishes in a moment. The `O(n²)` one needs a trillion steps and may run for hours. Nothing about the hardware changes that.

## The common complexities

From best to worst:

```text
O(1)  <  O(log n)  <  O(n)  <  O(n log n)  <  O(n²)  <  O(2ⁿ)  <  O(n!)
```

### O(1): constant

The work does not depend on the input size.

```python
def first_item(items):
    return items[0]               # one step, for 10 items or 10 million

def get_price(prices, name):
    return prices[name]           # a dictionary lookup
```

### O(log n): logarithmic

Each step cuts the remaining work in half. Doubling the input adds only one step.

```python
def binary_search(sorted_items, target):
    low, high = 0, len(sorted_items) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_items[mid] == target:
            return mid
        if sorted_items[mid] < target:
            low = mid + 1          # discard the left half
        else:
            high = mid - 1         # discard the right half
    return -1
```

Finding a name among a million sorted entries takes about 20 steps. This is why database indexes are fast. See [how database indexes work](/blogs/how-database-indexes-work).

### O(n): linear

One pass over the input.

```python
def find_max(numbers):
    largest = numbers[0]
    for n in numbers:              # looks at every item once
        if n > largest:
            largest = n
    return largest
```

### O(n log n): linearithmic

The cost of good sorting algorithms such as merge sort and the built-in sort of most languages.

```python
sorted_numbers = sorted(numbers)   # O(n log n)
```

### O(n²): quadratic

A loop inside a loop over the same data.

```python
def has_duplicate_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):     # for each item, check all the others
            if items[i] == items[j]:
                return True
    return False
```

Fine for 100 items. Painful for 100,000.

### O(2ⁿ): exponential

The work doubles with each added item.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)   # two calls per call
```

`fib(30)` makes over a million calls. `fib(50)` would take hours. See [recursion explained](/blogs/recursion-explained) for how to fix this.

### O(n!): factorial

Trying every possible order, such as every route through a set of cities. Ten items already give 3.6 million orders.

## From O(n²) to O(n): a real improvement

The duplicate check above compares every pair. A set remembers what it has seen, and a set lookup is `O(1)`.

```python
def has_duplicate_fast(items):
    seen = set()
    for item in items:              # one pass
        if item in seen:            # O(1) lookup
            return True
        seen.add(item)
    return False
```

This is `O(n)` time. For 100,000 items that is 100,000 steps instead of about 5 billion.

The price is memory: the set can hold up to `n` items, so the **space complexity** is `O(n)`. Trading memory for time is the most common optimization in programming.

## How to work out the Big O of code

### Rule 1: drop constants

```python
for x in items: print(x)
for x in items: print(x)
```

Two passes are `2n` steps. Big O ignores the 2. It is `O(n)`.

### Rule 2: keep only the largest term

```python
for x in items:                    # n
    print(x)
for x in items:                    # n²
    for y in items:
        print(x, y)
```

`n + n²` becomes `O(n²)`. For large `n`, the smaller term does not matter.

### Rule 3: steps in a row add, nested steps multiply

- One loop after another: `O(n + n)`, which is `O(n)`.
- One loop inside another: `O(n × n)`, which is `O(n²)`.

### Rule 4: different inputs get different letters

```python
for a in list_a:
    for b in list_b:
        print(a, b)
```

This is `O(a × b)`, not `O(n²)`. The lists may have very different sizes.

### Rule 5: halving means log n

A loop where the remaining work is cut in half each time, or the counter doubles, is `O(log n)`.

```python
i = 1
while i < n:
    i *= 2
```

### Rule 6: look inside the calls

A loop that calls an `O(n)` function is `O(n²)`, even if only one loop is visible.

```python
for item in items:                 # n times
    if item in other_list:         # "in" on a list is O(n)
        print(item)
```

Changing `other_list` to a set makes the whole thing `O(n)`.

## Best, average, and worst case

Big O usually means the **worst case**: the most work the algorithm might do.

Searching a list for a value:

- **Best case:** it is the first item. One step.
- **Worst case:** it is the last item, or missing. `n` steps.

We say linear search is `O(n)`.

Some operations are usually fast and occasionally slow. Appending to a Python list or a JavaScript array is `O(1)` almost always, and `O(n)` on the rare occasion when the array must grow and copy itself. Averaged over many operations it is `O(1)`. This is called **amortized** time.

## Space complexity

Big O also describes extra memory.

```python
def total(numbers):                # O(1) space: one variable
    result = 0
    for n in numbers:
        result += n
    return result

def doubled(numbers):              # O(n) space: a new list of the same size
    return [n * 2 for n in numbers]
```

Recursion uses memory too. Each call that has not finished stays on the call stack, so a recursion `n` levels deep uses `O(n)` space.

## Cheat sheet: data structure operations

Average case:

| Structure | Access by index | Search | Insert | Delete |
|---|---|---|---|---|
| Array / list | O(1) | O(n) | O(n), or O(1) at the end | O(n) |
| Hash map / dictionary | n/a | O(1) | O(1) | O(1) |
| Set | n/a | O(1) | O(1) | O(1) |
| Linked list | O(n) | O(n) | O(1) at a known position | O(1) at a known position |
| Stack / queue | n/a | O(n) | O(1) | O(1) |
| Balanced binary search tree | n/a | O(log n) | O(log n) | O(log n) |
| Heap | n/a | O(n) | O(log n) | O(log n) for the top item |

See [data structures explained](/blogs/data-structures-explained) for what each one is.

## Cheat sheet: sorting and searching

| Algorithm | Time | Space |
|---|---|---|
| Linear search | O(n) | O(1) |
| Binary search (sorted data) | O(log n) | O(1) |
| Bubble, insertion, selection sort | O(n²) | O(1) |
| Merge sort | O(n log n) | O(n) |
| Quick sort | O(n log n) on average, O(n²) worst | O(log n) |
| Built-in sort (Python, JavaScript, Java) | O(n log n) | O(n) |

## What input size can each complexity handle?

A rough guide for about one second of work:

| Complexity | Largest n that is comfortable |
|---|---|
| O(n!) | About 10 |
| O(2ⁿ) | About 20 to 25 |
| O(n³) | A few hundred |
| O(n²) | A few thousand |
| O(n log n) | About a million |
| O(n) | Tens of millions |
| O(log n), O(1) | Practically any size |

In interviews, the limits in the problem statement hint at the expected solution. If `n` can be 100,000, an `O(n²)` answer will be too slow.

## Big O in real work

- **Big O ignores constants, and constants are real.** For small inputs, a simple `O(n²)` loop can beat a clever `O(n log n)` method.
- **Measure before optimizing.** Find the slow part with a profiler, then improve it.
- **The usual real-world culprits** are a database query inside a loop (the N+1 problem), a list search inside a loop, and loading far more data than needed.
- **Readable code first.** Optimize when the data is large enough to matter.

## Common mistakes

- **Counting loops without looking inside them.** A hidden `in`, `indexOf`, `slice`, or `sort` changes the answer.
- **Saying `O(n²)` for two different inputs.** Use two letters.
- **Forgetting space complexity,** especially the call stack in recursion.
- **Mixing up `O(n)` and `O(log n)`** when a loop halves or doubles.
- **Thinking Big O gives actual running time.** It gives growth, not seconds.

## How to talk about it in an interview

State both time and space, and say why:

> "This solution is O(n) time, because it goes through the array once, and O(n) space, because the hash map can hold every element. The brute-force version would be O(n²) time and O(1) space."

For the patterns that produce efficient solutions, see [coding interview patterns](/blogs/coding-interview-patterns).

## FAQ

### What is Big O notation in simple words?

It is a way to describe how much slower or more memory-hungry an algorithm gets as its input gets bigger, without using exact times.

### What is the difference between O(n) and O(n²)?

With O(n), doubling the input doubles the work. With O(n²), doubling the input makes four times the work. On large inputs, O(n²) becomes far too slow.

### What does O(log n) mean?

The work grows very slowly, because each step removes a large part of the remaining problem, usually half. Binary search is the standard example.

### Is O(1) always faster than O(n)?

For large inputs, yes. For very small inputs, an O(n) method with a tiny cost per step can be faster than an O(1) method with a large fixed cost.
