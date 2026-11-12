---
title: The JavaScript Event Loop Explained Step by Step
description: Learn how JavaScript runs async code on one thread. Call stack, task queue, microtasks, and why promises run before setTimeout.
tags: JavaScript, Event Loop, Node.js
keywords: javascript event loop, event loop explained, microtask vs macrotask, node js event loop, call stack javascript, settimeout vs promise
cover: hero refresh-cw layers list-ordered timer zap
---

The **event loop** is the mechanism that lets JavaScript, which runs on **one thread**, handle many things without freezing. JavaScript runs one piece of code at a time on the **call stack**. Slow work such as timers and network requests is done outside by the browser or Node.js, and their callbacks wait in **queues**. The event loop repeats one job: when the call stack is empty, take the next callback from a queue and run it.

## The parts

```text
        ┌──────────────┐        ┌──────────────────────────────┐
        │  Call stack  │        │  Web APIs / Node APIs        │
        │ (runs code)  │ -----> │  timers, fetch, files, DOM   │
        └──────▲───────┘        └──────────────┬───────────────┘
               │                               │ when finished
      event loop picks the next                ▼
               │              ┌──────────────────────────────────┐
               ├───────────── │ Microtask queue (promises)       │  <- first
               │              ├──────────────────────────────────┤
               └───────────── │ Task queue (setTimeout, events)  │  <- then
                              └──────────────────────────────────┘
```

### Call stack

Where your code runs. Calling a function puts it on the stack. Returning takes it off. JavaScript can do **one thing at a time** here.

### Web APIs (or Node APIs)

Features provided by the environment, not by the JavaScript language: `setTimeout`, `fetch`, file reading, DOM events. They do the waiting in the background.

### Task queue

Also called the macrotask or callback queue. It holds callbacks from `setTimeout`, `setInterval`, user events such as clicks, and I/O.

### Microtask queue

A higher-priority queue. It holds promise callbacks (`.then`, `.catch`, `.finally`), the code after an `await`, and `queueMicrotask`.

## The algorithm

1. Run the current code until the call stack is empty.
2. Run **all** microtasks, including any new ones added while doing so.
3. In a browser, update the screen if needed.
4. Take **one** task from the task queue and run it.
5. Go back to step 2.

The key rule: **every microtask runs before the next task.**

## The classic example

```javascript
console.log("1: start");

setTimeout(() => console.log("2: timeout"), 0);

Promise.resolve().then(() => console.log("3: promise"));

console.log("4: end");
```

Output:

```text
1: start
4: end
3: promise
2: timeout
```

Step by step:

1. `console.log("1: start")` runs.
2. `setTimeout` hands its callback to the timer API. With 0 ms, the callback goes to the **task queue** almost at once.
3. The promise is already resolved, so its `.then` callback goes to the **microtask queue**.
4. `console.log("4: end")` runs. The stack is now empty.
5. The event loop runs all microtasks: "3: promise".
6. The event loop takes one task: "2: timeout".

`setTimeout(fn, 0)` does not mean "now". It means "as soon as possible, after the current code and all microtasks".

## A harder example

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);

setTimeout(() => console.log("D"), 0);

Promise.resolve()
  .then(() => console.log("E"))
  .then(() => console.log("F"));

console.log("G");
```

Output: `A G E F B C D`

- **A, G:** synchronous code runs first.
- **E, F:** microtasks. F is added when E finishes, and it still runs before any task.
- **B:** the first task.
- **C:** a microtask created during B. It runs before the next task.
- **D:** the second task.

## async and await in the event loop

Code **before** the first `await` runs at once. Code **after** an `await` is scheduled as a microtask.

```javascript
async function run() {
  console.log("1");
  await null;
  console.log("3");        // continues as a microtask
}

run();
console.log("2");
// 1, 2, 3
```

More on this syntax is in [async and await in JavaScript](/blogs/javascript-async-await).

## Blocking the event loop

Because there is one thread, a long calculation stops everything else: clicks, scrolling, timers, and other requests.

```javascript
button.addEventListener("click", () => {
  const end = Date.now() + 5000;
  while (Date.now() < end) {}        // the page is frozen for 5 seconds
});
```

A timer is also only a **minimum** delay:

```javascript
const start = Date.now();
setTimeout(() => console.log(`Ran after ${Date.now() - start} ms`), 100);

