---
title: Upgradeable Smart Contracts: Proxy Patterns Explained
description: Smart contracts cannot be edited, but proxies let you swap their logic. Learn how delegatecall, UUPS, and transparent proxies work, and the risks.
tags: Proxies, Upgrades, Solidity
keywords: upgradeable smart contracts, proxy pattern solidity, uups vs transparent proxy, delegatecall explained, how to upgrade a smart contract, openzeppelin upgrades
cover: flow user-round arrow-right-left file-code
---

A deployed smart contract cannot be edited. To make a contract **upgradeable**, developers split it in two: a **proxy** contract that holds the data and the address users interact with, and an **implementation** contract that holds the logic. The proxy forwards every call to the implementation with `delegatecall`. To upgrade, the admin points the proxy to a new implementation. The address and the data stay the same, and the code changes.

## Why upgrades are wanted, and what they cost

**Reasons to upgrade:**

- Fix a bug or a security hole
- Add features
- Lower gas costs

**The cost:** immutability is the main promise of a smart contract. An upgradeable contract breaks that promise. Whoever controls the upgrade can replace the code with anything, including code that takes all the funds. Users must now trust the upgrade key holder, not only the code.

Keep that trade-off in mind through the rest of this article.

## How a proxy works

```text
User  ->  Proxy (address users know)  --delegatecall-->  Implementation V1
          - stores all the data                          - contains the logic
          - stores the implementation address            - holds no user data
```

After an upgrade:

```text
User  ->  Proxy (same address, same data)  --delegatecall-->  Implementation V2
```

### delegatecall

A normal `call` runs another contract's code in **that contract's** storage. A `delegatecall` runs another contract's code in **the caller's** storage, and keeps the original `msg.sender` and `msg.value`.

So the proxy borrows the implementation's code and runs it on its own data.

