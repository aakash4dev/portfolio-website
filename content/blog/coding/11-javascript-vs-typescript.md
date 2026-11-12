---
title: JavaScript vs TypeScript: Differences and Which to Learn
description: TypeScript is JavaScript with types that catch bugs before the code runs. Compare both, see real examples, and decide which to learn first.
tags: JavaScript, TypeScript, Comparison
keywords: javascript vs typescript, typescript vs javascript, typescript vs javascript which is better, difference between javascript and typescript, should i learn typescript
cover: versus braces shield-check
---

**TypeScript is JavaScript with a type system added.** You write the same code and add notes about what kind of value each variable, parameter, and return value should be. A compiler checks those notes and reports mistakes **before the code runs**, then removes the types and outputs plain JavaScript. Learn JavaScript basics first, then move to TypeScript. For any project that will grow or involve more than one person, TypeScript is the standard choice today.

## Quick comparison

| | JavaScript | TypeScript |
|---|---|---|
| Created | 1995, by Brendan Eich | 2012, by Microsoft |
| Types | Dynamic: checked while running | Static: checked before running |
| Runs in browsers | Directly | After being converted to JavaScript |
| Errors found | When the line runs | In the editor, while typing |
| Setup | None | A compiler or build tool |
| Editor help | Limited | Strong autocomplete and safe refactoring |
| Learning curve | Lower | A little higher |
| File extension | `.js` | `.ts`, `.tsx` |

Every valid JavaScript program is also valid TypeScript. TypeScript is a **superset**.

## The problem TypeScript solves

JavaScript lets this run:

```javascript
function totalPrice(price, quantity) {
  return price * quantity;
}

totalPrice("10", 2);        // 20 - works by accident
totalPrice("ten", 2);       // NaN - silently wrong
totalPrice(10);             // NaN - forgot an argument

const user = { name: "Asha" };
console.log(user.nmae.toUpperCase());   // crashes at runtime: typo in "name"
```

Nothing warns you. You find out when a user reaches that line.

The same code in TypeScript:

```typescript
function totalPrice(price: number, quantity: number): number {
  return price * quantity;
}

totalPrice("ten", 2);   // Error: Argument of type 'string' is not assignable to parameter of type 'number'
totalPrice(10);         // Error: Expected 2 arguments, but got 1

const user = { name: "Asha" };
console.log(user.nmae.toUpperCase());   // Error: Property 'nmae' does not exist. Did you mean 'name'?
```

All three mistakes are underlined in the editor before you run anything.

## TypeScript basics in five minutes

### Basic types

```typescript
let age: number = 30;
let userName: string = "Asha";
let active: boolean = true;
let tags: string[] = ["a", "b"];
let point: [number, number] = [10, 20];        // tuple
```

### Type inference

You rarely need to write the type. TypeScript works it out.

```typescript
let count = 5;            // inferred as number
count = "five";           // Error
```

### Object shapes

```typescript
interface User {
  id: number;
  name: string;
  email?: string;          // optional
}

function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

For the choice between `interface` and `type`, see [interface vs type in TypeScript](/blogs/typescript-interface-vs-type).

### Union types

A value that can be one of several types.

```typescript
type Status = "loading" | "success" | "error";

function show(status: Status) {
  if (status === "loading") return "Please wait";
  if (status === "success") return "Done";
  return "Something went wrong";
}

show("sucess");   // Error: typo caught
```

### null safety

With strict mode, TypeScript forces you to handle missing values.

```typescript
function findUser(id: number): User | undefined { /* ... */ }

const user = findUser(1);
console.log(user.name);        // Error: 'user' is possibly 'undefined'
console.log(user?.name);       // OK
if (user) console.log(user.name);   // OK
```

This one feature prevents the most common JavaScript crash: "Cannot read properties of undefined".

### Generics

Write one function that works for many types and keeps them connected.

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);        // number | undefined
const s = first(["a", "b"]);       // string | undefined
```

## Types exist only before the code runs

TypeScript types are removed when the code is compiled. They do **not** check anything while the program runs.

```typescript
interface Product { id: number; price: number }

const response = await fetch("/api/product/1");
const product: Product = await response.json();   // TypeScript trusts you here
```

