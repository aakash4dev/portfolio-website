---
title: Async Await in JavaScript Explained: Promises Made Simple
description: async and await let you write asynchronous JavaScript that reads top to bottom. Learn promises, error handling, parallel calls, and loops.
tags: JavaScript, Async, Promises
keywords: async await javascript, async await, async await vs promises, async await in js, async await foreach, promise.all
cover: code JS timer
---

`async` and `await` are JavaScript keywords for working with **promises** in a way that reads like normal, step-by-step code. Marking a function `async` makes it return a promise. Inside it, `await` pauses that function until a promise finishes and gives you its result, without blocking the rest of the program. They do not replace promises. They are a cleaner way to use them.

## Why asynchronous code exists

JavaScript runs your code on a single thread. If it waited for a slow network request, the page would freeze. So slow operations start and **finish later**, and you say what should happen when they do. How this scheduling works is covered in [the JavaScript event loop](/blogs/javascript-event-loop).

The ways to say "do this when it finishes" have improved over time:

```javascript
// 1. Callbacks (old)
getUser(1, (error, user) => {
  if (error) return handle(error);
  getPosts(user.id, (error, posts) => {
    if (error) return handle(error);
    console.log(posts);                 // nesting grows with every step
  });
});

// 2. Promises
getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => console.log(posts))
  .catch(handle);

// 3. async / await
async function showPosts() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    console.log(posts);
  } catch (error) {
    handle(error);
  }
}
```

## Promises in one minute

A **promise** is an object that stands for a value that is not ready yet. It is in one of three states:

- **Pending:** still working.
- **Fulfilled:** finished with a value.
- **Rejected:** failed with an error.

```javascript
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(1000).then(() => console.log("one second later"));
```

## async functions

```javascript
async function getNumber() {
  return 42;
}

console.log(getNumber());           // Promise { 42 }
getNumber().then(console.log);      // 42
```

An `async` function **always returns a promise**. A returned value becomes the promise's result. A thrown error becomes a rejection.

## await

`await` can be used inside an `async` function, and at the top level of a module.

```javascript
async function loadUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const user = await response.json();
  return user;
}
```

`await` pauses **only this function**. The rest of the program keeps running. When the promise finishes, the function continues from that line.

Note the check on `response.ok`. `fetch` rejects only on network failure. A 404 or 500 response still fulfils the promise, so you must check the status yourself.

## Error handling

Use `try` and `catch`, as in synchronous code.

```javascript
async function loadDashboard() {
  try {
    const user = await loadUser(1);
    const orders = await loadOrders(user.id);
    return { user, orders };
  } catch (error) {
    console.error("Could not load the dashboard:", error.message);
    return null;
  } finally {
    hideSpinner();          // runs in both cases
  }
}
```

If you do not catch a rejection anywhere, you get an "unhandled promise rejection". In Node.js that stops the program by default.

## Running things in parallel

This is the most important performance point.

### Slow: one after another

```javascript
const user = await getUser();         // 1 second
const posts = await getPosts();       // 1 second
const stats = await getStats();       // 1 second
// total: about 3 seconds
```

Each `await` waits for the one before, even though these requests do not depend on each other.

### Fast: all at once

```javascript
const [user, posts, stats] = await Promise.all([getUser(), getPosts(), getStats()]);
// total: about 1 second
```

`Promise.all` starts everything together and waits for all of them.

**Rule:** if a task needs the result of the previous one, use `await` in sequence. If tasks are independent, use `Promise.all`.

### The Promise helpers

| Method | Finishes when | If one fails |
|---|---|---|
| `Promise.all` | All succeed | Rejects at once with that error |
| `Promise.allSettled` | All finish | Never rejects. Gives the status of each |
| `Promise.race` | The first one finishes, success or failure | Rejects if the first to finish failed |
| `Promise.any` | The first one succeeds | Rejects only if all fail |

```javascript
const results = await Promise.allSettled([getUser(), getPosts(), getStats()]);

for (const result of results) {
  if (result.status === "fulfilled") console.log(result.value);
  else console.warn("Failed:", result.reason.message);
}
```

