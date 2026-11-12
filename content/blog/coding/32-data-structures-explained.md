---
title: Data Structures Explained: A Beginner's Guide With Python Examples
description: Learn arrays, hash maps, sets, stacks, queues, linked lists, trees, heaps, and graphs. What each is for, how fast it is, and when to use it.
tags: Data Structures, Algorithms, Fundamentals
keywords: data structures, data structures and algorithms, data structures in python, types of data structures, data structures for beginners, dsa
cover: hero boxes list-tree layers network list-ordered
---

A **data structure** is a way of organizing data in memory so that certain operations are fast. Each one makes a trade: an array gives instant access by position, a hash map gives instant lookup by key, a tree keeps data sorted, a queue processes items in order. Choosing the right structure is often the difference between a program that takes a second and one that takes an hour. You need to know about nine of them well.

Speeds below use Big O notation. If that is new, read [Big O notation explained](/blogs/big-o-notation) first.

## Overview

| Structure | Best at | Weak at | Python |
|---|---|---|---|
| Array | Access by index | Insert or delete in the middle | `list` |
| Hash map | Lookup by key | Keeping order sorted | `dict` |
| Set | "Have I seen this?", removing duplicates | Access by position | `set` |
| Stack | Last in, first out | Access to the middle | `list` |
| Queue | First in, first out | Access to the middle | `collections.deque` |
| Linked list | Insert and delete at a known place | Access by index | rarely needed |
| Tree | Sorted data, hierarchies | Simple flat data | custom, or a library |
| Heap | Smallest or largest item, repeatedly | Search | `heapq` |
| Graph | Connections between things | | `dict` of lists |

## 1. Array (list)

Items stored side by side in memory, each with an index.

```python
scores = [90, 72, 85]
scores[1]              # 72: instant access by index, O(1)
scores.append(60)      # add at the end, O(1)
scores.insert(0, 100)  # add at the start, O(n): everything shifts
scores.pop()           # remove from the end, O(1)
85 in scores           # search, O(n)
```

| Operation | Speed |
|---|---|
| Read or write by index | O(1) |
| Add or remove at the end | O(1) |
| Add or remove at the start or middle | O(n) |
| Search for a value | O(n) |

**Use it when** you need an ordered collection, access by position, or you are looping over everything. This is the default choice.

**Avoid it when** you insert or remove at the front often, or search by value many times.

## 2. Hash map (dictionary)

Stores **key and value pairs**. A **hash function** turns the key into a position, so the value is found directly without searching.

```python
ages = {"asha": 31, "ben": 27}
ages["asha"]               # 31: lookup by key, O(1)
ages["chen"] = 40          # insert, O(1)
"ben" in ages              # True, O(1)
del ages["ben"]            # delete, O(1)

for name, age in ages.items():
    print(name, age)
```

| Operation | Speed (average) |
|---|---|
| Lookup, insert, delete by key | O(1) |
| Search by value | O(n) |

**Use it when** you look things up by a name or ID, count things, group things, or cache results.

```python
from collections import Counter, defaultdict

Counter("mississippi")                  # count letters
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)        # group words by first letter
```

**Good to know:** keys must be values that cannot change, such as strings, numbers, and tuples. Two keys can land in the same position, called a collision. The structure handles this, and in rare worst cases a lookup becomes slower.

The hash map is the single most useful structure for making slow code fast.

## 3. Set

A collection of **unique** values with no order. Built like a hash map without the values.

```python
seen = {1, 2, 3}
seen.add(2)            # no effect: already there
3 in seen              # True, O(1)

unique = set([1, 2, 2, 3, 3, 3])     # {1, 2, 3}

a, b = {1, 2, 3}, {2, 3, 4}
a & b                  # {2, 3}       in both
a | b                  # {1, 2, 3, 4} in either
a - b                  # {1}          in a, not in b
```

**Use it when** you ask "is this in the collection?" many times, or you need to remove duplicates.

The classic speed-up:

```python
# Slow: O(n) for every check
if item in big_list: ...

# Fast: O(1) for every check
big_set = set(big_list)
if item in big_set: ...
```

## 4. Stack

**Last in, first out (LIFO).** Like a pile of plates: you add to the top and take from the top.

