---
title: JavaScript Closures Explained With Simple Examples
description: A closure is a function that remembers variables from where it was created. Learn how closures work, real uses, and the classic loop bug.
tags: JavaScript, Closures, Fundamentals
keywords: javascript closures, how do javascript closures work, closure example, what is a closure in javascript, closures interview question
cover: code JS package-open
---

A **closure** is a function together with the variables that were in scope when the function was created. The function keeps access to those variables even after the outer function has finished running. Every function in JavaScript forms a closure. You notice it when an inner function is returned or passed somewhere else and still "remembers" its original surroundings.

## The basic example

```javascript
function createCounter() {
  let count = 0;                 // a local variable

  return function () {
    count += 1;                  // the inner function uses it
    return count;
  };
}

const counter = createCounter();
console.log(counter());   // 1
console.log(counter());   // 2
console.log(counter());   // 3
```

`createCounter` has finished, so you might expect `count` to be gone. It is not. The returned function still holds a reference to it. That inner function plus its remembered `count` is the closure.

Each call to `createCounter` makes a new, separate `count`:

```javascript
const a = createCounter();
const b = createCounter();
a(); a();
console.log(a());   // 3
console.log(b());   // 1  - b has its own count
```

## Why it works: lexical scope

JavaScript uses **lexical scope**. A function can see variables based on **where it is written** in the code, not where it is called from.

```javascript
const name = "global";

function outer() {
  const name = "outer";
  function inner() {
    console.log(name);    // looks outward from where inner is WRITTEN
  }
  return inner;
}

const fn = outer();
fn();   // "outer", not "global"
```

When a function is created, it keeps a link to the scope around it. When it needs a variable, it looks in its own scope first, then the enclosing one, then the next, up to the global scope. As long as the function exists, the variables it can reach are kept alive.

**A closure holds the variable itself, not a copy of its value.** If the variable changes, the function sees the new value.

```javascript
function makeBox() {
  let value = 1;
  return {
    get: () => value,
    set: (v) => { value = v; },
  };
}

const box = makeBox();
box.set(42);
console.log(box.get());   // 42 - both functions share the same variable
```

## What closures are used for

### 1. Private data

Nothing outside the function can touch `balance` except through the returned methods.

```javascript
function createAccount(initial) {
  let balance = initial;

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(100);
account.deposit(50);
console.log(account.getBalance());   // 150
console.log(account.balance);        // undefined - truly private
```

### 2. Functions that make functions

```javascript
function multiplyBy(factor) {
  return (number) => number * factor;
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));   // 10
console.log(triple(5));   // 15
console.log([1, 2, 3].map(double));   // [2, 4, 6]
```

### 3. Event handlers and callbacks

The handler remembers `label` long after `setup` has returned.

```javascript
function setup(button, label) {
  let clicks = 0;
  button.addEventListener("click", () => {
    clicks += 1;
    console.log(`${label} clicked ${clicks} times`);
  });
}
```

### 4. Run once

```javascript
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const init = once(() => console.log("Initialized"));
init();   // "Initialized"
init();   // nothing
```

### 5. Caching results (memoization)

```javascript
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e8; i++); return n * n; };
const fastSquare = memoize(slowSquare);

fastSquare(9);   // slow the first time
fastSquare(9);   // instant: read from the cache
```

### 6. Debounce

Wait until the user stops typing before running a search. The closure holds the timer.

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce((text) => console.log("Searching:", text), 300);
```

### 7. React hooks

`useState` and `useEffect` depend on closures. Each render creates new functions that close over that render's values.

## The classic loop bug

This is the most common closure interview question.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3
```

Why: `var` creates **one** variable `i` for the whole function. The three callbacks all close over that same variable. By the time they run, the loop has ended and `i` is 3.

**The fix: use `let`.**

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2
```

`let` creates a **new** `i` for each turn of the loop, so each callback closes over its own.

Before `let` existed, the fix was a function that runs at once to create a new scope:

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

You will still see this in old code.

## Stale closures

A closure can hold an **old** value when you expected the new one. This is frequent in React.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);      // "count" is always 0 here: stale closure
    }, 1000);
    return () => clearInterval(id);
  }, []);                       // the effect runs once and keeps the first "count"
}
```

The callback was created in the first render and closed over `count = 0`. It never sees later values.

**Fix:** use the update form, which receives the current value:

```javascript
setCount((current) => current + 1);
```

Or list `count` in the dependency array, so the effect is created again when it changes.

## Closures and memory

A closure keeps its outer variables alive for as long as the function itself is reachable. That is usually what you want. It becomes a leak when a long-lived function holds something large that it no longer needs.

```javascript
function attach() {
  const hugeData = new Array(1_000_000).fill("x");
  window.addEventListener("resize", () => {
    console.log(hugeData.length);      // keeps hugeData in memory forever
  });
}
```

**Avoid leaks:**

- Remove event listeners and clear timers when they are no longer needed.
- Keep only what you need. Store `hugeData.length` in a variable and close over that.
- In React, return a cleanup function from `useEffect`.

## Closures vs classes

Both can hold private state. Modern classes have private fields with `#`.

```javascript
class Account {
  #balance = 0;
  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; }
}
```

Use what fits. Closures are light and need no `this`. Classes are clearer for objects with many methods and many instances.

## How to explain closures in an interview

A short, correct answer:

> "A closure is a function bundled with references to the variables in the scope where it was defined. Because of lexical scoping, the function keeps access to those variables even after the outer function has returned. I use closures for private state, function factories, and callbacks."

Then give the counter example.

Closures are also behind callbacks and promises. See [async and await in JavaScript](/blogs/javascript-async-await) and [the JavaScript event loop](/blogs/javascript-event-loop).

## FAQ

### What is a closure in JavaScript in simple words?

A function that remembers the variables around it from the place where it was created, and can still use them later, even when called somewhere else.

### Why are closures useful?

They let you keep private data, create customized functions, and let callbacks and event handlers remember values they need later.

### Do closures cause memory leaks?

Not by themselves. A leak can happen when a long-lived function, such as an event listener that is never removed, keeps a large object alive.

### Why does a loop with var print the same number?

`var` creates one shared variable for the whole loop, so all callbacks see its final value. Use `let`, which creates a new variable on each turn of the loop.
