# Zod-Guardians

> Bring strict types to runtime! Define complex function signatures and overloads with full Zod validation and TypeScript inference.

---

[![NPM version](https://img.shields.io/npm/v/zod-guardians.svg?logo=npm&logoColor=red&color=red&label=NPM)](https://www.npmjs.com/package/zod-guardians)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?logo=github)](https://opensource.org/licenses/MIT)

## Motivation

In JavaScript, strictly checking types at runtime is complicated — especially in cases where the check must be deep, rather than shallow.

The `zod-guardians` package solves this by providing constructors that link directly to predefined `zod` schemas, check the validity of the arguments, and call the function immediately afterward, eliminating manual validation boilerplate.

## Installation

```bash
# npm
npm install zod-guardians

# bun
bun add zod-guardians

# yarn
yarn add zod-guardians

# pnpm
pnpm add zod-guardians
```

## Usage

### Basic Usage

Create a function by defining a tuple of Zod schemas for the arguments and an implementation callback. The `compile()` method returns a native function ready to use.

```ts
import { ZodFunction } from "zod-guardians";

const greet = ZodFunction.create(
    (z) => [z.string(), z.number()],
    (name, age) => {
        return `Hello, ${name}! You are ${age} years old.`;
    },
).compile();

console.log(greet("Robot", 10e2)); // Output: Hello, Robot! You are 1000 years old.

// Throws ArgumentsError if types do not match
greet(1000, "Robot");
```

### Full Type Inference

`zod-guardians` leverages TypeScript's advanced type system to infer everything. You do not need to manually type the arguments in your callback or the resulting function.

```ts
import { ZodFunction } from "zod-guardians";

const calculate = ZodFunction.create(
    (z) => [z.object({ value: z.number() }), z.boolean()],
    (obj, active) => {
        // TypeScript knows:
        // 'obj' is { value: number }
        // 'active' is boolean
        return active ? obj.value * 2 : 0;
    },
).compile();

// The compiled function preserves the signature:
// calculate: (obj: { value: number }, active: boolean) => number
```

### Rest Parameters (Variadic Functions)

You can define variadic functions (functions that accept infinite arguments) by wrapping the **last** schema in a tuple (e.g., `[z.number()]`). This tells the library to treat it as a Rest Parameter (`...args`).

```ts
import { ZodFunction } from "zod-guardians";

const sumAll = ZodFunction.create(
    (z) => [z.string(), [z.number()]], // The last element is wrapped in []
    (label, ...numbers) => {
        // 'numbers' is inferred as number[]
        const total = numbers.reduce((a, b) => a + b, 0);
        return `${label}: ${total}`;
    },
).compile();

console.log(sumAll("Total", 1, 2, 3, 4)); // Output: Total: 10
```

### Function Overloading

Define multiple signatures for a single function. The library will attempt to match the arguments against each registered overload in order, executing the first match.

```ts
import { ZodOverloadedFunction } from "zod-guardians";

const formatter = ZodOverloadedFunction.create()
    // Signature 1: Date object
    .overload(
        (z) => [z.date()],
        (date) => date.toISOString()
    )
    // Signature 2: Timestamp (number)
    .overload(
        (z) => [z.number()],
        (timestamp) => new Date(timestamp).toISOString()
    )
    .compile();

console.log(formatter(new Date())); // Uses Signature 1
console.log(formatter(17e11)); // Uses Signature 2
```

### Dynamic Execution (Without Compilation)

If you need to control the `this` context or avoid abstraction, use the `apply` method directly on the instance.

```ts
import { ZodFunction } from "zod-guardians";

const contextual = ZodFunction.create(
    (z) => [z.number()],
    function (this: { base: number }, multiplier) {
        // 'this' context usage
        return this.base * multiplier;
    }
);

const context = { base: 10 };

// Pass arguments as an array to .apply
const result = contextual.apply([5], context); // Result: 50
```

## API Reference

### `ZodFunction`

A wrapper for creating functions with strict runtime validation and full TypeScript inference.

#### Static Methods

* **`create(schemas, implementation)`**
    Creates a new builder instance.
  * `args`: A tuple of Zod schemas OR a callback returning a tuple (e.g., `(z) => [z.string()]`).
    * **Standard arguments**: `[z.string(), z.number()]`
    * **Rest parameters**: Wrap the last element in an array: `[z.string(), [z.number()]]`
  * `fun`: The function callback. Arguments types are inferred automatically from the schemas.

#### Instance Methods

* **`compile()`**
    Wraps the validation logic and the implementation into a single function. This is the standard way to finalize the creation.
* **`apply(args, thisArg)`**
    Executes the function immediately without compiling. Useful for dynamic execution or manual `this` context binding.
  * `args`: An array containing the arguments to validate.

---

### `ZodOverloadedFunction`

A builder for creating functions that support multiple signatures (overloads).

#### Static Methods

* **`create()`**
    Initializes a new empty overloaded function builder.

#### Instance Methods

* **`overload(args, fun)`**
    Registers a new signature to the function.
  * **Order matters**: When the function is called, it attempts to match arguments against signatures in the order they were defined.
  * Returns a new instance with the added overload (chainable).
* **`compile()`**
    Returns a function that dispatches calls to the correct implementation based on runtime validation.

---

### `ZodArguments`

A utility class for validating lists of arguments directly, without wrapping a function.

#### Static Methods

* **`create(schemas)`**
    Creates a validator instance for a specific schema definition.

#### Instance Methods

* **`assert(args)`**
    Validates a list of arguments against the schemas.
  * Returns the transformed/guarded arguments if valid.
  * Throws `ArgumentsError` if validation fails.

---

### Errors

The library exports specific error classes for exception handling.

* **`ArgumentsError`** – Thrown when arguments fail validation against a specific schema.

* **`OverloadsError`** – Thrown when using a `ZodOverloadedFunction` and none of the registered signatures match the provided arguments.
  
  * `cause`: An array of `ArgumentsError`, one for each attempted overload.

## Author's Note

This project marks my debut in publishing npm packages. As I am just getting started, please excuse any mistakes or bugs you might encounter — I am still learning the ropes!

I actively welcome constructive feedback and collaboration. If you are interested in helping maintain or expand this library, your expertise is greatly appreciated.
