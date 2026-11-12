---
title: Solidity memory vs calldata vs storage: When to Use Each
description: Storage is permanent, memory is temporary, calldata is read-only input. Learn the rules, the gas costs, and the copy-or-reference traps.
tags: Solidity, Gas Optimization, Data Locations
keywords: solidity memory vs calldata, calldata vs memory, storage vs memory solidity, when to use calldata, solidity data locations
cover: hero database hard-drive memory-stick file-input fuel
---

In Solidity, **storage** is permanent data saved on the blockchain, **memory** is temporary data that exists only during a function call, and **calldata** is the read-only input data sent with a transaction. Use `calldata` for array, string, and struct parameters of external functions that you only read. Use `memory` when you need to change the data or build new data inside a function. Use `storage` when you want to read or update the contract's saved state.

## The three data locations

| | storage | memory | calldata |
|---|---|---|---|
| Lifetime | Permanent, saved on-chain | One function call | One function call |
| Can be changed | Yes | Yes | No, read-only |
| Gas cost | Very high to write | Low, grows with size | Lowest |
| Used for | State variables | Local variables, return values | Inputs of external calls |

**A way to remember them:**

- **Storage** is the hard drive. It keeps data after the program ends, and writing to it is slow and costly.
- **Memory** is RAM. Fast, and cleared when the function ends.
- **Calldata** is a sealed envelope handed to the function. You can read the letter inside but cannot write on it.

## When you must write a data location

Only for **reference types**: arrays, `string`, `bytes`, structs, and mappings. Value types such as `uint256`, `bool`, and `address` are always copied and need no keyword.

```solidity
function example(
    uint256 amount,              // value type: no location
    string calldata name,        // reference type: location required
    uint256[] memory numbers     // reference type: location required
) external { }
```

## Storage

State variables, declared at contract level, are always in storage.

```solidity
contract Shop {
    struct Item {
        string name;
        uint256 price;
        uint256 stock;
    }

    mapping(uint256 => Item) public items;   // storage
    uint256[] public itemIds;                // storage
}
```

Storage is the most expensive resource in the EVM:

- Writing a new value to an empty slot costs about **20,000 gas**.
- Changing an existing value costs about **5,000 gas**.
- Reading costs **2,100 gas** the first time in a transaction, and **100 gas** after that.

Compare this with a few gas for most arithmetic. Reducing storage writes is the largest gas saving you can make. See [what gas fees are](/blogs/what-is-gas-fee).

## Memory

Memory is a temporary area that is cleared after each external call.

```solidity
function buildList(uint256 size) external pure returns (uint256[] memory) {
    uint256[] memory list = new uint256[](size);   // created in memory
    for (uint256 i = 0; i < size; i++) {
        list[i] = i * 2;
    }
    return list;
}
```

Use it for:

- Data you create inside a function
- Data you need to modify
- Return values of reference types

Memory arrays have a fixed size after creation. You cannot `push` to them.

## Calldata

Calldata is the raw input of a transaction. It is read-only, and the function reads from it directly with no copying.

```solidity
function totalOf(uint256[] calldata values) external pure returns (uint256 total) {
    for (uint256 i = 0; i < values.length; i++) {
        total += values[i];
    }
}
```

### calldata vs memory for parameters

```solidity
// Copies the whole array into memory first: more gas
function sumA(uint256[] memory values) external pure returns (uint256) { ... }

// Reads straight from the input: less gas
function sumB(uint256[] calldata values) external pure returns (uint256) { ... }
```

For a large array the difference is thousands of gas.

**Rule:** if a parameter of reference type is not modified, declare it `calldata`. Use `memory` only if you must change it inside the function. Since Solidity 0.6.9, `calldata` can be used in `public` and `internal` functions as well. See [public vs external](/blogs/solidity-public-vs-external).

## The big trap: copy or reference?

The data location of a **local variable** decides whether you get a copy or a pointer to the original. This is the source of many bugs.

```solidity
contract Shop {
    struct Item { string name; uint256 price; uint256 stock; }
    mapping(uint256 => Item) public items;

    // BUG: changes a copy. Storage is not updated.
    function sellWrong(uint256 id) external {
        Item memory item = items[id];    // copies the struct into memory
        item.stock -= 1;                 // changes only the copy
    }

    // Correct: a storage pointer. Storage is updated.
    function sellRight(uint256 id) external {
        Item storage item = items[id];   // points to the real data
        item.stock -= 1;                 // writes to storage
    }
}
```

Both functions compile and run without error. Only one of them works.

