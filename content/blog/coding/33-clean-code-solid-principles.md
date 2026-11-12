---
title: Clean Code and SOLID Principles Explained With Examples
description: Write code that is easy to read and change. Practical clean code rules and the five SOLID principles, each with a before and after example.
tags: Clean Code, SOLID, Best Practices
keywords: clean code, solid principles, clean code principles, solid principles explained, single responsibility principle, how to write clean code
cover: hero sparkles file-code blocks puzzle check-check
---

**Clean code** is code that another person can read, understand, and change without fear. Code is read far more often than it is written, so writing for the reader saves the most time. The **SOLID principles** are five guidelines for organizing classes and modules so that a change in one place does not break others. This guide covers the everyday rules first and then each SOLID principle with a before and after example in Python.

## Why clean code matters

- **Most of the cost of software is maintenance.** Code is changed for years after it is first written.
- **Messy code slows every later change.** Each shortcut makes the next feature harder.
- **Bugs hide in code that is hard to read.**
- **The reader is often you,** six months later, with no memory of why you wrote it.

## Part 1: everyday clean code rules

### Use names that say what something is

```python
# Unclear
d = 7
def calc(a, b):
    return a * b * 0.18

# Clear
trial_period_days = 7
def calculate_tax(price, quantity):
    return price * quantity * TAX_RATE
```

- Variables and classes are **nouns**: `user`, `invoice_total`.
- Functions are **verbs**: `send_email`, `calculate_total`.
- Booleans read as a question: `is_active`, `has_access`.
- Avoid short forms that only you understand. `customer_address` is better than `cust_addr`.
- A longer, clear name is better than a short, unclear one.

### Keep functions small, with one job

```python
# One function doing four jobs
def process_order(order):
    if not order.items:
        raise ValueError("Order is empty")
    total = sum(item.price * item.quantity for item in order.items)
    if order.coupon:
        total *= 0.9
    db.execute("INSERT INTO orders ...", (order.id, total))
    smtp.send(order.email, f"Your total is {total}")

# Each function does one thing
def process_order(order):
    validate(order)
    total = calculate_total(order)
    save_order(order, total)
    send_confirmation(order, total)
```

The second version reads like a table of contents. Each step can be tested and changed alone.

### Avoid magic numbers

```python
# What do these numbers mean?
if user.age >= 18 and attempts < 3:

# Named constants explain themselves
MINIMUM_AGE = 18
MAX_LOGIN_ATTEMPTS = 3

if user.age >= MINIMUM_AGE and attempts < MAX_LOGIN_ATTEMPTS:
```

### Return early to avoid deep nesting

```python
# Nested
def get_discount(user):
    if user is not None:
        if user.is_active:
            if user.orders > 10:
                return 0.15
            else:
                return 0.05
        else:
            return 0
    else:
        return 0

# Flat, with guard clauses
def get_discount(user):
    if user is None or not user.is_active:
        return 0
    if user.orders > 10:
        return 0.15
    return 0.05
```

### Write comments that explain why

Good code shows **what** it does. A comment should explain **why**, when the reason is not obvious.

```python
# Bad: repeats the code
i += 1   # add one to i

# Good: explains a decision
# The payment provider rejects more than 5 requests per second.
time.sleep(0.2)
```

If you need a comment to explain what a block does, try moving the block into a well-named function.

### Do not repeat yourself (DRY), with care

When the same logic appears in several places, a change must be made in all of them, and one will be missed.

```python
# Repeated rule
if len(password) < 8 or not any(c.isdigit() for c in password): ...
# ... the same check again in another file

# One place
def is_strong_password(password):
    return len(password) >= 8 and any(c.isdigit() for c in password)
```

**Do not overdo it.** Two pieces of code that look alike today may change for different reasons tomorrow. Merging them too early creates one complicated function with many flags. A common rule: wait until you see the same thing a **third** time.

### Handle errors clearly

```python
# Hides every problem
try:
    save(order)
except Exception:
    pass

# Specific, and reported
try:
    save(order)
except DatabaseError as error:
    logger.error("Could not save order %s: %s", order.id, error)
    raise
```

Do not return special values such as `-1` or `None` to signal an error where an exception is clearer.