### A minimal proxy

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MinimalProxy {
    // A fixed, hard-to-collide slot defined by the ERC-1967 standard
    bytes32 private constant IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address implementation) {
        assembly { sstore(IMPLEMENTATION_SLOT, implementation) }
    }

    fallback() external payable {
        assembly {
            let impl := sload(IMPLEMENTATION_SLOT)
            calldatacopy(0, 0, calldatasize())
            let ok := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch ok
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}
```

The proxy has no functions of its own, so every call lands in `fallback`, which forwards it. This is for learning. In real projects, use OpenZeppelin's audited proxies.

## Rule 1: no constructors, use initializers

A constructor runs once, on the implementation's own storage. The proxy's storage would never be set. Upgradeable contracts use an `initialize` function, called through the proxy, that can run only once.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract VaultV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public totalDeposits;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();          // lock the implementation itself
    }

    function initialize(address owner) external initializer {
        __Ownable_init(owner);
    }

    function deposit() external payable {
        totalDeposits += msg.value;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
```

Two points that have caused real losses:

- **`initializer`** makes sure `initialize` runs only once. Without it, anyone could call it again and become the owner.
- **`_disableInitializers()`** in the constructor stops anyone from initializing the bare implementation contract and misusing it.

## Rule 2: never change the storage layout

The proxy stores data by **slot number**, not by variable name. The implementation's code decides which variable means which slot. If V2 changes the order, the new code reads the old data wrongly.

```solidity
// V1
contract VaultV1 {
    uint256 public totalDeposits;   // slot 0
    address public treasury;        // slot 1
}

// V2 - WRONG: inserted a variable at the top
contract VaultV2Bad {
    uint256 public fee;             // slot 0  <- now reads totalDeposits!
    uint256 public totalDeposits;   // slot 1  <- now reads treasury!
    address public treasury;        // slot 2
}

// V2 - RIGHT: only append at the end
contract VaultV2 {
    uint256 public totalDeposits;   // slot 0
    address public treasury;        // slot 1
    uint256 public fee;             // slot 2  (new)
}
```

**Storage rules for upgrades:**

- Only **add** new variables at the **end**.
- Never remove, reorder, or change the type of an existing variable.
- Be careful with inheritance. Adding a variable to a parent contract shifts everything after it. Libraries handle this with reserved gaps or with **namespaced storage** (ERC-7201), which puts each module's data at its own calculated location.

How storage slots work is covered in [memory vs calldata vs storage](/blogs/solidity-memory-vs-calldata-vs-storage).

## The main proxy patterns

### Transparent proxy

The upgrade logic lives in the **proxy**.

- A separate admin contract may call the upgrade function.
- If the admin calls the proxy, it reaches only admin functions. If anyone else calls, the call is forwarded. This prevents a clash between a proxy function and an implementation function with the same selector.

**For:** the upgrade ability cannot be lost through a mistake in the implementation.
**Against:** more expensive to deploy, and each call costs a little more gas.

### UUPS (Universal Upgradeable Proxy Standard)

The upgrade logic lives in the **implementation**.

- The proxy is minimal and cheap.
- The implementation includes `upgradeToAndCall` and an `_authorizeUpgrade` check, as in the example above.

**For:** cheaper to deploy and use. You can remove upgradeability later by deploying a version without the upgrade function.
**Against:** if you upgrade to an implementation that lacks the upgrade function or has a broken `_authorizeUpgrade`, the contract can never be upgraded again.

### Beacon proxy

Many proxies read the implementation address from one shared **beacon** contract. Updating the beacon upgrades all of them in a single transaction. Useful when you deploy many identical contracts, such as one vault per user.

### Diamond (ERC-2535)

One proxy routes different functions to several implementation contracts called facets. It gets around the contract size limit and allows partial upgrades. It is powerful and considerably more complex to build and audit.

| Pattern | Upgrade logic in | Gas per call | Best for |
|---|---|---|---|
| Transparent | Proxy | Higher | Simple, safe default |
| UUPS | Implementation | Lower | Most new projects |
| Beacon | Beacon contract | Medium | Many copies of one contract |
| Diamond | Proxy with facets | Varies | Very large systems |

OpenZeppelin currently recommends UUPS for most new projects.

## Deploying and upgrading in practice

Use the OpenZeppelin Upgrades plugin for Hardhat or Foundry. It checks storage layout compatibility for you before each upgrade.

```javascript
// Hardhat with @openzeppelin/hardhat-upgrades
const { ethers, upgrades } = require("hardhat");

async function main() {
  const VaultV1 = await ethers.getContractFactory("VaultV1");
  const proxy = await upgrades.deployProxy(VaultV1, [ownerAddress], { kind: "uups" });
  await proxy.waitForDeployment();
  console.log("Proxy:", await proxy.getAddress());

  // Later: upgrade to V2
  const VaultV2 = await ethers.getContractFactory("VaultV2");
  await upgrades.upgradeProxy(await proxy.getAddress(), VaultV2);
}
main();
```

If V2 breaks the storage layout, the plugin stops with an error before anything is sent.

## Security risks

- **Stolen or misused admin key.** The largest risk. One compromised key can replace the logic and drain everything. Several major hacks happened this way.
- **Unprotected initializer.** If `initialize` can be called by anyone, an attacker becomes the owner.
- **Storage collisions.** A wrong layout corrupts balances and permissions.
- **Uninitialized implementation.** Always call `_disableInitializers()` in the constructor.
- **`selfdestruct` or unsafe `delegatecall` in the implementation.** These can break the proxy.
- **Function selector clashes** between proxy and implementation.
- **Losing upgradeability** in UUPS by deploying a faulty version.

## How to manage upgrades responsibly

1. **Put the upgrade key in a multisig**, never in a single wallet. See [how crypto wallets work](/blogs/how-crypto-wallets-work).
2. **Add a timelock.** A delay of a day or two between announcing and executing an upgrade lets users leave if they disagree.
3. **Use governance** for mature protocols. See [what a DAO is](/blogs/what-is-a-dao).
4. **Test the upgrade on a fork** of the live chain with real state. See [Hardhat vs Foundry](/blogs/hardhat-vs-foundry).
5. **Audit every new implementation**, not only the first.
6. **Emit events** and announce upgrades publicly.
7. **Plan to give up the key.** Many projects start upgradeable and remove the ability once the code is stable.

## Do you need upgradeability at all?

Not always. Alternatives:

- **Immutable contracts with migration.** Deploy V2 as a new contract and let users move if they choose. Uniswap does this: V1, V2, V3, and V4 are separate contracts.
- **Parameters, not code.** Let governance adjust numbers such as fees within fixed limits.
- **Modular design.** Keep the core immutable and make only add-on modules replaceable.

Simple tokens and contracts that hold user funds with minimal logic are often better left immutable.

## How to check if a contract is upgradeable

On a block explorer, a proxy contract is usually labelled, with "Read as Proxy" and "Write as Proxy" tabs and a link to the current implementation. Before you trust a protocol with funds, check who controls upgrades and whether there is a timelock.

## FAQ

### Can a smart contract be changed after deployment?

Its code cannot be edited. With a proxy pattern, the contract can be pointed to new logic while keeping the same address and data.

### What is the difference between UUPS and a transparent proxy?

In a transparent proxy the upgrade function is in the proxy. In UUPS it is in the implementation, which makes the proxy cheaper but means a faulty upgrade can remove the ability to upgrade.

### What is delegatecall in Solidity?

It runs another contract's code using the calling contract's storage, balance, and `msg.sender`. Proxies use it to borrow logic from the implementation.

### Are upgradeable contracts safe?

They are as safe as the people and process controlling the upgrade key. A multisig, a timelock, and audits of each version reduce the risk. A single-key upgrade is a serious trust risk.
