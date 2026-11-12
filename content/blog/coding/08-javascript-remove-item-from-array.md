---
title: How to Remove an Item From an Array in JavaScript (All Ways)
description: Remove an array item by value, by index, or by condition. Compare filter, splice, toSpliced, pop, and shift, with the right choice for each case.
tags: JavaScript, Arrays, How-To
keywords: javascript remove item from array, remove element from array javascript, array splice, array filter remove, remove object from array javascript
cover: code JS list-x
---

To remove an item from a JavaScript array **without changing the original**, use `filter`: `const result = items.filter((item) => item !== value)`. To remove an item **in place by index**, use `splice`: `items.splice(index, 1)`. Which one you choose depends on two questions: do you know the value or the index, and may you change the original array?

## Quick answer table

| Goal | Code | Changes original? |
|---|---|---|
| Remove by value (all matches) | `arr.filter((x) => x !== value)` | No |
| Remove by index | `arr.toSpliced(index, 1)` | No |
| Remove by index, in place | `arr.splice(index, 1)` | Yes |
| Remove first match by value, in place | `arr.splice(arr.indexOf(value), 1)` after checking the index | Yes |
| Remove by condition | `arr.filter((x) => !condition(x))` | No |
| Remove last item | `arr.pop()` | Yes |
| Remove first item | `arr.shift()` | Yes |
| Remove duplicates | `[...new Set(arr)]` | No |

## Remove by value

### filter: the safe default

```javascript
const fruits = ["apple", "banana", "cherry", "banana"];

const withoutBanana = fruits.filter((fruit) => fruit !== "banana");

console.log(withoutBanana);   // ["apple", "cherry"]
console.log(fruits);          // unchanged
```

`filter` returns a **new array** with every item for which the function returns `true`. It removes **all** matches.

### indexOf + splice: remove the first match, in place

```javascript
const fruits = ["apple", "banana", "cherry", "banana"];

const index = fruits.indexOf("banana");
if (index !== -1) {
  fruits.splice(index, 1);
}

console.log(fruits);   // ["apple", "cherry", "banana"]
```

**Always check for `-1`.** If the value is not found, `indexOf` returns `-1`, and `splice(-1, 1)` removes the **last** item. This is a very common bug.

## Remove by index

### splice: in place

```javascript
const letters = ["a", "b", "c", "d"];

const removed = letters.splice(1, 1);   // start at index 1, remove 1 item

console.log(letters);   // ["a", "c", "d"]
console.log(removed);   // ["b"]
```

`splice(start, deleteCount)` changes the array and returns the removed items as an array.

```javascript
letters.splice(1, 2);        // remove 2 items starting at index 1
letters.splice(-1, 1);       // remove the last item
letters.splice(2);           // remove everything from index 2 to the end
letters.splice(1, 1, "X");   // replace the item at index 1 with "X"
```

### toSpliced: the same, without changing the original

```javascript
const letters = ["a", "b", "c", "d"];

const result = letters.toSpliced(1, 1);

console.log(result);    // ["a", "c", "d"]
console.log(letters);   // ["a", "b", "c", "d"]
```

`toSpliced` was added in ES2023 and works in all current browsers and in Node.js 20 and later.

### For older environments: slice

```javascript
const index = 1;
const result = [...letters.slice(0, index), ...letters.slice(index + 1)];
```

### filter with the index

```javascript
const result = letters.filter((_, i) => i !== 1);
```

## Remove objects from an array

Objects are compared by reference, so `indexOf` and `!==` on the object itself usually do not do what you want. Compare a property.

```javascript
const users = [
  { id: 1, name: "Asha" },
  { id: 2, name: "Ben" },
  { id: 3, name: "Chen" },
];

// New array without user 2
const remaining = users.filter((user) => user.id !== 2);

// In place
const index = users.findIndex((user) => user.id === 2);
if (index !== -1) users.splice(index, 1);
```

## Remove by condition

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const odds = numbers.filter((n) => n % 2 !== 0);   // [1, 3, 5]
```

Remove empty and "falsy" values:

```javascript
const messy = [0, "a", "", null, "b", undefined, false, 3];

