---
title: 10 Coding Interview Patterns That Solve Most Problems
description: Stop memorizing solutions. Learn the ten patterns behind most coding interview questions, with a code template and example for each one.
tags: Interviews, Algorithms, Career
keywords: coding interview patterns, coding interview questions, coding interview preparation, leetcode patterns, two pointers, sliding window
cover: hero puzzle code target list-checks brain
---

Most coding interview problems are variations of a small number of **patterns**. If you learn to recognize the pattern, you do not need to memorize hundreds of solutions. The ten most useful are: hash map, two pointers, sliding window, binary search, stack, breadth-first search, depth-first search, backtracking, dynamic programming, and heap. This guide explains when to use each, with a template in Python.

To judge your solutions, you need [Big O notation](/blogs/big-o-notation). For the structures used here, see [data structures explained](/blogs/data-structures-explained).

## 1. Hash map (and hash set)

**Use it when:** you need to find, count, or remember things quickly. Words such as "duplicate", "frequency", "pair that adds up to", and "seen before" point to it.

**Idea:** a lookup in a hash map is `O(1)`, so a search inside a loop no longer needs a second loop.

```python
def two_sum(numbers, target):
    seen = {}                                  # value -> index
    for i, n in enumerate(numbers):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))              # [0, 1]
```

Brute force is `O(n²)`. This is `O(n)` time and `O(n)` space.

**Typical problems:** two sum, group anagrams, first unique character, longest consecutive sequence.

## 2. Two pointers

**Use it when:** the input is a **sorted** array or a string, and you look for a pair, or compare from both ends.

**Idea:** two indexes move toward each other, or in the same direction at different speeds.

```python
def pair_with_sum(sorted_numbers, target):
    left, right = 0, len(sorted_numbers) - 1
    while left < right:
        total = sorted_numbers[left] + sorted_numbers[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1                          # need a larger sum
        else:
            right -= 1                         # need a smaller sum
    return []
```

`O(n)` time, `O(1)` space.

A variation is **fast and slow pointers**: one moves one step, the other two. They meet if a linked list has a cycle, and the slow one is at the middle when the fast one reaches the end.

**Typical problems:** valid palindrome, three sum, container with most water, remove duplicates from a sorted array, linked list cycle.

## 3. Sliding window

**Use it when:** you need the best **contiguous** part of an array or string: "longest substring", "smallest subarray", "maximum sum of k items".

**Idea:** keep a window with a left and right edge. Grow the right edge. When the window breaks a rule, shrink it from the left.

```python
def longest_unique_substring(text):
    seen = set()
    left = best = 0
    for right, char in enumerate(text):
        while char in seen:                    # the window is invalid: shrink it
            seen.remove(text[left])
            left += 1
        seen.add(char)
        best = max(best, right - left + 1)
    return best

print(longest_unique_substring("abcabcbb"))    # 3  ("abc")
```

Each character enters and leaves the window once, so it is `O(n)`.

**Typical problems:** longest substring without repeating characters, minimum window substring, maximum sum subarray of size k, longest repeating character replacement.

## 4. Binary search

**Use it when:** the data is **sorted**, or the answer lies in a range where you can test "is this value enough?".

```python
def binary_search(sorted_items, target):
    low, high = 0, len(sorted_items) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_items[mid] == target:
            return mid
        if sorted_items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

`O(log n)`.

The more advanced form is **binary search on the answer**: "what is the smallest speed at which the job finishes in time?" You search the range of possible speeds and test each guess.

**Typical problems:** search in a rotated sorted array, find the first and last position, find the minimum in a rotated array, Koko eating bananas.

## 5. Stack

**Use it when:** you need the most recent unmatched item: matching brackets, undo, "next greater element", evaluating expressions.

```python
def is_valid_brackets(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for char in text:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    return not stack

print(is_valid_brackets("{[()]}"))             # True
```

A **monotonic stack** keeps its items in increasing or decreasing order and solves "next greater" and "previous smaller" questions in `O(n)`.

**Typical problems:** valid parentheses, daily temperatures, min stack, largest rectangle in a histogram.

## 6. Breadth-first search (BFS)

**Use it when:** you need the **shortest path** in an unweighted graph or grid, or you process a tree level by level.

**Idea:** visit everything one step away, then two steps away, using a queue.

```python
from collections import deque

def shortest_path(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, 0)])
    visited = {start}

    while queue:
        (row, col), steps = queue.popleft()
        if (row, col) == goal:
            return steps
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            r, c = row + dr, col + dc
            if 0 <= r < rows and 0 <= c < cols and grid[r][c] == 0 and (r, c) not in visited:
                visited.add((r, c))
                queue.append(((r, c), steps + 1))
    return -1
```

Always mark a cell as visited **when you add it to the queue**, not when you take it out. Otherwise the same cell is added many times.

**Typical problems:** binary tree level order traversal, rotting oranges, word ladder, shortest path in a binary matrix.

## 7. Depth-first search (DFS)

**Use it when:** you need to explore everything: count islands, find connected parts, check whether a path exists, or work through a tree.

**Idea:** go as deep as possible, then come back.

```python
def count_islands(grid):
    rows, cols = len(grid), len(grid[0])

    def sink(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"                       # mark as visited
        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count
```

Most tree problems are DFS written with recursion. See [recursion explained](/blogs/recursion-explained).

```python
def max_depth(node):
    if node is None:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))
