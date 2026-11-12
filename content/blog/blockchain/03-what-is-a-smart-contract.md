---
title: What Is a Smart Contract? Simple Explanation With Examples
description: A smart contract is a program on a blockchain that runs exactly as written. Learn how smart contracts work, see real code, and know the risks.
tags: Smart Contracts, Ethereum, Solidity
keywords: what is smart contract, what is smart contract in blockchain, smart contract in simple words, smart contract in ethereum, smart contract example
cover: hero file-code blocks lock coins scale
---

A **smart contract** is a program stored on a blockchain that runs automatically when its conditions are met. Nobody can change its code or stop it after it is deployed, unless that ability was written into it, and every node on the network runs it and gets the same result. This lets people who do not know each other make agreements without a bank, lawyer, or other middleman.

## The vending machine example

A vending machine is the classic comparison:

1. You put in money.
2. You choose an item.
3. The machine gives you the item.

There is no shopkeeper. The rules are built into the machine. If you pay the right amount, you get the item. If not, you do not.

A smart contract is a vending machine made of code. "If this happens, do that", enforced by the blockchain and not by a person.

## How a smart contract works

1. **A developer writes the code**, usually in a language called Solidity.
2. **The code is deployed** to the blockchain with a transaction. It gets its own address.
3. **Users call its functions** by sending transactions to that address.
4. **Every node runs the code** and updates the contract's stored data.
5. **The result is recorded** on the blockchain for good.

On Ethereum, contracts run inside the **Ethereum Virtual Machine (EVM)**. Each step of code costs a small fee called **gas**, paid by the person who sends the transaction. See [what gas fees are](/blogs/what-is-gas-fee).

## A real example in Solidity

This contract is a simple escrow. A buyer puts money in. When the buyer confirms the item arrived, the money goes to the seller.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public buyer;
    address public seller;
    bool public delivered;

    constructor(address _seller) payable {
        buyer = msg.sender;       // the account that deploys and pays
        seller = _seller;
    }

    function confirmDelivery() external {
        require(msg.sender == buyer, "Only the buyer can confirm");
        require(!delivered, "Already confirmed");

        delivered = true;
        (bool ok, ) = seller.call{value: address(this).balance}("");
        require(ok, "Payment failed");
    }
}
```

What it does:

- `constructor` runs once, when the contract is created. The buyer sends the payment with it.
- `confirmDelivery` can only be called by the buyer. It sends all the money to the seller.
- `require` checks a condition. If the condition is false, the whole transaction is cancelled.

No bank holds the money. The contract does, and it follows only these rules. A real escrow would also need a way to handle disputes and refunds.

To learn the language, see the [Solidity tutorial for beginners](/blogs/solidity-tutorial-for-beginners).

## What makes smart contracts special

- **They cannot be changed.** After deployment, the code stays as it is. Users can trust that the rules will not change later.
- **They are open.** The code and all transactions are public. Anyone can check what a contract does.
- **They always produce the same result.** The same input gives the same output on every node.
- **They hold money directly.** A contract can own and send coins and tokens without any bank.
- **They can be combined.** One contract can call another. Developers build on existing contracts like building blocks.
- **They need no permission.** Anyone can deploy one and anyone can use one.

## What smart contracts are used for

- **Tokens.** Most cryptocurrencies other than the main coin of a chain are smart contracts. See [how to create an ERC-20 token](/blogs/create-erc20-token).
- **Decentralized exchanges.** Swap tokens directly from your wallet.
- **Lending.** Deposit tokens to earn interest, or borrow against them. See [what DeFi is](/blogs/what-is-defi).
- **Stablecoins.** Tokens that track a currency.
- **NFTs.** Records of who owns a unique item. See [what an NFT is](/blogs/what-is-an-nft).
- **DAOs.** Groups that vote and manage shared money through code. See [what a DAO is](/blogs/what-is-a-dao).
- **Games and collectibles**, insurance that pays automatically, and supply chain records.

## The limits and risks

### Bugs are permanent and public

A mistake in a normal app can be fixed with an update. A deployed smart contract cannot simply be edited. Because the code is public and often holds money, attackers study it for errors. Hundreds of millions have been lost to contract bugs. A famous type is explained in [reentrancy attacks](/blogs/reentrancy-attack-explained).

Serious projects use careful testing, independent audits, and bug rewards before launch. See [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

### They cannot see the outside world

A contract can only read data that is on its own blockchain. It cannot check a stock price, the weather, or a football score. To get such data it needs an **oracle**, a service that brings outside data onto the chain. See [blockchain oracles explained](/blogs/blockchain-oracles-explained).

### They do not run by themselves

A contract only runs when someone sends a transaction to it. It cannot wake up at midnight and do something. Scheduled actions need an outside service to make the call.

### "Smart contract" is not a legal contract

The name is misleading. It is not smart and it is not always a contract in the legal sense. It is code that moves digital assets by fixed rules. Whether it counts as a legal agreement depends on the country and the case.

### Fees and speed

Every action costs gas, and busy networks get expensive. [Layer 2 networks](/blogs/what-is-layer-2) reduce the cost a lot.

## Which blockchains support smart contracts?

- **Ethereum:** the first and largest. Contracts are written in Solidity or Vyper.
- **EVM-compatible chains:** Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, and others run the same contract code as Ethereum.
- **Solana:** contracts are called programs and are written mostly in Rust.
- **Cosmos chains:** use CosmWasm, written in Rust.
- **Others:** Sui and Aptos use the Move language. Cardano uses Plutus and Aiken.

Bitcoin has a limited scripting language. It was designed mainly for payments, not for general programs.

## Can a smart contract be updated?

Not directly, but developers use a pattern called a **proxy**. Users talk to a small, fixed contract that forwards each call to a second contract holding the logic. The owner can point the proxy to a new logic contract. This allows fixes, and it also means users must trust whoever controls the upgrade. See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).

## FAQ

### What is a smart contract in simple words?

It is a program on a blockchain that carries out an agreement automatically. If the conditions in the code are met, it acts, with no middleman.

### Who invented smart contracts?

Computer scientist Nick Szabo described the idea in the 1990s. Ethereum, launched in 2015, was the first blockchain to make general smart contracts practical.

### Are smart contracts safe?

The blockchain running them is very hard to attack. The contract code itself is as safe as its author made it. Use contracts that have been audited and have a long record of working without problems.

### Do smart contracts cost money to use?

Yes. Each transaction that changes data costs a gas fee paid in the chain's own coin. Reading data from a contract is free.
