---
title: SQL Injection Explained: How It Works and How to Prevent It
description: SQL injection lets attackers run their own commands in your database. See how the attack works and stop it with parameterized queries.
tags: Security, SQL, Web Development
keywords: sql injection, how to prevent sql injection, sql injection example, parameterized queries, prepared statements, sql injection attack
cover: hero shield-alert database syringe lock bug
---

**SQL injection** is an attack where a user's input is treated as part of a SQL command, so the attacker can change what the query does. It happens when a program builds a query by joining strings that include user input. The fix is simple and complete: **never build SQL with string concatenation. Use parameterized queries**, also called prepared statements, which send the command and the data to the database separately.

## How the attack works

Here is a login check written the unsafe way.

```python
# VULNERABLE - never do this
username = request.form["username"]
password = request.form["password"]

query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
cursor.execute(query)
```

For a normal user, the query is:

```sql
SELECT * FROM users WHERE username = 'asha' AND password = 'secret123'
```

Now an attacker types this as the username, with any password:

```text
admin' --
```

The query becomes:

```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'
```

In SQL, `--` starts a comment. Everything after it is ignored, including the password check. The attacker is logged in as admin without knowing the password.

Another classic input:

```text
' OR '1'='1
```

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'
```

`'1'='1'` is always true, so the query returns every user.

**The root cause:** the database cannot tell which part of the string is your command and which part is the user's data. The quote character let the data escape and become code.

## What an attacker can do

- **Log in without a password.**
- **Read any data:** passwords, emails, payment details.
- **Change or delete data.**
- **Read other tables** by adding a `UNION SELECT`.
- **Destroy tables** on databases that allow several statements in one call.
- **Take over the server** in some setups, through database features that read files or run commands.

```text
Input:  ' UNION SELECT username, password FROM users --
```

```sql
SELECT name, price FROM products WHERE category = '' UNION SELECT username, password FROM users --'
```

A product search page now lists every username and password hash.

SQL injection has been behind many large data breaches and remains in the OWASP Top 10 list of web security risks.

### Types of SQL injection

- **In-band:** the result appears directly on the page, as in the examples above.
- **Error-based:** the attacker reads details from database error messages.
- **Blind:** nothing is shown. The attacker asks true or false questions and watches whether the page changes, or how long it takes to respond.
- **Second-order:** harmful input is stored safely first, and used unsafely by a different query later.

## The fix: parameterized queries

Write the query with **placeholders** and pass the values separately. The database receives the command first and the data second, and it **never treats the data as SQL**.

### Python

```python
# SAFE
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password_hash = %s",
    (username, password_hash),
)
```

With SQLite the placeholder is `?`:

```python
cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
```

If the attacker types `admin' --`, the database searches for a user whose name is literally `admin' --`. No such user exists. The attack fails.

### Node.js

```javascript
// SAFE - PostgreSQL with the pg library
const result = await pool.query(
  "SELECT * FROM users WHERE email = $1 AND status = $2",
  [email, "active"]
);
```

```javascript
// SAFE - MySQL with mysql2
const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
```

### Java

```java
// SAFE
String sql = "SELECT * FROM users WHERE email = ?";
try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, email);
    ResultSet result = statement.executeQuery();
}
```

### PHP

```php
// SAFE - PDO
$statement = $pdo->prepare("SELECT * FROM users WHERE email = :email");
$statement->execute(["email" => $email]);
$user = $statement->fetch();
```

### Go

```go
// SAFE
row := db.QueryRow("SELECT id, name FROM users WHERE email = $1", email)
```

**Unsafe and safe, side by side:**

```python
# UNSAFE: the value is pasted into the SQL text
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
cursor.execute("SELECT * FROM users WHERE id = " + user_id)
cursor.execute("SELECT * FROM users WHERE id = %s" % user_id)

# SAFE: the value is passed as a separate argument
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```

Look closely at the last two. They look alike. The unsafe one uses Python's `%` operator to format the string **before** the database sees it. The safe one passes the value as a second argument.

## ORMs and query builders

An ORM such as SQLAlchemy, Django ORM, Prisma, Hibernate, or Eloquent creates parameterized queries for you.

```python
# Django - safe
User.objects.filter(email=email)
```

```javascript
// Prisma - safe
const user = await prisma.user.findUnique({ where: { email } });
```

**An ORM does not protect you when you write raw SQL through it:**

```python
# UNSAFE even with an ORM
User.objects.raw(f"SELECT * FROM users WHERE email = '{email}'")

