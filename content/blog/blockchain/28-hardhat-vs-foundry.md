---
title: Hardhat vs Foundry: Which Solidity Framework Should You Use?
description: Foundry tests in Solidity and is very fast. Hardhat uses JavaScript or TypeScript. Compare testing, fuzzing, speed, and how to use both.
tags: Foundry, Hardhat, Developer Tools
keywords: hardhat vs foundry, foundry vs hardhat, best solidity framework, foundry tutorial, hardhat tutorial, solidity testing framework
cover: versus hard-hat hammer
---

**Foundry** and **Hardhat** are the two main frameworks for building, testing, and deploying Solidity smart contracts. In Foundry you write tests **in Solidity**, and it is very fast with built-in fuzz testing. In Hardhat you write tests and scripts **in JavaScript or TypeScript**, and it has a large plugin ecosystem. Choose Foundry for contract-heavy work and security testing. Choose Hardhat if your team works mainly in TypeScript. Many teams use both in one project.

## Quick comparison

| | Foundry | Hardhat |
|---|---|---|
| Written in | Rust | TypeScript |
| Tests written in | Solidity | JavaScript or TypeScript (Solidity tests in newer versions) |
| Speed | Very fast | Slower in classic versions, improved in newer ones |
| Fuzz testing | Built in | Through plugins, or Solidity tests in newer versions |
| Invariant testing | Built in | Limited |
| Fork testing | Built in, simple | Built in |
| Command-line tools | `forge`, `cast`, `anvil`, `chisel` | `npx hardhat`, plugins |
| Dependencies | Git submodules or Soldeer | npm |
| Plugin ecosystem | Smaller | Large |
| Learning curve | Easy if you know Solidity | Easy if you know JavaScript |

Both are free and open source. Both tools change quickly, so check their current docs for the latest features.

## Foundry

Foundry is a set of four tools:

- **forge:** build, test, and deploy.
- **cast:** talk to a blockchain from the command line.
- **anvil:** a local test node.
- **chisel:** an interactive Solidity shell.

### Setup

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup

forge init my-project
cd my-project
forge build
forge test
```

### A contract and its test

```solidity
// src/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;
    address public owner = msg.sender;

    function increment() external {
        count += 1;
    }

    function setCount(uint256 newCount) external {
        require(msg.sender == owner, "Not the owner");
        count = newCount;
    }
}
```

```solidity
// test/Counter.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter counter;
    address alice = makeAddr("alice");

    function setUp() public {
        counter = new Counter();
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.count(), 1);
    }

    function test_RevertWhen_NotOwner() public {
        vm.prank(alice);                       // next call comes from alice
        vm.expectRevert("Not the owner");
        counter.setCount(5);
    }

    // Fuzz test: Foundry runs this with hundreds of random values
    function testFuzz_SetCount(uint256 value) public {
        counter.setCount(value);
        assertEq(counter.count(), value);
    }
}
```

### Cheatcodes

The `vm` object lets a test control the blockchain:

| Cheatcode | What it does |
|---|---|
| `vm.prank(addr)` | Make the next call come from `addr` |
| `vm.deal(addr, amount)` | Set an account's ETH balance |
| `vm.warp(time)` | Set the block timestamp |
| `vm.roll(number)` | Set the block number |
| `vm.expectRevert()` | Expect the next call to fail |
| `vm.expectEmit()` | Expect an event |
| `vm.createSelectFork(url)` | Copy a live chain's state into the test |

### Strengths of Foundry

- **One language.** You test Solidity in Solidity. No switching between languages and no conversion of types.
- **Speed.** Large test suites run in seconds, which changes how often you run them.
- **Fuzzing.** Any test function with parameters becomes a fuzz test.
- **Invariant testing.** Foundry calls your functions in random order and checks that a rule always holds, such as "total supply equals the sum of balances". This finds bugs that single tests miss.
- **Useful output.** `forge test -vvvv` prints the full trace of calls. `forge test --gas-report` shows gas per function. `forge coverage` shows which lines are tested.
- **cast.** Query any chain with one line.

```bash
cast call 0xTokenAddress "balanceOf(address)(uint256)" 0xUserAddress --rpc-url "$RPC_URL"
cast send 0xContract "increment()" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
cast sig "transfer(address,uint256)"       # 0xa9059cbb
```

### Weaknesses of Foundry

- Complex deployment scripts and off-chain logic are harder to write in Solidity than in TypeScript.
- Dependencies through git submodules feel unusual to web developers.
- Fewer ready-made plugins.

## Hardhat

Hardhat is a Node.js framework. Tests and scripts are written in JavaScript or TypeScript, usually with **viem** or **ethers.js**.

### Setup

```bash
mkdir my-project && cd my-project
npm init -y
npm install --save-dev hardhat
npx hardhat init
npx hardhat test
```

### The same test in TypeScript

This uses the classic Hardhat setup with ethers and Chai. Newer Hardhat versions also offer a viem-based setup and Solidity tests.

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", function () {
  async function deploy() {
    const [owner, alice] = await ethers.getSigners();
    const counter = await ethers.deployContract("Counter");
    return { counter, owner, alice };
  }

  it("increments", async function () {
    const { counter } = await deploy();
    await counter.increment();
    expect(await counter.count()).to.equal(1n);
  });

  it("reverts when the caller is not the owner", async function () {
    const { counter, alice } = await deploy();
    await expect(counter.connect(alice).setCount(5)).to.be.revertedWith("Not the owner");
  });
});
```

