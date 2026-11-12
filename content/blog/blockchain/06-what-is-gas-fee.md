---
title: What Is a Gas Fee in Crypto? How Ethereum Gas Works
description: A gas fee is what you pay to make a transaction on a blockchain. Learn how gas is calculated, why fees rise, and seven ways to pay less.
tags: Gas, Ethereum, Transactions
keywords: what is gas fee, what is gas fee in crypto, gas fees in ethereum, what is gas in blockchain, how to reduce gas fees, gas fee in trust wallet
cover: hero fuel coins calculator timer trending-up
---

A **gas fee** is the payment you make to a blockchain network to process your transaction. It pays the validators who run the network, and it stops people from flooding the network with useless work. On Ethereum the fee is paid in ETH and is calculated as **gas used × price per unit of gas**. The fee depends on how complex your transaction is and how busy the network is, not on how much money you send.

## Why gas fees exist

Every transaction makes thousands of computers do work: check signatures, run code, and store data. Gas fees do three jobs:

- **Pay validators** for that work and for securing the network.
- **Stop spam.** If transactions were free, an attacker could fill every block with junk.
- **Stop endless programs.** A smart contract with a loop that never ends would freeze the network. Each step costs gas, so a program stops when its gas runs out.

## Gas, gas price, and gas limit

These three terms confuse most beginners.

**Gas** is a unit of computing work. Each operation has a fixed gas cost:

| Action | Gas (roughly) |
|---|---|
| Send ETH to another wallet | 21,000 |
| Send an ERC-20 token | 45,000 to 65,000 |
| Swap on a decentralized exchange | 120,000 to 200,000 |
| Mint an NFT | 80,000 to 200,000 |
| Deploy a contract | 500,000 to several million |

**Gas price** is how much you pay per unit of gas. It is quoted in **gwei**. One gwei is one billionth of an ETH (0.000000001 ETH).

**Gas limit** is the maximum gas you allow the transaction to use. Your wallet sets it for you. You pay only for gas used, and the rest is returned.

Think of a car trip: **gas** is the litres of fuel the trip needs, **gas price** is the price per litre today, and **gas limit** is the amount in the tank.

## How the fee is calculated

Since an upgrade called **EIP-1559** in 2021, the price per unit of gas has two parts:

```text
fee = gas used × (base fee + priority fee)
```

- **Base fee.** Set automatically by the network. It goes up when blocks are more than half full and down when they are less than half full. The base fee is **burned**, meaning destroyed, not paid to anyone.
- **Priority fee (tip).** A small extra amount that goes to the validator, to get your transaction included sooner.

You also set a **max fee**, the most you are willing to pay per unit. If the real cost is lower, you get the difference back.

### A worked example

You send ETH to a friend. The base fee is 20 gwei and you add a tip of 1 gwei.

```text
gas used     = 21,000
price        = 20 + 1 = 21 gwei
fee          = 21,000 × 21 = 441,000 gwei
             = 0.000441 ETH
```

To get the fee in your own currency, multiply by the current price of ETH. The same transfer costs 0.000441 ETH whether you send a tiny amount or a fortune.

```javascript
// The same math in JavaScript
const gasUsed = 21_000n;
const baseFee = 20n;      // gwei
const priorityFee = 1n;   // gwei

const feeInGwei = gasUsed * (baseFee + priorityFee);
console.log(Number(feeInGwei) / 1e9, "ETH");   // 0.000441 ETH
```

## Why gas fees go up

Each block has limited space. When many people want to transact at once, such as during a popular token launch or a market crash, they bid against each other and the base fee rises. When demand falls, the fee falls.

So the fee you pay depends on:

1. **How complex the transaction is** (gas used). A swap costs more than a simple transfer.
2. **How busy the network is** (gas price).

## What happens when a transaction fails

- **Out of gas.** If the gas limit is too low, the transaction fails and its changes are undone. **You still pay for the gas that was used**, because validators did the work.
- **Reverted.** If a contract rejects the transaction, for example because the price moved too far in a swap, you also pay for the gas used up to that point.
- **Stuck.** If your max fee is below the current base fee, the transaction waits. Most wallets let you speed it up by resending with a higher fee, or cancel it.

## Seven ways to pay less

1. **Use a layer 2 network.** Arbitrum, Optimism, Base, zkSync, and others process transactions off the main chain and cost a small fraction of mainnet fees. See [what layer 2 is](/blogs/what-is-layer-2).
2. **Choose a quiet time.** Fees are often lower on weekends and when it is night in both the US and Europe. Gas trackers show the current price.
3. **Do not raise the tip without reason.** If you are not in a hurry, use the wallet's low or standard setting.
4. **Batch actions.** Some apps and smart wallets combine several steps into one transaction.
5. **Limit approvals.** Each token approval is a separate transaction. Fewer approvals means fewer fees, and it is also safer.
6. **Simulate first.** Many wallets show whether a transaction will fail before you send it. Failing still costs gas.
7. **Use another chain** when it fits your purpose. Fees differ a lot between networks. See [Ethereum vs Solana](/blogs/ethereum-vs-solana).

## Gas on layer 2 networks

A layer 2 fee has two parts:

- A small fee for running the transaction on the layer 2.
- A share of the cost of posting the data to Ethereum.

Since an Ethereum upgrade in March 2024 that added cheaper data space called **blobs**, layer 2 fees have dropped sharply, often to a few cents or less.

## Gas for developers

If you write contracts, gas is a design concern. The users of your contract pay for every operation.

- **Storage is the most expensive.** Writing a new value to storage costs about 20,000 gas. Reading costs far less.
- **Use `calldata` for read-only inputs** instead of `memory`. See [memory vs calldata vs storage](/blogs/solidity-memory-vs-calldata-vs-storage).
- **Avoid loops over lists that can grow without limit.** They can exceed the block limit and lock the contract.
- **Pack small variables together** so they share one storage slot.
- **Use events** for data that only apps need to read.
- **Use custom errors** instead of long error strings.
- **Measure.** Both Foundry and Hardhat can print a gas report for your tests.

More techniques are in [smart contract security and optimization](/blogs/smart-contract-security-and-optimization).

## Gas on other blockchains

Every public chain charges a fee, with different names and prices:

| Chain | Fee paid in | Typical cost |
|---|---|---|
| Ethereum | ETH | Higher, changes with demand |
| Ethereum layer 2s | ETH on most | Very low |
| BNB Chain | BNB | Low |
| Polygon | POL | Very low |
| Solana | SOL | Very low |
| Bitcoin | BTC | Depends on transaction size in bytes |

You always need some of the chain's own coin in your wallet to pay fees. Holding only USDT on Ethereum with no ETH means you cannot move it. This is the most common reason for the "insufficient funds for gas" message in wallets such as MetaMask and Trust Wallet.

## FAQ

### Who gets the gas fee?

On Ethereum the base fee is burned, which removes it from supply. The priority fee goes to the validator who includes your transaction. Your wallet app does not receive it.

### Why did I pay gas for a failed transaction?

Validators ran your transaction until the point where it failed, and that work used gas. Only the unused gas is returned.

### Can I avoid gas fees?

Not on a public blockchain. You can lower them a lot by using a layer 2 network or a low-fee chain. Some apps pay the gas for their users.

### Does the gas fee depend on the amount I send?

No. Sending 1 ETH and sending 1,000 ETH use the same gas. The fee depends on the work the network must do and on how busy it is.