# SAFE
User.objects.raw("SELECT * FROM users WHERE email = %s", [email])
```

```javascript
// Prisma: the tagged template is safe, because values become parameters
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;

// UNSAFE: a plain string built by hand
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`);
```

## What placeholders cannot do

Placeholders work for **values** only. They cannot stand in for table names, column names, or keywords such as `ASC` and `DESC`.

```python
# Does not work: you cannot parameterize a column name
cursor.execute("SELECT * FROM products ORDER BY %s", (sort_column,))
```

For these, use an **allowlist**: accept only values from a fixed list you wrote.

```python
ALLOWED_SORT = {"name": "name", "price": "price", "newest": "created_at"}
ALLOWED_DIRECTION = {"asc": "ASC", "desc": "DESC"}

column = ALLOWED_SORT.get(request.args.get("sort"), "name")
direction = ALLOWED_DIRECTION.get(request.args.get("dir"), "ASC")

cursor.execute(f"SELECT * FROM products ORDER BY {column} {direction}")
```

The user's text never reaches the query. It only selects one of your own strings.

### LIKE and IN

```python
# LIKE: put the wildcards in the value, not in the SQL
cursor.execute("SELECT * FROM products WHERE name LIKE %s", (f"%{search}%",))

# IN: create one placeholder per value
ids = [3, 7, 9]
placeholders = ", ".join(["%s"] * len(ids))
cursor.execute(f"SELECT * FROM products WHERE id IN ({placeholders})", ids)
```

## Extra layers of defense

Parameterized queries are the main fix. These limit the damage if a mistake gets through.

- **Least privilege.** The database user of your app should have only the rights it needs. A website usually does not need `DROP TABLE`, or access to other databases.
- **Validate input.** If an ID must be a number, convert it to a number and reject anything else.
- **Hide database errors from users.** Show a general message and log the details on the server. Error text helps attackers.
- **Hash passwords** with bcrypt or Argon2. Never store them as plain text, and never compare a password inside a SQL query.
- **Use a web application firewall** as an extra filter, not as your main defense.
- **Keep the database and libraries updated.**
- **Review and test.** Use static analysis tools in your build, and test your own app with a scanner such as sqlmap, **only on systems you own or have permission to test**.

## Things that do not work

- **Escaping quotes by hand.** It is easy to miss a case, such as numbers without quotes or unusual character encodings.
- **Blocking words** such as `SELECT` or `DROP`. Attackers get around filters with different spelling, comments, and encodings, and real users named "Drop" get blocked.
- **Checking input only in the browser.** An attacker sends requests directly and skips your JavaScript.
- **Assuming stored procedures are safe.** They are, unless they build SQL from strings inside.

## A checklist for code review

1. Search the code for SQL built with `+`, f-strings, template strings, or `format`.
2. Check every raw query in ORM code.
3. Check every place where a column name or sort order comes from the user.
4. Confirm the app's database account has limited rights.
5. Confirm that error pages show no SQL.

## Related attacks

The same mistake, mixing commands with untrusted data, appears elsewhere:

- **NoSQL injection:** passing user-controlled objects as query filters in databases such as MongoDB.
- **Command injection:** putting user input into a shell command.
- **Cross-site scripting (XSS):** putting user input into HTML without escaping.
- **Prompt injection:** putting untrusted text into an AI model's instructions. See [prompt injection explained](/blogs/prompt-injection-explained).

In every case the principle is the same: **keep code and data apart.**

For more on working with databases, see [SQL joins explained](/blogs/sql-joins-explained) and [how database indexes work](/blogs/how-database-indexes-work).

## FAQ

### What is SQL injection in simple words?

It is an attack where someone types SQL code into an input field, and the application runs it as part of its own database query.

### How do I prevent SQL injection?

Use parameterized queries or prepared statements for every query that includes outside data. Never build SQL by joining strings. Add input validation and limited database permissions as extra protection.

### Do ORMs prevent SQL injection?

Yes, for their normal query methods, which use parameters. Raw SQL written through an ORM with string formatting is still vulnerable.

### Is escaping user input enough to stop SQL injection?

No. Manual escaping is easy to get wrong. Parameterized queries remove the problem by never mixing data into the SQL text.