Use `allSettled` when one failure should not cancel the rest.

A timeout with `race`:

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms));
  return Promise.race([promise, timeout]);
}

const data = await withTimeout(fetch("/api/slow"), 5000);
```

## async and loops

### forEach does not wait

This is a very common bug.

```javascript
// BUG: forEach ignores the promises
ids.forEach(async (id) => {
  await saveItem(id);
});
console.log("done");      // prints BEFORE the items are saved
```

`forEach` calls the function for each item and does not wait for the returned promise.

### One at a time: for...of

```javascript
for (const id of ids) {
  await saveItem(id);
}
console.log("done");      // prints after all items are saved
```

### All at once: map + Promise.all

```javascript
await Promise.all(ids.map((id) => saveItem(id)));
console.log("done");
```

### A few at a time

Starting 10,000 requests together can overload a server. Process in batches:

```javascript
async function inBatches(items, size, task) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    results.push(...(await Promise.all(batch.map(task))));
  }
  return results;
}

await inBatches(ids, 5, saveItem);     // 5 at a time
```

## Common mistakes

### Forgetting await

```javascript
const user = getUser();           // a Promise, not a user
console.log(user.name);           // undefined
```

### Awaiting in sequence when you do not need to

See the parallel section above.

### Wrapping a promise in a new Promise for no reason

```javascript
// Unnecessary
function load() {
  return new Promise((resolve, reject) => {
    fetch("/api").then(resolve).catch(reject);
  });
}

// Enough
function load() {
  return fetch("/api");
}
```

### Returning without await inside try

```javascript
async function load() {
  try {
    return fetchData();          // a rejection here is NOT caught by this try
  } catch (error) {
    return null;
  }
}
```

Write `return await fetchData();` if you want the `catch` to handle the error.

### Swallowing errors

```javascript
try {
  await save();
} catch (error) {}               // the error disappears. At least log it.
```

## Top-level await

In ES modules you can use `await` outside any function.

```javascript
// config.mjs
const response = await fetch("/config.json");
export const config = await response.json();
```

In older scripts, wrap the code in an async function:

```javascript
(async () => {
  const data = await load();
})();
```

## Turning callback code into promises

```javascript
import { promisify } from "node:util";
import fs from "node:fs";

const readFile = promisify(fs.readFile);
const text = await readFile("notes.txt", "utf8");
```

Node.js also ships promise versions of most modules, such as `node:fs/promises`.

## Cancelling a request

Promises cannot be cancelled directly. Use an `AbortController`.

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("/api/data", { signal: controller.signal });
} catch (error) {
  if (error.name === "AbortError") console.log("Request cancelled");
  else throw error;
}
```

## A complete example

```javascript
async function getWeatherReport(cities) {
  const requests = cities.map(async (city) => {
    const response = await fetch(`https://api.example.com/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error(`${city}: status ${response.status}`);
    const data = await response.json();
    return { city, temperature: data.temperature };
  });

  const results = await Promise.allSettled(requests);

  return {
    ok: results.filter((r) => r.status === "fulfilled").map((r) => r.value),
    failed: results.filter((r) => r.status === "rejected").map((r) => r.reason.message),
  };
}
```

All cities are requested in parallel, one failure does not stop the others, and the caller gets both lists.

The same ideas exist in Python, where generators and `async` are closely related. See [what `yield` does in Python](/blogs/python-yield-explained).

## FAQ

### What is async await in JavaScript?

It is syntax for working with promises. `async` makes a function return a promise, and `await` pauses that function until a promise finishes, so the code reads from top to bottom.

### What is the difference between async await and promises?

They are the same mechanism. `async` and `await` are a more readable way to write promise code that would otherwise use `.then()` and `.catch()`.

### Why does await not work inside forEach?

`forEach` does not wait for the promise returned by its callback. Use a `for...of` loop to run items one by one, or `Promise.all` with `map` to run them in parallel.

### Does await block the main thread?

No. It pauses only the async function it is in. Other code, events, and rendering continue to run.
