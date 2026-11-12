---
title: Regex Tutorial and Cheat Sheet: Regular Expressions Made Simple
description: Learn regular expressions step by step. Character classes, quantifiers, groups, and lookarounds, with examples in JavaScript and Python.
tags: Regex, Cheat Sheet, Tools
keywords: regex, regex cheat sheet, regex tutorial, regular expression examples, regex in python, regex javascript, email regex
cover: hero regex search text-cursor-input list-checks braces
---

A **regular expression**, or **regex**, is a pattern that describes a set of strings. You use it to **find**, **check**, **extract**, or **replace** text. For example, `\d{4}-\d{2}-\d{2}` matches a date such as `2026-11-12`. Regex looks hard because it is dense, but it is built from a small number of parts: characters, character classes, quantifiers, anchors, and groups. This guide covers each one with examples and ends with a cheat sheet.

## Your first patterns

A plain word matches itself.

```javascript
/cat/.test("concatenate");        // true: "cat" appears inside
```

Special characters add meaning.

```javascript
/c.t/.test("cut");                // true: "." matches any single character
/^cat/.test("concatenate");       // false: "^" means the start of the text
/colou?r/.test("color");          // true: "?" makes the "u" optional
```

## The building blocks

### Special characters

These have a meaning and must be written with a backslash in front when you want the character itself:

```text
.  ^  $  *  +  ?  (  )  [  ]  {  }  |  \
```

So `\.` matches a real dot, and `\?` matches a real question mark.

### Character classes

| Pattern | Matches |
|---|---|
| `.` | Any character except a line break |
| `\d` | A digit, 0 to 9 |
| `\D` | Anything that is not a digit |
| `\w` | A letter, digit, or underscore |
| `\W` | Anything that is not `\w` |
| `\s` | A space, tab, or line break |
| `\S` | Anything that is not whitespace |
| `[abc]` | One of a, b, or c |
| `[^abc]` | Any character except a, b, or c |
| `[a-z]` | Any lowercase letter |
| `[A-Za-z0-9]` | Any letter or digit |

### Quantifiers: how many

| Pattern | Meaning |
|---|---|
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 (optional) |
| `{3}` | Exactly 3 |
| `{2,5}` | 2 to 5 |
| `{2,}` | 2 or more |

```text
\d+        one or more digits:        "7", "42", "2026"
\d{3}      exactly three digits:      "404"
go+gle     "gogle", "google", "gooogle"
```

### Anchors: where

| Pattern | Meaning |
|---|---|
| `^` | Start of the text, or of a line with the `m` flag |
| `$` | End of the text, or of a line with the `m` flag |
| `\b` | A word boundary |
| `\B` | Not a word boundary |

```javascript
/^\d+$/.test("12345");            // true: only digits, from start to end
/^\d+$/.test("123abc");           // false
/\bcat\b/.test("the cat sat");    // true: "cat" as a whole word
/\bcat\b/.test("concatenate");    // false
```

**To validate a whole string, always use `^` and the end anchor.** Without them, the pattern only needs to match somewhere inside.

### Groups and alternatives

| Pattern | Meaning |
|---|---|
| `(abc)` | A capturing group: remembers what it matched |
| `(?:abc)` | A group that does not capture |
| `(?<name>abc)` | A named group |
| `a\|b` | a or b |
| `\1` | The same text that group 1 matched |

```javascript
const match = "2026-11-12".match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(match[1], match[2], match[3]);     // 2026 11 12
```

Named groups are easier to read:

```javascript
const { year, month, day } = "2026-11-12".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/).groups;
```

### Flags

| Flag | Meaning |
|---|---|
| `g` | Global: find all matches, not only the first |
| `i` | Ignore upper and lower case |
| `m` | Multiline: `^` and the end anchor work on each line |
| `s` | Dot also matches line breaks |
| `u` | Full Unicode support |

## Greedy and lazy matching

Quantifiers are **greedy**: they take as much as they can.

```javascript
"<b>one</b> and <b>two</b>".match(/<b>.*<\/b>/)[0];
// "<b>one</b> and <b>two</b>"     <- too much
```

Add `?` after a quantifier to make it **lazy**: as little as possible.

```javascript
"<b>one</b> and <b>two</b>".match(/<b>.*?<\/b>/)[0];
// "<b>one</b>"
```

Often a clearer solution is to say what is **not** allowed: `<b>[^<]*<\/b>`.

## Lookarounds

A lookaround checks what is before or after, without including it in the match.

| Pattern | Meaning |
|---|---|
| `(?=abc)` | Followed by abc |
| `(?!abc)` | Not followed by abc |
| `(?<=abc)` | Preceded by abc |
| `(?<!abc)` | Not preceded by abc |

```javascript
"Price: 250 USD".match(/\d+(?= USD)/)[0];          // "250"
"file.txt file.bak".match(/\b\w+(?!\.bak)\.\w+/);  // matches "file.txt"
```

A common use is a password rule: at least 8 characters, with a digit and a capital letter.

```javascript
const strong = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
strong.test("Secret123");      // true
strong.test("secret123");      // false: no capital letter
```

## Regex in JavaScript