```

**Typical problems:** number of islands, maximum depth of a binary tree, validate a binary search tree, clone a graph, course schedule.

## 8. Backtracking

**Use it when:** the problem asks for **all** combinations, permutations, or subsets, or to fill in something under rules, such as a sudoku.

**Idea:** make a choice, explore, then undo the choice and try the next.

```python
def subsets(numbers):
    result = []

    def build(start, current):
        result.append(current[:])              # save a copy
        for i in range(start, len(numbers)):
            current.append(numbers[i])         # choose
            build(i + 1, current)              # explore
            current.pop()                      # undo

    build(0, [])
    return result

print(subsets([1, 2, 3]))
# [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
```

These problems are exponential by nature. Stop a branch early when it can no longer lead to a valid answer.

**Typical problems:** subsets, permutations, combination sum, N-queens, word search.

## 9. Dynamic programming (DP)

**Use it when:** the problem asks for a count, a minimum, or a maximum, and the answer for a big input is built from answers to smaller inputs that **repeat**.

**Idea:** solve each small problem once and store the result.

```python
def climb_stairs(n):
    # ways(n) = ways(n - 1) + ways(n - 2)
    if n <= 2:
        return n
    one_back, two_back = 2, 1
    for _ in range(3, n + 1):
        one_back, two_back = one_back + two_back, one_back
    return one_back
```

A method for any DP problem:

1. **Define the state.** What does `dp[i]` mean, in one sentence?
2. **Write the relation.** How does `dp[i]` come from smaller states?
3. **Set the base cases.**
4. **Choose the order** so that needed values are ready.
5. **Reduce memory** if only the last few states are used.

A two-dimensional example, the minimum coins for an amount:

```python
def min_coins(coins, amount):
    dp = [0] + [float("inf")] * amount         # dp[a] = fewest coins to make amount a
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1

print(min_coins([1, 5, 10], 28))               # 6  (10 + 10 + 5 + 1 + 1 + 1)
```

**Typical problems:** climbing stairs, house robber, coin change, longest increasing subsequence, longest common subsequence, 0/1 knapsack.

## 10. Heap (priority queue)

**Use it when:** you see "top k", "k largest", "k closest", "merge k sorted", or you need the smallest or largest item again and again.

```python
import heapq

def k_largest(numbers, k):
    heap = []
    for n in numbers:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)                # remove the smallest
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3))      # [12, 11, 5]
```

Keeping a heap of size `k` costs `O(n log k)`, which beats sorting everything at `O(n log n)`.

**Typical problems:** kth largest element, top k frequent elements, merge k sorted lists, find the median from a data stream.

## How to recognize the pattern

| If the problem says | Try |
|---|---|
| Sorted array, find a pair | Two pointers, binary search |
| Longest or shortest contiguous part | Sliding window |
| Count, duplicates, seen before | Hash map or set |
| Brackets, nearest greater or smaller | Stack |
| Shortest path, fewest steps, levels | BFS |
| Explore all, connected parts, trees | DFS |
| All combinations or permutations | Backtracking |
| Number of ways, minimum, maximum, with overlapping subproblems | Dynamic programming |
| Top k, k smallest, repeated minimum | Heap |
| Sorted input, or "find the smallest value that works" | Binary search |
| Intervals that overlap | Sort by start, then merge |
| Dependencies and ordering | Topological sort |

## How to solve a problem in an interview

1. **Understand.** Repeat the problem in your own words. Ask about input size, empty input, duplicates, and negative numbers.
2. **Work an example by hand.** Often the pattern shows itself.
3. **State the brute-force solution** and its complexity. It proves you understand the task.
4. **Improve it.** Name the pattern and explain why it fits.
5. **Write the code** while explaining what each part does.
6. **Test** with a normal case and with edge cases: empty, one item, all the same.
7. **State the time and space complexity.**

**Speak the whole time.** The interviewer is judging how you think and communicate. A clear thought process with a small bug scores better than silent, perfect code.

## How to prepare

- **Learn one pattern at a time.** Solve 5 to 10 problems of that pattern before moving on.
- **Start with easy problems, then medium.** Most interviews use medium difficulty.
- **Try for 25 to 30 minutes** before reading a solution. Then close it and write the solution yourself.
- **Redo problems after a week.** Repeating at intervals is what makes patterns stick.
- **About 100 to 150 well-understood problems** cover the patterns. More is not automatically better.
- **Practice aloud and on a timer.** Do mock interviews.
- **Use the language you know best.** Python is popular because it is short.

Interview preparation is one part of the path in [how to become a software engineer](/blogs/how-to-become-software-engineer). For senior roles, add [system design basics](/blogs/system-design-basics).

## FAQ

### What are coding interview patterns?

They are reusable problem-solving techniques, such as two pointers or sliding window. Most interview questions are variations of a small set of them.

### How many problems should I solve before an interview?

Around 100 to 150 problems, spread over the main patterns and understood well, is enough for most interviews. Understanding matters more than the count.

### Which programming language is best for coding interviews?

The one you know best. Python is a common choice because its syntax is short and it has built-in lists, dictionaries, sets, and heaps.

### How long does it take to prepare for coding interviews?

With one to two hours a day, most people need two to three months if they already know data structures, and longer if they are learning those at the same time.