If the server sends `{ "id": "abc" }`, TypeScript cannot know. For data from outside your program, such as APIs, forms, and files, check it at runtime with a validation library such as Zod:

```typescript
import { z } from "zod";

const ProductSchema = z.object({ id: z.number(), price: z.number() });
type Product = z.infer<typeof ProductSchema>;

const product = ProductSchema.parse(await response.json());   // throws if the shape is wrong
```

## The benefits

- **Fewer bugs reach users.** Typos, wrong arguments, and missing null checks are caught early.
- **Better editor support.** Accurate autocomplete, go to definition, and rename across the whole project.
- **Safer changes.** Change a function's parameters and the compiler lists every place that must be updated.
- **Types work as documentation.** You see what a function expects without reading its body.
- **Easier teamwork** on large codebases.

## The costs

- **Setup.** You need a compiler or a build tool. Modern tools such as Vite, Next.js, Bun, and Deno make this nearly automatic, and recent Node.js versions can run many TypeScript files directly.
- **More to learn.** Generics and advanced types take time.
- **More code to write.** Mostly for function parameters and data shapes.
- **Type puzzles.** Some library types are complex and produce long error messages.
- **A false sense of safety** if you use `any` everywhere or forget that outside data is unchecked.

## How to run TypeScript

```bash
npm install --save-dev typescript
npx tsc --init          # creates tsconfig.json
npx tsc                 # compiles .ts files to .js
```

A sensible `tsconfig.json` start:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**Turn on `strict`.** Without it, much of the benefit is lost.

## any vs unknown

- `any` switches type checking off for that value. Avoid it.
- `unknown` means "I do not know the type yet", and forces you to check before using it.

```typescript
function handle(input: unknown) {
  if (typeof input === "string") {
    console.log(input.toUpperCase());   // OK: checked first
  }
}
```

## Which should you learn first?

**Complete beginner:** start with JavaScript. Learn variables, functions, arrays, objects, and async code for a few weeks. See [how to learn coding](/blogs/how-to-learn-coding). Adding type syntax on day one is extra load.

**You know JavaScript basics:** move to TypeScript now. It will show you gaps in your JavaScript understanding and teach better habits.

**You come from Java, C#, Go, or Rust:** start with TypeScript directly. Static types will feel natural.

**For jobs:** most front-end and Node.js roles now expect TypeScript. React, Next.js, Angular, and NestJS projects use it by default.

## When plain JavaScript is fine

- Small scripts and quick experiments
- Tiny websites with a few lines of interaction
- Learning the basics
- Projects where a build step is not possible

You can also get some checking in plain JavaScript with JSDoc comments and `// @ts-check` at the top of a file.

## Moving a JavaScript project to TypeScript

You do not have to convert everything at once.

1. Add TypeScript and a `tsconfig.json` with `"allowJs": true`.
2. Rename files from `.js` to `.ts` one at a time, starting with small utility files.
3. Fix the errors in each file. Use `unknown` and narrow it, not `any`.
4. Install type packages for libraries that need them, such as `@types/node`.
5. Turn on `strict` when most files are converted.

## Common mistakes

- **Using `any` to silence errors.** The error usually points to a real problem.
- **Using `as` to force a type.** A type assertion tells the compiler to trust you. It checks nothing.
- **Trusting API data without validation.**
- **Writing types that TypeScript can infer.** Annotate function parameters and public return types, and let inference do the rest.
- **Ignoring `strict` mode.**

For the JavaScript ideas that TypeScript builds on, see [closures](/blogs/javascript-closures-explained) and [async and await](/blogs/javascript-async-await).

## FAQ

### Is TypeScript better than JavaScript?

For medium and large projects, yes for most teams: it catches errors early and makes code easier to change. For small scripts, plain JavaScript is simpler.

### Can browsers run TypeScript?

Not directly. TypeScript is converted to JavaScript first. The types are removed in that step.

### Is TypeScript hard to learn?

If you know JavaScript, the basics take a few days. Advanced features such as generics and conditional types take longer and are not needed at the start.

### Does TypeScript make code slower?

No. The types are removed before the code runs, so the running program is normal JavaScript with the same speed.