```python
stack = []
stack.append("page 1")     # push
stack.append("page 2")
stack.append("page 3")
stack.pop()                # "page 3": the most recent
stack[-1]                  # look at the top without removing
```

Push and pop are O(1).

**Used for:**

- Undo in editors
- The back button in a browser
- The call stack that tracks function calls. See [recursion explained](/blogs/recursion-explained).
- Matching brackets
- Depth-first search

## 5. Queue

**First in, first out (FIFO).** Like a line of people: you join at the back and leave from the front.

```python
from collections import deque

queue = deque()
queue.append("task 1")     # add at the back
queue.append("task 2")
queue.popleft()            # "task 1": the oldest, O(1)
```

**Do not use `list.pop(0)` for a queue.** It is O(n), because every remaining item shifts. `deque` does it in O(1).

**Used for:**

- Background jobs and message queues
- Print jobs and task scheduling
- Breadth-first search
- Buffers for data that arrives faster than it is handled

A **deque** (double-ended queue) allows adding and removing at both ends in O(1).

## 6. Linked list

A chain of **nodes**. Each node holds a value and a pointer to the next node. The nodes are not side by side in memory.

```text
[ 3 | •]---> [ 7 | •]---> [ 9 | None ]
```

```python
class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = Node(3, Node(7, Node(9)))

node = head
while node:                 # walk through the list
    print(node.value)
    node = node.next
```

| Operation | Speed |
|---|---|
| Insert or delete at a known node | O(1) |
| Access the n-th item | O(n) |
| Search | O(n) |

**Compared with an array:** inserting in the middle is cheap if you already hold the node, and finding that node is slow. Arrays are also faster in practice because their items sit together in memory, which suits modern processors.

In day-to-day Python or JavaScript you rarely write one. They matter for understanding how queues, hash maps, and file systems are built, and they are common in interviews.

A **doubly linked list** also points backward, which allows removal from both ends.

## 7. Tree

A hierarchy: one **root** node, and each node has **children**. A node with no children is a **leaf**.

```text
            8
          /   \
         3     10
        / \      \
       1   6      14
```

Trees are everywhere: folders and files, the HTML of a web page, a company's reporting structure, JSON data.

### Binary search tree (BST)

Each node has at most two children. Everything in the left branch is smaller than the node, and everything in the right branch is larger. That rule makes searching fast: at each step you discard half of the tree.

```python
class TreeNode:
    def __init__(self, value):
        self.value, self.left, self.right = value, None, None

def insert(node, value):
    if node is None:
        return TreeNode(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node

def contains(node, value):
    if node is None:
        return False
    if value == node.value:
        return True
    return contains(node.left if value < node.value else node.right, value)

def in_order(node):                       # visits values in sorted order
    return in_order(node.left) + [node.value] + in_order(node.right) if node else []

root = None
for v in [8, 3, 10, 1, 6, 14]:
    root = insert(root, v)

print(contains(root, 6))                  # True
print(in_order(root))                     # [1, 3, 6, 8, 10, 14]
```

| Operation | Balanced tree | Unbalanced, worst case |
|---|---|---|
| Search, insert, delete | O(log n) | O(n) |

If you insert already-sorted values, the tree becomes a long chain and loses its speed. **Self-balancing trees**, such as red-black trees and AVL trees, rearrange themselves to stay shallow. **B-trees**, a wide variant, are how databases build indexes. See [how database indexes work](/blogs/how-database-indexes-work).

**Use a tree when** you need data that stays sorted while you add and remove items, need range queries, or the data is naturally a hierarchy.

### Trie

A tree for strings, where each level is one character. It makes "all words starting with" very fast, which is how autocomplete works.

## 8. Heap (priority queue)

A tree-shaped structure that always gives you the **smallest** item (a min-heap) or the **largest** (a max-heap) quickly.

```python
import heapq

tasks = []
heapq.heappush(tasks, (2, "write report"))    # (priority, item)
heapq.heappush(tasks, (1, "fix outage"))
heapq.heappush(tasks, (3, "reply to email"))

heapq.heappop(tasks)       # (1, "fix outage"): the smallest priority first
tasks[0]                   # look at the smallest without removing
```

| Operation | Speed |
|---|---|
| Look at the smallest | O(1) |
| Add | O(log n) |
| Remove the smallest | O(log n) |
| Search for any item | O(n) |

