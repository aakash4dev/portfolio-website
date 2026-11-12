---
title: Solidity Tutorial for Beginners: Write Your First Smart Contract
description: Learn Solidity from zero. Variables, functions, mappings, events, and errors, with a full contract you can deploy in your browser in minutes.
tags: Solidity, Smart Contracts, Tutorial
keywords: solidity tutorial, solidity tutorial for beginners, learn solidity, solidity language tutorial, first smart contract, solidity basics
cover: code SOL file-code
---

**Solidity** is the main programming language for smart contracts on Ethereum and other EVM chains. Its syntax looks like JavaScript and TypeScript, but it behaves differently: code runs on a blockchain, every write costs gas, and deployed code cannot be edited. This tutorial takes you from an empty file to a working contract, using only your browser.

Not sure what a smart contract is? Read [what a smart contract is](/blogs/what-is-a-smart-contract) first.

## Set up in one minute

Open **Remix** at `remix.ethereum.org`. It is a free editor that runs in the browser. You need no wallet and no real money, because Remix includes a test blockchain.

1. Create a file named `Counter.sol`.
2. Paste the code below.
3. Open the "Solidity Compiler" tab and click Compile.
4. Open the "Deploy" tab and click Deploy.

## Your first contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;

    function increment() external {
        count += 1;
    }

    function reset() external {
        count = 0;
    }
}
```

Line by line:

- `// SPDX-License-Identifier: MIT` states the license. The compiler warns if it is missing.
- `pragma solidity ^0.8.20;` sets the compiler version: 0.8.20 or newer, below 0.9.
- `contract Counter { ... }` defines a contract. It is similar to a class.
- `uint256 public count;` is a **state variable**. It is saved on the blockchain. `public` creates a free function to read it.
- `increment()` changes the stored value. Calling it costs gas.

After deploying in Remix, click `increment` a few times, then `count`.

## Data types

```solidity
bool isActive = true;
uint256 amount = 100;          // whole number, zero or more
int256 change = -5;            // can be negative
address owner = msg.sender;    // a 20-byte account address
string name = "Alice";
bytes32 id = keccak256("data");
```

Things that surprise beginners:

- **There are no decimal numbers.** Money is stored in the smallest unit. One ether is `1e18` wei.
- **Numbers cannot overflow silently.** Since version 0.8, going past the largest value cancels the transaction.
- **Variables have default values.** An unset `uint` is 0, a `bool` is false, an `address` is the zero address.

## Mappings, arrays, and structs

```solidity
mapping(address => uint256) public balances;   // like a dictionary

uint256[] public numbers;                       // a list that can grow

struct Task {
    string title;
    bool done;
}
Task[] public tasks;
```

A **mapping** is the most used structure in Solidity. Every possible key exists and starts at the default value. You cannot loop over a mapping or ask for its size.

## Functions

```solidity
function deposit() external payable { ... }
function getBalance(address user) external view returns (uint256) { ... }
function add(uint256 a, uint256 b) public pure returns (uint256) { return a + b; }
```

**Visibility** says who may call a function:

| Keyword | Who can call it |
|---|---|
| `public` | Anyone, and the contract itself |
| `external` | Only from outside the contract |
| `internal` | This contract and contracts that inherit from it |
| `private` | Only this contract |

More detail is in [public vs external in Solidity](/blogs/solidity-public-vs-external).

**Other keywords:**

- `view`: reads state and does not change it. Free to call from outside.
- `pure`: does not read or change state.
- `payable`: can receive ether.

## Special values

- `msg.sender`: the address that called the function.
- `msg.value`: the amount of ether sent with the call, in wei.
- `block.timestamp`: the time of the current block, in seconds.
- `address(this)`: the contract's own address.

## Checks and errors

`require` checks a condition. If it is false, everything the transaction did is undone.

```solidity
require(msg.sender == owner, "Not the owner");
```

