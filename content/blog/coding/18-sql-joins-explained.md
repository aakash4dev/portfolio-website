---
title: SQL Joins Explained With Examples: INNER, LEFT, RIGHT, FULL
description: Learn every SQL join with one small data set and the exact result of each query. INNER, LEFT, RIGHT, FULL, CROSS, and self joins made clear.
tags: SQL, Databases, Joins
keywords: sql joins, sql joins with examples, inner join vs outer join, left join vs right join, sql join query, sql joins interview questions
cover: hero table-2 link database filter list-checks
---

A **SQL join** combines rows from two tables using a column they share. An **INNER JOIN** returns only the rows that match in both tables. A **LEFT JOIN** returns every row from the left table and fills in `NULL` where the right table has no match. A **RIGHT JOIN** does the same for the right table. A **FULL OUTER JOIN** returns all rows from both. This guide uses one small data set and shows the result of each join.

## The sample data

Two tables: customers and their orders.

```sql
CREATE TABLE customers (
    id   INT PRIMARY KEY,
    name TEXT
);

CREATE TABLE orders (
    id          INT PRIMARY KEY,
    customer_id INT,
    amount      INT
);

INSERT INTO customers VALUES (1, 'Asha'), (2, 'Ben'), (3, 'Chen');
INSERT INTO orders VALUES (101, 1, 500), (102, 1, 300), (103, 2, 700), (104, 9, 100);
```

**customers**

| id | name |
|---|---|
| 1 | Asha |
| 2 | Ben |
| 3 | Chen |

**orders**

| id | customer_id | amount |
|---|---|---|
| 101 | 1 | 500 |
| 102 | 1 | 300 |
| 103 | 2 | 700 |
| 104 | 9 | 100 |

Two details to notice:

- **Chen** has no orders.
- **Order 104** belongs to customer 9, who does not exist.

These two rows show the difference between the joins.

## INNER JOIN

Returns only rows that have a match in **both** tables.

```sql
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | amount |
|---|---|---|
| Asha | 101 | 500 |
| Asha | 102 | 300 |
| Ben | 103 | 700 |

Chen is missing, because he has no order. Order 104 is missing, because its customer does not exist. Writing `JOIN` alone means `INNER JOIN`.

## LEFT JOIN

Returns **all rows from the left table**, plus matching rows from the right. Where there is no match, the right side is `NULL`.

```sql
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | amount |
|---|---|---|
| Asha | 101 | 500 |
| Asha | 102 | 300 |
| Ben | 103 | 700 |
| Chen | NULL | NULL |

Chen appears now, with empty order columns. This is the join you will use most after the inner join.

### Find rows with no match

A very common pattern: customers who have never ordered.

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

| name |
|---|
| Chen |

## RIGHT JOIN

Returns **all rows from the right table**, plus matches from the left.

```sql
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | amount |
|---|---|---|
| Asha | 101 | 500 |
| Asha | 102 | 300 |
| Ben | 103 | 700 |
| NULL | 104 | 100 |

Order 104 appears with no customer name. A right join is a left join with the tables swapped. Most people write only left joins, because reading in one direction is easier.

## FULL OUTER JOIN

Returns **all rows from both tables**, matched where possible.

```sql
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | amount |
|---|---|---|
| Asha | 101 | 500 |
| Asha | 102 | 300 |
| Ben | 103 | 700 |
| Chen | NULL | NULL |
| NULL | 104 | 100 |

Useful for comparing two data sets and finding what is missing on either side.

**MySQL does not support `FULL OUTER JOIN`.** Combine a left and a right join:

```sql
SELECT c.name, o.id, o.amount FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
UNION
SELECT c.name, o.id, o.amount FROM customers c RIGHT JOIN orders o ON o.customer_id = c.id;
```

## CROSS JOIN

Returns **every combination** of rows. There is no `ON` condition.

```sql
SELECT c.name, o.id AS order_id
FROM customers c
CROSS JOIN orders o;
```

3 customers × 4 orders = 12 rows. Use it on purpose, for example to create every combination of sizes and colors. An accidental cross join on large tables creates millions of rows.

## SELF JOIN

A table joined to itself. The usual example is employees and their managers.

```sql
CREATE TABLE employees (id INT, name TEXT, manager_id INT);
INSERT INTO employees VALUES (1, 'Priya', NULL), (2, 'Ravi', 1), (3, 'Sara', 1);

SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;
```