**Used for:**

- Task scheduling by priority
- "Top k" questions, such as the 10 largest values in a stream
- Shortest-path algorithms such as Dijkstra's
- Merging several sorted lists

## 9. Graph

**Nodes** connected by **edges**. It models relationships: friends in a social network, roads between cities, links between web pages, dependencies between packages.

```text
A --- B
|     |
C --- D --- E
```

The usual way to store one is an **adjacency list**: a map from each node to its neighbors.

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C", "E"],
    "E": ["D"],
}
```

Graphs can be **directed** (one-way edges) or **undirected**, and **weighted** (edges have a cost, such as distance) or not.

### Breadth-first search: shortest path by number of steps

```python
from collections import deque

def shortest_path(graph, start, goal):
    queue = deque([[start]])
    visited = {start}
    while queue:
        path = queue.popleft()
        node = path[-1]
        if node == goal:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return None

print(shortest_path(graph, "A", "E"))     # ['A', 'B', 'D', 'E']
```

Notice the three structures working together: a **dictionary** for the graph, a **queue** for the order of visits, and a **set** for visited nodes.

**Used for:** maps and routing, social networks, recommendations, dependency resolution, network analysis.

## Speed cheat sheet

Average case:

| Structure | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Hash map | n/a | O(1) | O(1) | O(1) |
| Set | n/a | O(1) | O(1) | O(1) |
| Stack | n/a | O(n) | O(1) | O(1) |
| Queue | n/a | O(n) | O(1) | O(1) |
| Linked list | O(n) | O(n) | O(1) | O(1) |
| Balanced tree | n/a | O(log n) | O(log n) | O(log n) |
| Heap | n/a | O(n) | O(log n) | O(log n) |

## How to choose

Ask what your program does **most often**.

| You need to | Use |
|---|---|
| Keep items in order and access by position | Array |
| Look up by a key or ID | Hash map |
| Check membership, or remove duplicates | Set |
| Process the most recent item first | Stack |
| Process items in arrival order | Queue |
| Always get the smallest or largest | Heap |
| Keep data sorted while it changes | Balanced tree |
| Represent a hierarchy | Tree |
| Represent connections | Graph |
| Find words by prefix | Trie |

When unsure, start with an **array** and a **hash map**. Together they solve most everyday problems.

## Names in other languages

| Concept | Python | JavaScript | Java | Go |
|---|---|---|---|---|
| Array | `list` | `Array` | `ArrayList` | slice |
| Hash map | `dict` | `Map`, object | `HashMap` | `map` |
| Set | `set` | `Set` | `HashSet` | `map[T]struct{}` |
| Queue | `deque` | array or custom | `ArrayDeque` | slice or channel |
| Heap | `heapq` | custom or library | `PriorityQueue` | `container/heap` |
| Sorted map | library | library | `TreeMap` | library |

## How to learn them

1. **Learn to use each one** in your language before learning how it is built.
2. **Build the main ones yourself once:** a linked list, a stack, a queue, a binary search tree, a hash map. This fixes the ideas in your mind.
3. **Solve problems grouped by structure.** See [coding interview patterns](/blogs/coding-interview-patterns).
4. **State the time and space cost** of every solution you write.
5. **Notice them in real software:** indexes are trees, caches are hash maps, job systems are queues.

## Common mistakes

- **Searching a list inside a loop** when a set or hash map would make it O(1).
- **Using a list as a queue** with `pop(0)`.
- **Sorting all the data** when only the top few are needed. Use a heap.
- **Choosing a complex structure too early.** Measure first.
- **Forgetting to track visited nodes** in a graph, which causes endless loops.

## FAQ

### What is a data structure in simple words?

It is a way to store and organize data so that the operations you need, such as finding, adding, or removing items, are fast.

### Which data structures should I learn first?

Arrays and hash maps first, then sets, stacks, and queues. After that, learn trees, heaps, and graphs.

### What is the difference between an array and a linked list?

An array stores items together in memory and gives instant access by index, but inserting in the middle is slow. A linked list stores items as connected nodes, so inserting at a known place is fast, but reaching the n-th item requires walking through the list.

### What is the difference between a stack and a queue?

A stack removes the most recently added item first (last in, first out). A queue removes the oldest item first (first in, first out).