### Other habits

- **Keep it simple (KISS).** The plainest solution that works is usually the best.
- **Do not build what you do not need yet (YAGNI).** Features for an imagined future are usually wrong.
- **Use a formatter and a linter.** Let tools handle style.
- **Avoid long parameter lists.** More than three or four suggests grouping them into an object.
- **Avoid boolean flag parameters** such as `render(True)`. Two named functions are clearer.
- **Limit side effects.** A function named `get_user` should not also change data.
- **Leave code a little better than you found it.**

## Part 2: the SOLID principles

SOLID is a set of five principles popularized by Robert C. Martin. They apply mainly to object-oriented code, and the ideas carry over to functions and modules.

| Letter | Principle | In one line |
|---|---|---|
| **S** | Single Responsibility | One class, one reason to change |
| **O** | Open/Closed | Add new behavior without editing old code |
| **L** | Liskov Substitution | A subclass must work wherever its parent works |
| **I** | Interface Segregation | Many small interfaces beat one large one |
| **D** | Dependency Inversion | Depend on abstractions, not on concrete details |

### S: Single Responsibility Principle

**A class should have only one reason to change.**

```python
# Before: three responsibilities in one class
class Report:
    def __init__(self, data):
        self.data = data

    def calculate_totals(self):           # business rules
        return sum(self.data)

    def to_html(self):                    # presentation
        return f"<h1>Total: {self.calculate_totals()}</h1>"

    def save(self, path):                 # storage
        with open(path, "w") as file:
            file.write(self.to_html())
```

A change in the calculation, in the layout, or in where files are stored all touch this class.

```python
# After: one responsibility each
class Report:
    def __init__(self, data):
        self.data = data

    def total(self):
        return sum(self.data)

class HtmlReportFormatter:
    def format(self, report):
        return f"<h1>Total: {report.total()}</h1>"

class FileStorage:
    def save(self, path, content):
        with open(path, "w") as file:
            file.write(content)
```

Now a new output format or a new storage place does not touch the calculation.

### O: Open/Closed Principle

**Code should be open for extension and closed for modification.** You should be able to add a new case without editing code that already works.

```python
# Before: every new shape means editing this function
def area(shape):
    if shape["type"] == "circle":
        return 3.14159 * shape["radius"] ** 2
    elif shape["type"] == "rectangle":
        return shape["width"] * shape["height"]
    # a new shape? edit here, and in every other if/elif chain
```

```python
# After: add a class, change nothing else
from abc import ABC, abstractmethod
from math import pi

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    def area(self):
        return pi * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width, self.height = width, height
    def area(self):
        return self.width * self.height

class Triangle(Shape):                       # new shape, no old code touched
    def __init__(self, base, height):
        self.base, self.height = base, height
    def area(self):
        return 0.5 * self.base * self.height

def total_area(shapes: list[Shape]) -> float:
    return sum(shape.area() for shape in shapes)
```

### L: Liskov Substitution Principle

**Wherever a parent class is used, a subclass must work without surprises.**

```python
# Before: a subclass that breaks the promise of its parent
class Bird:
    def fly(self):
        return "flying"

class Penguin(Bird):
    def fly(self):
        raise NotImplementedError("Penguins cannot fly")

def let_it_fly(bird: Bird):
    return bird.fly()          # crashes for a Penguin
```

Code that works with `Bird` breaks when given a `Penguin`. The inheritance is wrong, because not all birds fly.

```python
# After: model what is really true
class Bird:
    def eat(self):
        return "eating"

class FlyingBird(Bird):
    def fly(self):
        return "flying"

class Sparrow(FlyingBird): ...
class Penguin(Bird): ...

def let_it_fly(bird: FlyingBird):
    return bird.fly()          # a Penguin cannot be passed here
```

Signs that this principle is being broken: a subclass that raises "not supported", a subclass that does nothing in an inherited method, or code that checks the exact type before calling a method.

### I: Interface Segregation Principle

**No class should be forced to depend on methods it does not use.**

