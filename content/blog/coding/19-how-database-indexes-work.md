---
title: How Do Database Indexes Work? B-Trees Explained Simply
description: An index lets a database find rows without scanning the whole table. Learn how B-tree indexes work, when to add one, and when they hurt.
tags: Databases, SQL, Performance
keywords: how database indexing works, database index explained, b tree index, sql index, when to use an index, composite index
cover: hero list-tree database search zap book-open
---

A **database index** is a separate, sorted data structure that lets the database find rows quickly without reading the whole table. It works like the index at the back of a book: you look up a word and go straight to the page, instead of reading every page. Most databases use a **B-tree** for this, which finds one row among millions in three or four steps. The cost is extra disk space and slower writes, because every index must be updated when the data changes.

## The problem: a full table scan

Take a table with 10 million users.

```sql
SELECT * FROM users WHERE email = 'asha@example.com';
```

Without an index, the database has no idea where that row is. It reads **every row** and checks the email. This is a **full table scan** (a "sequential scan" in PostgreSQL), and its cost grows in step with the table.

With an index on `email`, the database goes almost straight to the row.

```sql
CREATE INDEX idx_users_email ON users (email);
```

## How a B-tree index works

A B-tree is a sorted tree with a very wide shape. Each node holds many keys and pointers to child nodes.

```text
                      [ M ]
                    /       \
           [ D | H ]         [ R | W ]
          /    |    \       /    |    \
     [A-C]  [D-G]  [H-L]  [M-Q] [R-V] [W-Z]     <- leaf nodes
       |      |      |      |     |     |
     pointers to the rows in the table
```

To find the email starting with "P":

1. Start at the root. "P" comes after "M", so go right.
2. "P" comes before "R", so go to the first child.
3. Search inside the leaf `[M-Q]` and follow the pointer to the row.

Three steps, whatever the starting point.

### Why it is so fast

Each node holds hundreds of keys, so the tree is very shallow. A tree three or four levels deep can cover hundreds of millions of rows. Finding a row means reading three or four pages from disk, not millions.

In terms of complexity, a lookup is **O(log n)** and a full scan is **O(n)**. See [Big O notation](/blogs/big-o-notation).

| Rows in the table | Full scan reads up to | B-tree reads about |
|---|---|---|
| 1,000 | 1,000 rows | 2 pages |
| 1,000,000 | 1,000,000 rows | 3 pages |
| 1,000,000,000 | 1,000,000,000 rows | 4 to 5 pages |

### The leaves are sorted and linked

The bottom level is kept in order, and each leaf links to the next. That is why a B-tree index also speeds up:

- **Ranges:** `WHERE price BETWEEN 100 AND 200`
- **Comparisons:** `WHERE created_at > '2026-01-01'`
- **Sorting:** `ORDER BY created_at`
- **Prefix searches:** `WHERE name LIKE 'Ash%'`
- **Minimum and maximum:** `MIN(price)`, `MAX(price)`

## What an index costs

Indexes are not free.

- **Slower writes.** Every `INSERT`, `UPDATE`, and `DELETE` must update each index on the table. A table with ten indexes does ten extra updates per insert.
- **Disk space.** An index can be a large fraction of the table's size.
- **Memory.** Indexes are fast when they fit in RAM.

So the rule is: **index what you search by, and nothing more.**

## When to add an index

Add one on columns that appear often in:

- `WHERE` conditions
- `JOIN ... ON` conditions, especially foreign keys. See [SQL joins explained](/blogs/sql-joins-explained).
- `ORDER BY` and `GROUP BY`

Primary keys and unique constraints get an index automatically. **Foreign keys do not** in PostgreSQL. Add those yourself.

## When an index does not help

- **Small tables.** Scanning a few hundred rows is faster than using an index.
- **Columns with few different values**, such as a true or false flag. If half the rows match, a scan is cheaper.
- **Tables that are written far more than they are read**, such as raw logs.
- **Queries that return most of the table.**

## Composite indexes: order matters

An index can cover several columns.

```sql
CREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at);
```

Think of a phone book sorted by last name, then first name. You can find "Sharma" quickly, and "Sharma, Asha" quickly. You cannot quickly find everyone named "Asha", because first names are sorted only **inside** each last name.

This is the **leftmost prefix rule**:

| Query | Uses the index? |
|---|---|
| `WHERE customer_id = 5` | Yes |
| `WHERE customer_id = 5 AND created_at > '2026-01-01'` | Yes, fully |
| `WHERE customer_id = 5 ORDER BY created_at` | Yes, and no sorting is needed |
| `WHERE created_at > '2026-01-01'` | No, or only poorly |

**How to order the columns:**

1. Columns compared with `=` first.
2. Then the column used for a range or for sorting.

## Covering indexes