```javascript
const text = "Call 555-1234 or 555-9876";
const pattern = /\d{3}-\d{4}/g;

pattern.test(text);                       // true
text.match(pattern);                      // ["555-1234", "555-9876"]
text.replace(pattern, "[hidden]");        // "Call [hidden] or [hidden]"
text.split(/\s+/);                        // split on any whitespace

for (const m of text.matchAll(/(\d{3})-(\d{4})/g)) {
  console.log(m[0], m[1], m[2], m.index);
}

// Swap the parts of a date with group references
"2026-11-12".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");   // "12/11/2026"
```

To build a pattern from a variable, use the constructor and escape the user's text:

```javascript
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern2 = new RegExp(escapeRegex(userInput), "i");
```

## Regex in Python

```python
import re

text = "Call 555-1234 or 555-9876"

re.search(r"\d{3}-\d{4}", text).group()        # "555-1234" (first match)
re.findall(r"\d{3}-\d{4}", text)               # ["555-1234", "555-9876"]
re.sub(r"\d{3}-\d{4}", "[hidden]", text)       # replace all
re.split(r"\s+", text)                         # split on whitespace
re.fullmatch(r"\d+", "12345")                  # the whole string must match

match = re.search(r"(?P<area>\d{3})-(?P<number>\d{4})", text)
print(match.group("area"), match.group("number"))

pattern = re.compile(r"\d{3}-\d{4}")           # compile once if used many times
```

**Always write Python patterns as raw strings**, with an `r` in front. Otherwise the backslashes are read by Python before the regex engine sees them.

- `re.match` checks only at the **start** of the string.
- `re.search` looks **anywhere**.
- `re.fullmatch` requires the **whole** string to match.

## Useful patterns

```text
Whole number                 ^-?\d+$
Decimal number               ^-?\d+(\.\d+)?$
Date YYYY-MM-DD (shape only) ^\d{4}-\d{2}-\d{2}$
Time HH:MM (24 hour)         ^([01]\d|2[0-3]):[0-5]\d$
Hex color                    ^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$
URL slug                     ^[a-z0-9]+(-[a-z0-9]+)*$
Username, 3 to 16 characters ^[a-zA-Z0-9_]{3,16}$
Simple email check           ^[^\s@]+@[^\s@]+\.[^\s@]+$
IPv4 address (shape only)    ^(\d{1,3}\.){3}\d{1,3}$
Blank lines                  ^\s*$
Extra spaces                 \s{2,}
```

### About email validation

A regex that follows the full email standard is extremely long and still cannot tell you whether the address exists. Use a simple check like the one above to catch typing mistakes, and then **send a confirmation email**. That is the only real validation. In a browser, `<input type="email">` does a reasonable check for you.

## When not to use regex

- **HTML or XML.** Nested tags cannot be handled reliably with regex. Use a parser.
- **JSON, CSV, URLs, dates.** Use the proper library: `JSON.parse`, a CSV module, the `URL` class, a date library.
- **Simple checks.** `text.includes("abc")`, `startsWith`, and `split` are clearer and faster.
- **Programming languages.** Use a real parser.

A good test: if the pattern needs a long comment to explain it, a few lines of normal code may be better.

## Make patterns readable

Python's verbose mode lets you add spaces and comments:

```python
phone = re.compile(r"""
    ^\+?(\d{1,3})?      # optional country code
    [\s-]?              # optional separator
    (\d{3})             # area code
    [\s-]?
    (\d{3})
    [\s-]?
    (\d{4})$
""", re.VERBOSE)
```

In any language, you can build a pattern from named parts and test each part separately.

## A performance and security warning

Some patterns can take an extremely long time on certain inputs. This is called **catastrophic backtracking**.

```javascript
/^(a+)+$/.test("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!");   // can freeze for a very long time
```

The nested quantifier `(a+)+` gives the engine an exponential number of ways to try. An attacker can send such input on purpose to hang your server. This is known as **ReDoS**.

To avoid it:

- Do not nest quantifiers like `(a+)+` or `(a*)*`.
- Avoid alternatives that overlap, such as `(a|a)*`.
- Limit the length of the input before matching.
- Do not run patterns supplied by users.
- Use an engine with guaranteed linear time, such as RE2, where that matters.

## How to learn and test

Use an online tester such as regex101 or RegExr. They explain each part of a pattern and show the matches as you type. Build a pattern step by step: start with the simplest version that matches, then add one rule at a time, testing with examples that **should** match and examples that **should not**.

For other everyday command-line tools that use regex, such as `grep` and `sed`, see the [Linux commands cheat sheet](/blogs/linux-commands-cheat-sheet). For the wider risks of trusting user input, see [SQL injection prevention](/blogs/sql-injection-prevention).

## FAQ

### What is regex in simple words?

It is a compact pattern language for describing text, used to search for, check, extract, or replace parts of strings.

### What does \d mean in regex?

It matches one digit from 0 to 9. `\d+` matches one or more digits, and `\d{4}` matches exactly four.

### What is the difference between * and + in regex?

`*` means zero or more of the item before it. `+` means one or more. So `a*` also matches an empty string, and `a+` needs at least one "a".

### How do I match a literal dot or question mark?

Put a backslash in front: `\.` matches a dot and `\?` matches a question mark. Inside square brackets, most special characters lose their meaning, so `[.]` also matches a dot.
