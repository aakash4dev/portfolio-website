---
title: Ethereum Transaction vs Call: What Is the Difference?
description: A transaction changes the blockchain and costs gas. A call only reads and is free. Learn the difference, with code, receipts, and common mistakes.
tags: Ethereum, Transactions, dApp Development
keywords: transaction vs call ethereum, eth_call vs eth_sendtransaction, difference between call and transaction, ethereum transaction explained, view function gas
cover: versus pen-line eye
---

A **transaction** changes the state of the blockchain. It must be signed, it is sent to the whole network, it is included in a block, and it costs gas. A **call** only reads. It runs on a single node, changes nothing, needs no signature, costs nothing, and returns its result at once. Sending tokens is a transaction. Checking a balance is a call.

## Quick comparison

| | Transaction | Call |
|---|---|---|
| Changes state | Yes | No |
| Needs a signature | Yes | No |
| Costs gas | Yes, paid in ETH | No |
| Sent to the network | Yes, to all nodes | No, runs on one node |
| Included in a block | Yes | No |
| Speed | Seconds to minutes | Milliseconds |
| What you get back | A transaction hash, later a receipt | The function's return value |
| JSON-RPC method | `eth_sendRawTransaction` | `eth_call` |
| Example | `transfer()`, `approve()`, `mint()` | `balanceOf()`, `totalSupply()` |

## What a transaction is

A transaction is a signed message from an account that asks the network to do something.

Three kinds exist:

- **Send ETH** from one account to another.
- **Call a contract function** that changes state.
- **Deploy a contract.**

### What a transaction contains

| Field | Meaning |
|---|---|
| `from` | The sender, recovered from the signature |
| `to` | The receiver or contract. Empty when deploying |
| `value` | Amount of ETH to send |
| `data` | The function and arguments, encoded. See [what an ABI is](/blogs/what-is-an-abi) |
| `nonce` | A counter of transactions sent by this account |
| `gasLimit` | Maximum gas to use |
| `maxFeePerGas`, `maxPriorityFeePerGas` | Gas price settings. See [what gas fees are](/blogs/what-is-gas-fee) |
| `chainId` | Which network this is for |
| Signature | Proof that the sender approved it |

### The life of a transaction

1. Your wallet builds it and you sign it with your private key.
2. It is sent to a node, which passes it to the network.
3. It waits in the **mempool**.
4. A validator includes it in a block.
5. Every node runs it and updates the state.
6. You receive a **receipt**.

The **nonce** matters. Each account's transactions must be processed in order: nonce 0, then 1, then 2. If one is stuck because its fee is too low, every later one waits behind it. A nonce also prevents the same signed transaction from being run twice.

## What a call is

A call asks one node: "If this function ran right now, what would it return?" The node runs the code on its local copy of the state, returns the result, and throws away any changes.

- Nothing is signed.
- Nothing is broadcast.
- Nothing is saved.
- No gas is paid.

This is how apps show balances, prices, and other data.

## view and pure functions

In Solidity, a function marked `view` promises not to change state. A function marked `pure` promises not to read or change state.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;

    // Changes state: needs a transaction
    function increment() external returns (uint256) {
        count += 1;
        return count;
    }

    // Reads state: can be a free call
    function current() external view returns (uint256) {
        return count;
    }

    // Reads nothing: can be a free call
    function double(uint256 x) external pure returns (uint256) {
        return x * 2;
    }
}
```

Libraries read the ABI and choose automatically: `view` and `pure` functions are sent as calls, and other functions as transactions.

## In code

```javascript
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const abi = parseAbi([
  "function current() view returns (uint256)",
  "function increment() returns (uint256)",
]);
const address = "0xYourContractAddress";

const publicClient = createPublicClient({ chain: sepolia, transport: http() });

// CALL: free, instant, returns the value
const value = await publicClient.readContract({ address, abi, functionName: "current" });
console.log(value);   // 5n

// TRANSACTION: signed, costs gas, returns a hash
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: sepolia, transport: http() });