```python
# Before: one large interface
class Machine(ABC):
    @abstractmethod
    def print(self, document): ...
    @abstractmethod
    def scan(self, document): ...
    @abstractmethod
    def fax(self, document): ...

class BasicPrinter(Machine):
    def print(self, document): ...
    def scan(self, document):
        raise NotImplementedError      # forced to add methods it cannot support
    def fax(self, document):
        raise NotImplementedError
```

```python
# After: small, focused interfaces
class Printer(ABC):
    @abstractmethod
    def print(self, document): ...

class Scanner(ABC):
    @abstractmethod
    def scan(self, document): ...

class BasicPrinter(Printer):
    def print(self, document): ...

class OfficeMachine(Printer, Scanner):
    def print(self, document): ...
    def scan(self, document): ...
```

### D: Dependency Inversion Principle

**High-level code should not depend on low-level details. Both should depend on abstractions.**

```python
# Before: the service is tied to one database
class MySQLDatabase:
    def save(self, user): ...

class UserService:
    def __init__(self):
        self.database = MySQLDatabase()       # fixed inside the class

    def register(self, user):
        self.database.save(user)
```

You cannot use another database, and you cannot test `UserService` without a real MySQL server.

```python
# After: the service depends on an abstraction that is passed in
from typing import Protocol

class UserRepository(Protocol):
    def save(self, user) -> None: ...

class PostgresUserRepository:
    def save(self, user) -> None:
        ...                                   # real database code

class InMemoryUserRepository:
    def __init__(self):
        self.users = []
    def save(self, user) -> None:
        self.users.append(user)

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository          # given from outside

    def register(self, user):
        self.repository.save(user)

# In production
service = UserService(PostgresUserRepository())

# In a test: fast, with no database
repository = InMemoryUserRepository()
UserService(repository).register("asha")
assert repository.users == ["asha"]
```

Passing the dependency in from outside is called **dependency injection**. The main practical benefit is easy testing.

## Do not overdo SOLID

These are guidelines, not laws. Applied without judgment, they create a different kind of mess:

- An interface with exactly one implementation, forever.
- Ten tiny classes where one clear function would do.
- Layers of indirection that make it hard to find where anything happens.

**Start simple.** Introduce an abstraction when you feel real pain: a second implementation appears, a class is hard to test, or a change keeps breaking unrelated code. For a 50-line script, plain functions are the clean solution.

## Code smells: signs that something needs cleaning

| Smell | What it suggests |
|---|---|
| A very long function or class | It does too many things |
| The same code in several places | Extract it |
| A long list of parameters | Group them into an object |
| Deep nesting | Use early returns, or split the function |
| Many `if` or `elif` branches on a type | Consider polymorphism or a lookup table |
| A class that mostly uses another class's data | The method belongs in the other class |
| Comments explaining what the code does | Rename things or extract functions |
| A name with "and" in it, like `validate_and_save` | Two jobs |
| Code that everyone is afraid to change | It needs tests first |

## Refactor safely

**Refactoring** is improving the structure of code without changing what it does.

1. **Have tests first.** They tell you whether you broke something.
2. **Make small steps:** rename, extract a function, move a method.
3. **Run the tests after each step.**
4. **Commit often.** See the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).
5. **Keep refactoring separate from new features** in your commits.

## A review checklist

- Can a new teammate understand this in a few minutes?
- Do the names say what things are and do?
- Does each function do one thing?
- Is anything repeated that should be shared?
- Are errors handled, not hidden?
- Are there tests?
- Is anything more complicated than it needs to be?

AI tools produce code quickly, and it still needs this review. See [how to use AI for coding](/blogs/ai-coding-assistants). For where code quality fits in a career, see [how to become a software engineer](/blogs/how-to-become-software-engineer).

## FAQ

### What is clean code?

Code that is easy to read, understand, and change. It uses clear names, small functions with one purpose, little repetition, and tests.

### What does SOLID stand for?

Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They are five principles for designing maintainable object-oriented code.

### Are SOLID principles still relevant?

Yes, as guidelines. The ideas of small focused units, loose coupling, and depending on abstractions apply in any style of programming. They should be applied with judgment, not everywhere by default.

### What is the most important clean code rule?

Write for the reader. Clear names and small, focused functions do more for readability than any other rule.
