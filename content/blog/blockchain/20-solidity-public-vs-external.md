---
title: Solidity public vs external vs internal vs private Explained
description: Learn the four visibility levels in Solidity, when to use external or public, how it affects gas, and why private data is not secret.
tags: Solidity, Visibility, Best Practices
keywords: solidity public vs external, external vs public solidity, solidity function visibility, internal vs private solidity, solidity visibility best practices
cover: code SOL eye
---

In Solidity, **visibility** controls who can call a function. `external` functions can be called only from outside the contract. `public` functions can be called from outside and from inside. `internal` functions can be called only by the contract and contracts that inherit from it. `private` functions can be called only by the contract that defines them. As a rule: use `external` for functions that are only called from outside, and give every function the most restrictive visibility that still works.

## The four levels

| Visibility | From outside (users, other contracts) | From inside the same contract | From contracts that inherit |
|---|---|---|---|
| `external` | Yes | No (only through `this.f()`) | No (only through `this.f()`) |
| `public` | Yes | Yes | Yes |
| `internal` | No | Yes | Yes |
| `private` | No | Yes | No |

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Visibility {
    uint256 private secretNumber = 42;   // not secret! see below
    uint256 internal counter;
    uint256 public total;                // creates a getter: total()

    function deposit() external payable {
        _addToTotal(msg.value);          // ok: internal call
    }

    function add(uint256 amount) public {
        _addToTotal(amount);
    }

    function addTwice(uint256 amount) external {
        add(amount);                     // ok: public can be called inside
        add(amount);
        // deposit();                    // error: external cannot be called inside
    }

    function _addToTotal(uint256 amount) internal {
        total += amount;
        _log();
    }

    function _log() private {
        counter += 1;
    }
}

contract Child is Visibility {
    function bump() external {
        _addToTotal(1);                  // ok: internal is inherited
        // _log();                       // error: private is not inherited
    }
}
```

## public vs external

This is the question developers ask most often.

### The difference

- An `external` function is part of the contract's interface. It can only be reached by a transaction or by a call from another contract.
- A `public` function is the same, and it can also be called directly from inside the contract, like a normal function.

### Which one costs less gas?

For years the standard advice was "external is cheaper". The reason was that old compilers forced `public` functions to copy array and string arguments into memory, while `external` functions could read them straight from **calldata**.

Since Solidity 0.6.9, you can use `calldata` for the parameters of `public` functions too. So today the saving comes from the **data location**, not from the visibility keyword:

```solidity
// More gas: copies the whole array into memory
function sumMemory(uint256[] memory values) public pure returns (uint256 total) {
    for (uint256 i = 0; i < values.length; i++) total += values[i];
}

// Less gas: reads directly from the transaction data
function sumCalldata(uint256[] calldata values) external pure returns (uint256 total) {
    for (uint256 i = 0; i < values.length; i++) total += values[i];
}
```

For functions with simple arguments such as `uint256` or `address`, there is no meaningful gas difference between `public` and `external`.

See [memory vs calldata vs storage](/blogs/solidity-memory-vs-calldata-vs-storage) for the full explanation.

### So why prefer external?

Because it states your intent. `external` tells every reader and every auditor: "this function is an entry point and is never called from inside". That makes the contract easier to reason about. Linters such as Slither flag `public` functions that are never used internally.

**Rule:** start with `external`. Change to `public` only when the contract itself needs to call the function.

### Calling an external function from inside

You can write `this.myFunction()`, but avoid it. It makes a real external call, which:

- Costs much more gas.
- Changes `msg.sender` to the contract's own address.
- Can break access checks that depend on the caller.

If you need the logic in both places, put it in an `internal` function and call that from the `external` one.

## internal vs private

- `internal` is the default for state variables and the usual choice for helper functions. Child contracts can use and override them.
- `private` hides the item from child contracts too.

Use `private` when a child contract changing or calling the item could break an important rule of your contract. Use `internal` when you design for extension, as libraries such as OpenZeppelin do.

A common naming habit is to begin internal and private function names with an underscore, such as `_transfer`, so they are easy to spot.

## private does not mean secret

This is the most important point in this article.

`private` and `internal` only stop **other contracts** from reading a variable through Solidity. All contract storage is public data on the blockchain. Anyone can read any storage slot directly:

```javascript
// Read storage slot 0 of any contract (ethers v6)
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://your-rpc-url");
const value = await provider.getStorage("0xContractAddress", 0);
console.log(BigInt(value));   // 42, the "private" secretNumber
```

Never store these on-chain, whatever the visibility:

- Passwords or secret keys
- The answer to a puzzle or game
- A random seed that should stay hidden
- Private user data

If a value must stay hidden for a while, store only its **hash** and reveal the value later. This is the **commit-reveal** pattern. See [randomness in smart contracts](/blogs/smart-contract-randomness).

## Visibility for state variables

State variables can be `public`, `internal`, or `private`. They cannot be `external`.

```solidity
uint256 public price;       // compiler creates: function price() external view returns (uint256)
uint256 internal reserve;   // default if you write nothing
uint256 private nonce;
```

A `public` variable gets a free read function. For mappings and arrays, the getter takes the key or index as an argument:

```solidity
mapping(address => uint256) public balances;   // balances(address) returns (uint256)
```

## Visibility is not access control

Visibility decides **where** a call can come from. It does not decide **who** is allowed. An `external` function can be called by every address in the world.

```solidity
// Wrong: anyone can take the funds
function withdrawAll() external {
    payable(msg.sender).transfer(address(this).balance);
}

// Right: restrict the caller
function withdrawAll() external {
    require(msg.sender == owner, "Not the owner");
    payable(owner).transfer(address(this).balance);
}
```

Many real hacks came from a function that should have been `internal` being left `public`, or an admin function with no owner check. In 2017, a wallet library's initialization function was left open to anyone. An attacker called it, became the owner, and drained wallets. Later the same kind of flaw let someone destroy the library, which froze a large amount of ETH for good.

For more on this, see [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## A checklist for every function

1. Is it called only from outside? Use `external`.
2. Is it called from outside and inside? Use `public`, or better, an `external` function that calls an `internal` one.
3. Is it a helper? Use `internal`.
4. Must child contracts be blocked from using it? Use `private`.
5. Does it change important state or move funds? Add an access check.
6. Does it take arrays, strings, or structs it does not modify? Use `calldata`.
7. Does it only read state? Add `view`. Does it not read state at all? Add `pure`.

## Good practices

- **Always write the visibility.** Functions have required it since Solidity 0.5. State variables default to `internal`, so write it out for clarity.
- **Keep the external surface small.** Each external function is a door for an attacker.
- **Review every `public` and `external` function** before deployment and ask: what happens if a stranger calls this with the worst possible input?
- **Run a static analyzer** such as Slither. It reports visibility issues automatically.

If you are still learning the language, the [Solidity tutorial for beginners](/blogs/solidity-tutorial-for-beginners) covers the rest of the basics.

## FAQ

### What is the difference between public and external in Solidity?

Both can be called from outside the contract. A `public` function can also be called from inside the contract. An `external` function cannot, except through `this`, which makes a costly external call.

### Is external cheaper than public?

Only when it lets array or string arguments stay in calldata. Since Solidity 0.6.9, public functions can use calldata too, so the saving depends on the data location, not the keyword.

### What is the default visibility in Solidity?

Functions have no default and must state it. State variables default to `internal`.

### Can private variables be read by others?

Yes. `private` only blocks other contracts from reading the variable in code. Anyone can read the raw storage from the blockchain.