If an index contains every column a query needs, the database answers from the index alone and never touches the table. This is an **index-only scan**.

```sql
-- PostgreSQL: store extra columns in the index leaves
CREATE INDEX idx_orders_customer ON orders (customer_id) INCLUDE (amount);

SELECT amount FROM orders WHERE customer_id = 5;   -- answered from the index
```

## Queries that cannot use your index

These patterns are frequent causes of slow queries.

```sql
-- 1. A function on the column
WHERE LOWER(email) = 'asha@example.com'       -- not used
-- Fix: an index on the expression
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- 2. A wildcard at the start
WHERE name LIKE '%sha'                        -- not used
WHERE name LIKE 'Ash%'                        -- used

-- 3. Math on the column
WHERE price * 1.18 > 1000                     -- not used
WHERE price > 1000 / 1.18                     -- used

-- 4. Type mismatch
WHERE phone = 9876543210                      -- phone is text: conversion on every row
WHERE phone = '9876543210'                    -- used

-- 5. Skipping the first column of a composite index
```

**Rule:** keep the indexed column alone on one side of the comparison.

## Check with EXPLAIN

Never guess. Ask the database what it does.

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'asha@example.com';
```

Before the index (PostgreSQL):

```text
Seq Scan on users  (cost=0.00..218542.00 rows=1 width=72) (actual time=912.4..1840.2 rows=1 loops=1)
  Filter: (email = 'asha@example.com')
  Rows Removed by Filter: 9999999
Execution Time: 1840.3 ms
```

After:

```text
Index Scan using idx_users_email on users  (cost=0.43..8.45 rows=1 width=72) (actual time=0.03..0.03 rows=1 loops=1)
  Index Cond: (email = 'asha@example.com')
Execution Time: 0.05 ms
```

What to look for:

- **Seq Scan** on a large table with a selective filter: probably a missing index.
- **Index Scan** or **Index Only Scan:** the index is used.
- **Rows Removed by Filter** with a large number: the database read many rows it then threw away.
- **Estimated rows far from actual rows:** the statistics are old. Run `ANALYZE`.

The database may **choose** not to use an index when it estimates that a scan is cheaper. That is often correct.

## Other index types

| Type | Good for | Not for |
|---|---|---|
| **B-tree** | Equality, ranges, sorting. The default | |
| **Hash** | Exact matches only | Ranges, sorting |
| **GIN** | Full-text search, arrays, JSON fields | |
| **GiST / spatial** | Locations, shapes, ranges | |
| **BRIN** | Very large tables in natural order, such as time-series data | Randomly ordered data |
| **Vector (HNSW, IVFFlat)** | Similarity search on embeddings | Exact lookups |

Vector indexes power AI search. See [what a vector database is](/blogs/what-is-a-vector-database).

### Unique and partial indexes

```sql
-- Enforce uniqueness, and speed up lookups
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

-- Index only the rows you query: smaller and faster
CREATE INDEX idx_orders_pending ON orders (created_at) WHERE status = 'pending';
```

## Clustered and non-clustered indexes

- A **clustered index** decides the physical order of the rows in the table. There can be only one. In MySQL's InnoDB, the primary key is the clustered index, and the table **is** that B-tree.
- A **non-clustered (secondary) index** is a separate structure that points to the rows.

In InnoDB, secondary indexes store the primary key value, so a lookup through one walks two trees. This is one reason to keep primary keys short.

## A practical process

1. **Find slow queries** with the slow query log or `pg_stat_statements`.
2. **Run `EXPLAIN ANALYZE`** on them.
3. **Add the index** that matches the filter and sort.
4. **Measure again.**
5. **Remove unused indexes.** They slow every write for no gain.

On a busy production table in PostgreSQL, build the index without blocking writes:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders (customer_id);
```

## Common mistakes

- **Indexing every column.** Writes slow down and most of the indexes are never used.
- **Several single-column indexes** where one composite index is needed.
- **Wrong column order** in a composite index.
- **Forgetting foreign keys.**
- **Not checking with `EXPLAIN`.**
- **Wrapping the column in a function** in the query.

For how indexes fit into larger design decisions, see [system design basics](/blogs/system-design-basics).

## FAQ

### What is a database index in simple words?

It is a sorted lookup structure, like the index of a book, that tells the database where rows are so it does not have to read the whole table.

### Do indexes slow down inserts?

Yes. Each insert, update, or delete must also update every index on the table. A few well-chosen indexes are fine. Too many make writes slow.

### Does the order of columns in a composite index matter?

Yes. An index on (a, b) helps queries that filter on a, or on a and b. It does not help a query that filters only on b.

### Why is my query not using the index?

Common reasons: a function or calculation on the indexed column, a leading wildcard in LIKE, a type mismatch, the wrong column order in a composite index, or the database estimating that a full scan is cheaper.
