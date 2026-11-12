---
title: TypeScript Interface vs Type: Differences and When to Use Each
description: Interfaces and type aliases both describe shapes in TypeScript. Learn the real differences, with examples, and a simple rule for choosing.
tags: TypeScript, Types, Best Practices
keywords: typescript interface vs type, interfaces vs types in typescript, type vs interface, when to use interface typescript, typescript type alias
cover: versus file-type shapes
---

In TypeScript, both `interface` and `type` can describe the shape of an object, and for most everyday code they are interchangeable. The practical differences are: **only `type`** can describe unions, tuples, primitives, and computed types. **Only `interface`** supports declaration merging, and it extends other types with `extends`. A simple rule: **use `interface` for object shapes and `type` for everything else.** Then be consistent across the project.

## The same thing, two ways

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

type User = {
  id: number;
  name: string;
  email?: string;
};
```

Both describe an object with the same fields. Functions, classes, and variables can use either one.

```typescript
function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

## Quick comparison

| Feature | `interface` | `type` |
|---|---|---|
| Object shapes | Yes | Yes |
| Function types | Yes | Yes |
| Extend another shape | `extends` | `&` (intersection) |
| A class can implement it | Yes | Yes, for object types |
| Union types | No | Yes |
| Tuples | No (not directly) | Yes |
| Alias for a primitive | No | Yes |
| Mapped and conditional types | No | Yes |
| Declaration merging | Yes | No |
| Error messages | Usually show the interface name | Sometimes show the expanded shape |

## What only `type` can do

### Union types

```typescript
type Status = "idle" | "loading" | "success" | "error";
type Id = string | number;

type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };
```

Unions are among the most useful features in TypeScript. This last pattern is a **discriminated union**: the `ok` field tells TypeScript which fields exist.

```typescript
function handle(result: Result) {
  if (result.ok) {
    console.log(result.data);      // TypeScript knows "data" exists here
  } else {
    console.log(result.error);     // and "error" exists here
  }
}
```

### Tuples and primitives

```typescript
type Point = [x: number, y: number];
type Name = string;
type Callback = (value: number) => void;
```

### Mapped, conditional, and template types

```typescript
type User = { id: number; name: string; email: string };

type ReadonlyUser = { readonly [K in keyof User]: User[K] };      // mapped type
type UserKeys = keyof User;                                        // "id" | "name" | "email"
type NameOrEmail = Pick<User, "name" | "email">;
type NonNull<T> = T extends null | undefined ? never : T;          // conditional type
type EventName = `on${Capitalize<UserKeys>}`;                      // "onId" | "onName" | "onEmail"
```

### Types taken from values

```typescript
const config = { port: 3000, host: "localhost" };
type Config = typeof config;               // { port: number; host: string }

const roles = ["admin", "editor", "viewer"] as const;
type Role = (typeof roles)[number];        // "admin" | "editor" | "viewer"
```

## What only `interface` can do

### Declaration merging

If you declare an interface with the same name twice, TypeScript combines them.

```typescript
interface Window {
  analytics: { track(event: string): void };
}

window.analytics.track("page_view");     // OK: added to the built-in Window type
```

This is how you add a property to a global object or to a library's types. A second `type` with the same name is an error.

Merging is helpful for extending library types and can cause surprises if you reuse a name by accident.

## Extending

### interface with extends

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

### type with intersection

```typescript
type Animal = { name: string };
type Dog = Animal & { breed: string };
```

They can also be mixed: an interface can extend a type alias of an object, and a type can intersect an interface.

### A difference in conflicts

With `extends`, a conflicting property is reported as an error right away:

```typescript
interface A { id: number }
interface B extends A { id: string }      // Error: types of 'id' are incompatible
```

With `&`, there is no error at the definition. The property becomes `never`, which means no value fits:

```typescript
type A = { id: number };
type B = A & { id: string };              // no error here
const b: B = { id: 1 };                   // Error only when you try to use it
```

`extends` catches the mistake earlier, which is one reason to prefer interfaces for object hierarchies.

### Performance

In very large codebases, the TypeScript team has noted that `interface extends` is checked faster than large intersections, because interfaces are cached by name. For normal projects you will not notice.

## Classes

A class can implement either one, as long as it is an object shape.

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}
```

A class cannot implement a union type.

## Function types

```typescript
type Add = (a: number, b: number) => number;

interface AddFn {
  (a: number, b: number): number;
}
```

The `type` form is shorter and more common for functions.

## A subtle difference: index signatures

A type alias for an object can be passed where a general record is expected. An interface cannot, because it could be extended later by merging.

```typescript
type TypeUser = { name: string };
interface InterfaceUser { name: string }

function logAll(record: Record<string, unknown>) {}

const a: TypeUser = { name: "Asha" };
const b: InterfaceUser = { name: "Ben" };

logAll(a);      // OK
logAll(b);      // Error: index signature is missing in type 'InterfaceUser'
```

If you meet this error, switching to `type` or spreading the object (`{ ...b }`) fixes it.

## Which should you use?

There are two reasonable team rules. Pick one.

**Rule A (the TypeScript handbook's suggestion):** use `interface` for object shapes until you need a feature that only `type` has.

**Rule B:** use `type` for everything, and `interface` only when you need merging.

Both work. What matters is consistency, which a linter rule can enforce.

A practical split that many projects use:

| Use case | Choice |
|---|---|
| Shape of an object or a class contract | `interface` |
| Props of a React component | Either. Follow the project's convention |
| Public API of a library that users may extend | `interface` |
| Union of values or shapes | `type` |
| Function signature | `type` |
| Tuple | `type` |
| Derived or computed type | `type` |
| Adding to a global or library type | `interface` |

## Examples from real code

```typescript
// API response as a discriminated union: type
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// Entity: interface
interface Product {
  id: string;
  title: string;
  price: number;
}

// Derived types: type
type NewProduct = Omit<Product, "id">;
type ProductUpdate = Partial<NewProduct>;

// Function: type
type Fetcher<T> = (url: string) => Promise<ApiResponse<T>>;

// React props: either
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}
```

## Common mistakes

- **Trying to write a union with an interface.** Use `type`.
- **Reusing an interface name by accident** and getting a merged type you did not expect.
- **Deep intersections that produce `never`** because two types disagree on a property.
- **Spending time on the choice.** For a plain object shape, both are correct.
- **Prefixing interfaces with `I`** (such as `IUser`). This habit comes from other languages and is not the TypeScript convention.

If you are still deciding whether to use TypeScript at all, see [JavaScript vs TypeScript](/blogs/javascript-vs-typescript). For how these types are used in component props, see [React vs Next.js](/blogs/react-vs-nextjs).

## FAQ

### What is the difference between interface and type in TypeScript?

Both can describe object shapes. A `type` can also describe unions, tuples, primitives, and computed types. An `interface` can be declared more than once and merged, and it uses `extends` for inheritance.

### Should I use interface or type?

Use `interface` for object shapes and `type` for unions, functions, tuples, and derived types. If your team already has a convention, follow it.

### Can a type extend an interface?

Yes, with an intersection: `type B = A & { extra: string }`. An interface can also extend an object type alias with `extends`.

### Is interface faster than type in TypeScript?

Only at compile time in very large projects, where `interface extends` can be checked faster than big intersections. It makes no difference to the running program.