### Strengths of Hardhat

- **TypeScript everywhere.** The same language as your front end and back end.
- **Tests look like real usage.** They call the contract the way a dApp does, through a library.
- **Plugins.** Upgrades, verification, gas reports, deployment systems, and many more.
- **`console.log` in Solidity.** Print values from inside a contract while testing.
- **Hardhat Ignition.** A system for describing deployments that can resume after a failure.
- **npm for dependencies.**

### Weaknesses of Hardhat

- Classic versions run tests more slowly than Foundry.
- Fuzz and invariant testing are less developed.
- You convert between JavaScript and Solidity types, and that is a source of small bugs.

## Features side by side

### Fork testing

Both can copy the state of a live chain and run tests against real deployed contracts.

```solidity
// Foundry
function test_AgainstMainnet() public {
    vm.createSelectFork(vm.envString("MAINNET_RPC_URL"), 19_000_000);
    // interact with real mainnet contracts here
}
```

Pin a block number so results are the same on every run.

### Deployment

```solidity
// Foundry: script/Deploy.s.sol
import {Script} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        new Counter();
        vm.stopBroadcast();
    }
}
```

```bash
forge script script/Deploy.s.sol --rpc-url "$RPC_URL" --broadcast --verify
```

Hardhat uses a TypeScript script or an Ignition module. For multi-step deployments across many networks, TypeScript is often more comfortable.

### Debugging

- **Foundry:** call traces with `-vvvv`, and an interactive debugger.
- **Hardhat:** `console.log` in Solidity and readable JavaScript stack traces.

## Which should you choose?

**Choose Foundry if:**

- You mainly write and audit contracts.
- You want fuzz and invariant tests.
- You want the fastest feedback.
- You are learning Solidity and want to stay in one language.

**Choose Hardhat if:**

- Your team is strongest in TypeScript.
- You are building a full-stack dApp and want shared code and types.
- You depend on a specific Hardhat plugin.
- Your deployments have a lot of off-chain logic.

**For a beginner:** start with Foundry. Writing tests in Solidity strengthens your Solidity, and the setup is one command. Learn Hardhat when you join a team that uses it.

## Using both together

A common setup:

- **Foundry** for unit, fuzz, and invariant tests.
- **Hardhat** for deployment scripts and integration tests with the front end.

Both can read the same `src` or `contracts` folder. Foundry's `foundry.toml` and Hardhat's config file live side by side, and Hardhat has an official plugin for Foundry compatibility.

## Other tools worth knowing

- **Remix:** a browser editor. Best for quick experiments and learning. See the [Solidity tutorial](/blogs/solidity-tutorial-for-beginners).
- **Slither:** static analysis that finds common bugs.
- **Echidna and Medusa:** dedicated fuzzers.
- **OpenZeppelin Contracts:** audited building blocks.
- **Tenderly:** transaction simulation and debugging.
- **Truffle and Ganache:** older tools that were retired in 2023. Avoid them for new projects.

## A testing checklist for any framework

1. Test the normal path of every function.
2. Test every `require` and every revert.
3. Test access control: call each restricted function as a stranger.
4. Fuzz inputs, with special attention to zero and the maximum value.
5. Write at least one invariant for the whole contract.
6. Test against a fork if you integrate with other protocols.
7. Write a test for each known attack, such as [reentrancy](/blogs/reentrancy-attack-explained).
8. Check coverage, and remember that 100 percent coverage does not prove safety.

More on writing safe contracts is in [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## FAQ

### Is Foundry better than Hardhat?

For testing contracts, many developers prefer Foundry for its speed and built-in fuzzing. For TypeScript-based projects and complex deployments, Hardhat is often more convenient. Neither is better for every case.

### Can I use Foundry and Hardhat in the same project?

Yes. Both can compile the same contracts. A common split is Foundry for tests and Hardhat for deployment and front-end integration.

### Which framework should a beginner learn first?

Foundry, because you write everything in Solidity and the setup is quick. Hardhat is easy to add later.

### Is Truffle still used?

Truffle and Ganache were retired by their maintainers in 2023. Existing projects have moved to Hardhat or Foundry.