| Assignment | Result |
|---|---|
| storage to a `storage` local variable | Reference: changes affect the state |
| storage to a `memory` local variable | Copy: changes are lost |
| memory to storage (state variable) | Copy: data is written to storage |
| memory to memory | Reference: both names point to the same data |
| calldata to memory | Copy |

## Choosing between a storage pointer and a memory copy

**Use a `storage` pointer when** you update fields, or read only one or two fields of a large struct. It avoids copying everything.

**Use a `memory` copy when** you read many fields several times and do not write. One copy can be cheaper than many separate storage reads.

```solidity
// Reads one field: use a storage pointer
function priceOf(uint256 id) external view returns (uint256) {
    Item storage item = items[id];
    return item.price;
}
```

## Gas optimization: cache storage in a local variable

Every read of a state variable inside a loop costs gas. Read it once.

```solidity
uint256[] public values;

// Expensive: reads values.length from storage on every loop
function sumSlow() external view returns (uint256 total) {
    for (uint256 i = 0; i < values.length; i++) {
        total += values[i];
    }
}

// Cheaper: read the length once
function sumFast() external view returns (uint256 total) {
    uint256 length = values.length;
    for (uint256 i = 0; i < length; i++) {
        total += values[i];
    }
}
```

The same applies to writes. Do the calculation in a local variable and write to storage once at the end:

```solidity
uint256 public total;

function addAll(uint256[] calldata amounts) external {
    uint256 sum = total;                       // one storage read
    for (uint256 i = 0; i < amounts.length; i++) {
        sum += amounts[i];
    }
    total = sum;                               // one storage write
}
```

## Storage packing

Storage is divided into slots of 32 bytes. Small variables declared next to each other share a slot.

```solidity
// Uses 3 slots
struct Loose {
    uint128 a;
    uint256 b;
    uint128 c;
}

// Uses 2 slots: a and c share one
struct Packed {
    uint128 a;
    uint128 c;
    uint256 b;
}
```

Ordering fields from small to large, or grouping the small ones, saves about 20,000 gas each time a new struct is stored.

## Other places data can live

- **Stack.** Local value-type variables live here. It is very cheap and limited to 16 reachable slots, which is the cause of the "stack too deep" compiler error.
- **Transient storage.** Added in 2024, with the `transient` keyword in recent compiler versions. It behaves like storage but is cleared at the end of the transaction, and costs about 100 gas per access. It is useful for reentrancy locks.
- **Events (logs).** Cheap, permanent, and readable only from outside the chain, not by contracts. Good for history that apps need to display.
- **Immutable and constant variables.** Stored in the contract's code, not in storage, so reading them is cheap.

```solidity
uint256 public constant FEE = 30;          // fixed at compile time
address public immutable owner;            // set once in the constructor

constructor() {
    owner = msg.sender;
}
```

If a value never changes after deployment, make it `constant` or `immutable`.

## Quick decision guide

| Situation | Use |
|---|---|
| External function input that you only read | `calldata` |
| Input you need to modify | `memory` |
| New array or struct built inside a function | `memory` |
| Returning an array or string | `memory` |
| Updating a struct or array in state | `storage` pointer |
| Reading a few fields of a state struct | `storage` pointer |
| A value fixed for the contract's lifetime | `constant` or `immutable` |

## Common errors and what they mean

- **"Data location must be memory or calldata for parameter"**: you forgot the keyword on an array, string, or struct parameter.
- **"Stack too deep"**: too many local variables. Group them into a struct in memory, or split the function.
- **State not updating**: you changed a `memory` copy and not a `storage` pointer.
- **Cannot assign to calldata**: calldata is read-only. Copy to memory first if you must change it.

To learn the rest of the language, see the [Solidity tutorial for beginners](/blogs/solidity-tutorial-for-beginners). For more ways to cut gas, see [smart contract security and optimization](/blogs/smart-contract-security-and-optimization).

## FAQ

### What is the difference between memory and calldata in Solidity?

Both are temporary. Memory can be modified and data is copied into it. Calldata is the read-only transaction input and is read without copying, so it costs less gas.

### When should I use calldata instead of memory?

For array, string, bytes, and struct parameters that the function does not modify. It saves the gas of copying.

### What is the difference between storage and memory?

Storage is permanent and saved on the blockchain between transactions. Memory exists only during one call and is then erased. Writing to storage costs far more gas.

### Why does my struct not update in Solidity?

You most likely loaded it into a `memory` variable, which is a copy. Declare the local variable as `storage` to get a reference to the saved data.