const hash = await walletClient.writeContract({ address, abi, functionName: "increment" });
console.log(hash);    // 0x3f1c...

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log(receipt.status);   // "success" or "reverted"
```

## Mistake 1: expecting a return value from a transaction

`increment()` returns a number in Solidity. But `writeContract` gives you a **transaction hash**, not that number.

A transaction has not run yet when you send it. It runs later, when a validator includes it. The return value exists only inside the EVM and is not delivered to you.

To get data out of a transaction:

- **Emit an event** and read it from the receipt's logs. This is the standard way.
- **Do a call afterwards** to read the new state.
- **Simulate first** (see below).

```solidity
event Incremented(address indexed by, uint256 newCount);

function increment() external returns (uint256) {
    count += 1;
    emit Incremented(msg.sender, count);
    return count;      // only usable by other contracts
}
```

Return values of state-changing functions are useful when **another contract** calls the function inside the same transaction.

## Mistake 2: thinking view functions are always free

A `view` function is free only when called **from outside** the chain with `eth_call`. If a contract calls a `view` function **during a transaction**, the work is part of that transaction and costs gas.

```solidity
function incrementIfSmall() external {
    // This internal read of a view function costs gas,
    // because it runs inside a transaction
    if (this.current() < 100) {
        count += 1;
    }
}
```

So an expensive `view` function is still a problem if other contracts depend on it.

## Simulating a transaction with a call

You can send a state-changing function as a **call** to see what would happen, without doing it. The node runs it and discards the changes.

```javascript
// Dry run: get the return value and catch errors before paying gas
const { result, request } = await publicClient.simulateContract({
  account,
  address,
  abi,
  functionName: "increment",
});
console.log(result);                        // 6n - what it WOULD return

const hash = await walletClient.writeContract(request);   // now do it for real
```

Wallets do this to warn "this transaction is likely to fail". `eth_estimateGas` works the same way to find the gas limit.

A simulation shows the result for the **current** state. By the time the real transaction is included, the state may be different, so success is not guaranteed.

## The transaction receipt

After a transaction is included, the receipt tells you what happened.

| Field | Meaning |
|---|---|
| `status` | Success or reverted |
| `blockNumber` | The block it was included in |
| `gasUsed` | Gas actually consumed |
| `effectiveGasPrice` | Price paid per unit of gas |
| `logs` | Events emitted |
| `contractAddress` | The new address, for a deployment |

A transaction that is **included** is not always **successful**. A reverted transaction is still in a block and still costs gas. Always check `status`.

## Confirmations and finality

One block of confirmation is usually enough for a small action in an app. For large payments, wait for more blocks or for **finality**, which on Ethereum takes about 13 minutes. Before finality, a block can in rare cases be replaced in a reorganization. Layer 2 networks confirm faster and have their own finality rules. See [what layer 2 is](/blogs/what-is-layer-2).

## The word "call" has other meanings

The word is used for three different things:

1. **`eth_call`:** the read-only request from outside the chain. This is the "call" in this article.
2. **A message call between contracts:** when contract A runs a function of contract B during a transaction. This is also named an internal transaction. It can change state.
3. **The low-level Solidity `.call()`:** as in `recipient.call{value: 1 ether}("")`, used to send ETH or call a contract by raw data.

Related low-level calls are `staticcall`, which is a call that is not allowed to change state, and `delegatecall`, which runs another contract's code on your own storage. See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).

## When to use which

| You want to | Use |
|---|---|
| Show a balance, price, or setting | Call |
| Check whether an action would succeed | Call (simulation) |
| Estimate gas | `eth_estimateGas` |
| Transfer tokens, vote, mint, swap | Transaction |
| Deploy a contract | Transaction |
| Get the result of a state change | Transaction, then read the event or do a call |

**Design tip:** move as much work as possible into calls. Calculations for display, filtering, and sorting should be done off-chain or in `view` functions. Use transactions only for what must be saved.

To see how these pieces form an application, read [what a dApp is](/blogs/what-is-a-dapp).

## FAQ

### What is the difference between a call and a transaction in Ethereum?

A transaction is signed, broadcast, included in a block, changes state, and costs gas. A call runs on one node, changes nothing, and is free.

### Do view functions cost gas?

Not when called from outside the blockchain. They do cost gas when another contract calls them during a transaction.

### Why did my transaction return a hash and not a value?

A transaction runs later, when it is included in a block. The hash lets you track it. To get data from it, read an event from the receipt or make a call afterwards.

### Does a failed transaction cost gas?

Yes. A reverted transaction is still included in a block, and you pay for the gas it used before failing.