const clean = messy.filter(Boolean);              // ["a", "b", 3]
const noNulls = messy.filter((x) => x != null);   // removes only null and undefined
```

`filter(Boolean)` also removes `0`, `""`, and `false`. Use the second form if those are valid values.

## Remove the first or last item

```javascript
const queue = [1, 2, 3, 4];

const last = queue.pop();      // 4. queue is now [1, 2, 3]
const first = queue.shift();   // 1. queue is now [2, 3]
```

Without changing the original:

```javascript
const withoutLast = queue.slice(0, -1);
const withoutFirst = queue.slice(1);
```

`shift` on a very large array is slow, because every remaining item moves one place.

## Remove several values at once

```javascript
const items = ["a", "b", "c", "d", "e"];
const toRemove = new Set(["b", "d"]);

const result = items.filter((item) => !toRemove.has(item));   // ["a", "c", "e"]
```

A `Set` lookup is fast. Using `array.includes` inside `filter` works too and gets slow when both lists are large.

## Remove duplicates

```javascript
const numbers = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(numbers)];   // [1, 2, 3]
```

For objects, keep the first one for each key:

```javascript
const seen = new Set();
const uniqueUsers = users.filter((user) => {
  if (seen.has(user.id)) return false;
  seen.add(user.id);
  return true;
});
```

## Do not use delete

```javascript
const arr = ["a", "b", "c"];
delete arr[1];

console.log(arr);          // ["a", empty, "c"]
console.log(arr.length);   // 3 - the length did not change
```

`delete` leaves a hole. The item is gone and its slot stays. Use `splice` or `filter`.

## Removing while looping

Removing items inside a forward loop skips items, because everything after the removed item moves down.

```javascript
const nums = [1, 2, 2, 3];

// BUG: the second 2 is skipped
for (let i = 0; i < nums.length; i++) {
  if (nums[i] === 2) nums.splice(i, 1);
}
console.log(nums);   // [1, 2, 3]
```

**Fix 1: loop backwards.**

```javascript
for (let i = nums.length - 1; i >= 0; i--) {
  if (nums[i] === 2) nums.splice(i, 1);
}
```

**Fix 2, simpler: use `filter`.**

```javascript
const result = nums.filter((n) => n !== 2);
```

## Mutating or not: which should you pick?

**Do not change the original (`filter`, `toSpliced`, `slice`) when:**

- You use React, Redux, or another library that detects changes by comparing references. Changing state in place means the screen does not update.

```javascript
// Wrong in React: mutates state
todos.splice(index, 1);
setTodos(todos);

// Right: a new array
setTodos(todos.filter((todo) => todo.id !== id));
```

- Other code holds a reference to the same array.
- You want code that is easier to reason about and test.

**Change in place (`splice`, `pop`, `shift`) when:**

- The array is local to your function.
- The array is very large and you remove items often, so copying would cost too much.

## Clear an array

```javascript
arr.length = 0;      // empties the same array (other references see it empty too)
arr = [];            // points the variable to a new empty array (needs let)
```

## Performance in brief

- `filter` and `toSpliced` copy the array: time grows with its length.
- `splice` in the middle must shift the items after it: also grows with length.
- `pop` is constant time.
- For a few thousand items, the difference is not noticeable. Choose the clearest code.
- If you add and remove by key all the time, a `Map` or `Set` is a better structure than an array. See [data structures explained](/blogs/data-structures-explained).

## A reusable helper

```javascript
/** Returns a new array without the first item that matches. */
function removeFirst(array, predicate) {
  const index = array.findIndex(predicate);
  return index === -1 ? array : array.toSpliced(index, 1);
}

removeFirst([5, 6, 7, 6], (n) => n === 6);   // [5, 7, 6]
```

For more core JavaScript ideas, see [JavaScript closures explained](/blogs/javascript-closures-explained).

## FAQ

### How do I remove a specific item from an array in JavaScript?

Use `array.filter((item) => item !== value)` to get a new array without it. To change the array in place, find the index with `indexOf`, check that it is not -1, and call `splice(index, 1)`.

### What is the difference between splice and slice?

`splice` changes the original array by removing or inserting items. `slice` returns a copy of part of the array and leaves the original unchanged.

### How do I remove an object from an array by id?

Use `array.filter((item) => item.id !== id)`. To remove in place, use `findIndex` to get the position and then `splice`.

### Does filter change the original array?

No. `filter` always returns a new array and leaves the original as it was.