Custom errors are cheaper in gas and are the modern style:

```solidity
error NotOwner();

if (msg.sender != owner) revert NotOwner();
```

## Modifiers

A modifier is reusable code that runs before a function. The `_;` marks where the function body goes.

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not the owner");
    _;
}

function withdrawAll() external onlyOwner { ... }
```

## Events

Events write a log that websites and apps can listen to. They are much cheaper than storing data.

```solidity
event Deposited(address indexed user, uint256 amount);

emit Deposited(msg.sender, msg.value);
```

## A full example: a simple bank

This contract combines everything above.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleBank {
    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    error InsufficientBalance(uint256 available, uint256 requested);

    function deposit() external payable {
        require(msg.value > 0, "Send some ether");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        uint256 balance = balances[msg.sender];
        if (amount > balance) revert InsufficientBalance(balance, amount);

        balances[msg.sender] = balance - amount;          // 1. update state first

        (bool ok, ) = msg.sender.call{value: amount}(""); // 2. then send
        require(ok, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }
}
```

Try it in Remix:

1. Deploy the contract.
2. Enter an amount in the "Value" field and click `deposit`.
3. Paste your account address into `balances` to see the balance.
4. Call `withdraw` with an amount.

### The most important lesson in this code

In `withdraw`, the balance is reduced **before** the ether is sent. If you send first and update after, an attacker's contract can call `withdraw` again during the send and empty the bank. This is the well-known **reentrancy** bug. Always follow the order: **checks, effects, interactions**. See [reentrancy attacks explained](/blogs/reentrancy-attack-explained).

## Data locations: storage, memory, calldata

For arrays, strings, and structs you must say where the data lives:

- `storage`: on the blockchain, permanent, expensive.
- `memory`: temporary, during the function call.
- `calldata`: read-only input data, cheapest.

```solidity
function setName(string calldata newName) external {
    name = newName;
}
```

See [memory vs calldata vs storage](/blogs/solidity-memory-vs-calldata-vs-storage).

## Inheritance and libraries

Do not write standard features yourself. Use **OpenZeppelin**, a library of audited contracts.

```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("My Token", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
```

That is a complete token. The full walkthrough is in [how to create an ERC-20 token](/blogs/create-erc20-token).

## How Solidity differs from normal programming

- **Every write costs money.** Storing data is the most expensive operation. See [what gas fees are](/blogs/what-is-gas-fee).
- **Code is permanent.** No hotfixes.
- **Everything is public.** `private` only stops other contracts from reading a variable. Anyone can still read it from the chain. Never store secrets.
- **No real randomness.** See [randomness in smart contracts](/blogs/smart-contract-randomness).
- **No access to the internet.** Contracts need oracles for outside data.
- **Attackers are always watching.** Assume every function will be called with harmful input.

## What to learn next

1. Move from Remix to a local setup. See [Hardhat vs Foundry](/blogs/hardhat-vs-foundry).
2. Write tests for every function.
3. Build a token, an NFT, and a crowdfunding contract.
4. Study security. See [smart contract security best practices](/blogs/smart-contract-security-and-optimization).
5. Follow the [blockchain developer roadmap](/blogs/how-to-become-blockchain-developer).

## FAQ

### Is Solidity hard to learn?

The syntax is easy if you know JavaScript, Python, or a similar language. The hard part is the way of thinking: gas costs, security, and code that cannot be changed.

### How long does it take to learn Solidity?

A programmer can write simple contracts within one or two weeks. Writing secure, production-level contracts takes several months of practice and study of past hacks.

### Should I learn Solidity or Rust?

Start with Solidity. It has the largest ecosystem, the most learning material, and the most jobs. Add Rust later for Solana or Cosmos. See [Rust vs Solidity](/blogs/rust-vs-solidity).

### Do I need to pay to practice Solidity?

No. Remix has a built-in test chain, and public test networks give free test coins through faucets.