while (Date.now() - start < 2000) {}   // block for 2 seconds
// Prints about 2000 ms, not 100
```

The callback was ready after 100 ms and had to wait until the stack was empty.

### How to avoid blocking

**1. Split the work into chunks** and give control back between them:

```javascript
async function processAll(items) {
  for (let i = 0; i < items.length; i++) {
    heavyWork(items[i]);
    if (i % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));   // let other tasks run
    }
  }
}
```

**2. Move heavy work to another thread** with a Web Worker in the browser or `worker_threads` in Node.js:

```javascript
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ numbers: bigArray });
worker.onmessage = (event) => console.log("Result:", event.data);

// worker.js
onmessage = (event) => {
  const sum = event.data.numbers.reduce((a, b) => a + b, 0);
  postMessage(sum);
};
```

**3. Use asynchronous versions of APIs.** In Node.js, prefer `fs.promises.readFile` to `fs.readFileSync` in a server.

## Microtasks can starve the loop

Since all microtasks run before the next task, a microtask that keeps adding another microtask blocks tasks and screen updates forever.

```javascript
function loop() {
  Promise.resolve().then(loop);     // never lets a task or a repaint happen
}
loop();
```

The same loop with `setTimeout(loop, 0)` would not freeze the page, because other tasks can run between calls.

## Rendering in the browser

The browser repaints the screen between tasks, about 60 times a second when it can. For animation, use `requestAnimationFrame`, which runs your callback right before the next repaint:

```javascript
function animate() {
  box.style.left = `${position++}px`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

It is smoother than `setTimeout` and pauses when the tab is hidden.

## The Node.js event loop

Node.js uses the same idea with more phases, provided by a library called **libuv**:

1. **Timers:** `setTimeout` and `setInterval` callbacks.
2. **Pending callbacks:** some system operations.
3. **Poll:** new I/O events such as incoming data. The loop waits here when it has nothing else to do.
4. **Check:** `setImmediate` callbacks.
5. **Close callbacks:** such as a closed socket.

Between callbacks, Node.js runs the microtask queues: first `process.nextTick`, then promise callbacks.

```javascript
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
console.log("sync");
```

Output:

```text
sync
nextTick
promise
timeout
immediate
```

The order of `timeout` and `immediate` can swap when they are scheduled from the main module. Inside an I/O callback, `immediate` always comes first.

### How one thread serves thousands of requests

Node.js does not create a thread per request. It starts an operation such as a database query, registers a callback, and moves on to the next request. The operating system and a small thread pool do the waiting. That is efficient for I/O-heavy work and poor for CPU-heavy work, where one slow calculation delays every user.

## Priority summary

| Order | What runs | Examples |
|---|---|---|
| 1 | Synchronous code | Everything in the current script or function |
| 2 | `process.nextTick` (Node.js only) | |
| 3 | Microtasks | `.then`, code after `await`, `queueMicrotask`, `MutationObserver` |
| 4 | Rendering (browser) | Style, layout, paint, `requestAnimationFrame` |
| 5 | One task | `setTimeout`, `setInterval`, events, I/O, `setImmediate` |

## Is JavaScript single-threaded?

Your JavaScript code runs on one thread per context. The environment around it uses more threads for networking, timers, file access, and rendering. Workers give you additional threads, each with its own event loop, that communicate by messages.

## Common misunderstandings

- **"`setTimeout(fn, 0)` runs immediately."** It runs after the current code and all microtasks.
- **"Promises make code run in parallel."** They do not. They organize waiting. Only one piece of JavaScript runs at a time.
- **"`async` moves work to another thread."** It does not. A heavy loop inside an `async` function still blocks.
- **"Timers are exact."** The delay is a minimum.

This topic depends on functions remembering their surroundings. See [JavaScript closures explained](/blogs/javascript-closures-explained).

## FAQ

### What is the event loop in JavaScript?

It is the process that runs queued callbacks when the call stack is empty, which lets single-threaded JavaScript handle asynchronous work.

### What is the difference between a microtask and a macrotask?

Microtasks are promise callbacks and run right after the current code, before anything else. Macrotasks, also called tasks, come from timers, events, and I/O, and run one at a time after all microtasks are done.

### Why does a promise run before setTimeout?

Promise callbacks go to the microtask queue, which is emptied completely before the event loop takes the next task. `setTimeout` callbacks are tasks.

### Is Node.js single-threaded?

Your JavaScript runs on one thread, with an event loop. Node.js uses additional threads in the background for file access and other operations, and you can create worker threads for heavy calculations.