| employee | manager |
|---|---|
| Priya | NULL |
| Ravi | Priya |
| Sara | Priya |

The aliases `e` and `m` treat one table as two.

## All joins at a glance

| Join | Returns |
|---|---|
| `INNER JOIN` | Only rows that match in both tables |
| `LEFT JOIN` | All left rows, plus matches, `NULL` where none |
| `RIGHT JOIN` | All right rows, plus matches, `NULL` where none |
| `FULL OUTER JOIN` | All rows from both tables |
| `CROSS JOIN` | Every combination of rows |
| Self join | A table matched with itself |

## Joining more than two tables

Add one join after another.

```sql
SELECT c.name, o.id AS order_id, p.title, oi.quantity
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
WHERE o.amount > 400;
```

Read it as a chain: customers to orders, orders to items, items to products.

## Joins with GROUP BY

Total spent by each customer, including those with no orders:

```sql
SELECT c.name,
       COUNT(o.id)                AS orders,
       COALESCE(SUM(o.amount), 0) AS total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total DESC;
```

| name | orders | total |
|---|---|---|
| Asha | 2 | 800 |
| Ben | 1 | 700 |
| Chen | 0 | 0 |

Two details matter:

- `COUNT(o.id)` counts only real orders. `COUNT(*)` would give Chen 1, because his row exists.
- `COALESCE(..., 0)` turns `NULL` into 0.

## The most common join mistakes

### 1. A WHERE clause that cancels a LEFT JOIN

```sql
-- Wrong: Chen disappears. The WHERE removes rows where o.amount is NULL.
SELECT c.name, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.amount > 400;

-- Right: put the condition in the ON clause
SELECT c.name, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.amount > 400;
```

A filter on the right table in `WHERE` turns a left join into an inner join. Put such conditions in `ON`.

### 2. Duplicate rows

A join returns one row **per match**. Asha has two orders, so she appears twice. If you then join another table with several rows per customer, the numbers multiply and sums become wrong. Aggregate first in a subquery, then join.

### 3. Forgetting the ON condition

This produces every combination of rows. Always check the row count.

### 4. Ambiguous column names

Both tables have a column named `id`. Use table aliases: `c.id`, `o.id`.

### 5. NULL never equals NULL

`NULL = NULL` is not true in SQL. Rows with `NULL` in the join column do not match each other.

### 6. Joining on columns of different types

A text column joined to a number column forces a conversion on every row and prevents the use of an index.

## Performance tips

- **Index the join columns**, especially foreign keys such as `orders.customer_id`. This is the largest single improvement. See [how database indexes work](/blogs/how-database-indexes-work).
- **Select only the columns you need**, not `SELECT *`.
- **Filter early** so fewer rows are joined.
- **Use `EXPLAIN`** to see how the database runs the query.
- **Use `EXISTS` to check for presence** when you do not need the other table's columns:

```sql
SELECT c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

This returns each customer once, with no duplicates.

## Interview questions to practice

1. What is the difference between an inner join and a left join?
2. Find customers who have not placed any order.
3. Find the second highest order amount for each customer.
4. What happens if a join column contains `NULL`?
5. What is the difference between `WHERE` and `ON` in a left join?
6. What is the difference between `UNION` and `UNION ALL`? (`UNION` removes duplicates. `UNION ALL` keeps them and is faster.)
7. Write a query to list each employee with their manager's name.

When values from users go into your queries, read [SQL injection prevention](/blogs/sql-injection-prevention).

## FAQ

### What is the difference between INNER JOIN and LEFT JOIN?

An inner join returns only rows that have a match in both tables. A left join returns every row from the left table, with `NULL` in the right table's columns where there is no match.

### What is the difference between LEFT JOIN and RIGHT JOIN?

They are mirror images. A left join keeps all rows of the first table, and a right join keeps all rows of the second. Any right join can be rewritten as a left join by swapping the tables.

### Is JOIN the same as INNER JOIN?

Yes. In SQL, `JOIN` without another keyword means `INNER JOIN`.

### Why does my join return duplicate rows?

A join returns one row for each matching pair. If one row matches several rows in the other table, it appears several times. Aggregate, or use `EXISTS`, if you need one row per item.
