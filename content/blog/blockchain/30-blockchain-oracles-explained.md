---
title: What Is a Blockchain Oracle? Price Feeds and Risks Explained
description: An oracle brings outside data such as prices onto a blockchain. Learn how oracles work, how to read a price feed safely, and oracle attacks.
tags: Oracles, DeFi, Smart Contract Security
keywords: what is a blockchain oracle, blockchain oracle explained, chainlink price feed, oracle problem, oracle manipulation attack, how do oracles work
cover: hero satellite-dish chart-candlestick clock triangle-alert link
---

A **blockchain oracle** is a service that brings data from outside a blockchain into it, so smart contracts can use that data. A smart contract cannot check a price, the weather, or a sports result by itself, because it can only read what is already on its own chain. Oracles fill that gap. The most common use is **price feeds** for DeFi, and a faulty or manipulated oracle is one of the leading causes of DeFi losses.

## Why smart contracts cannot fetch data themselves

A blockchain must be **deterministic**: every node runs every transaction and must get the same result.

If a contract could call a web API, each node would call it at a slightly different time and might get a different answer, or no answer. The nodes could not agree, and the chain would break.

So contracts are sealed off from the outside world. Data must be **written on-chain by a transaction** before a contract can read it. An oracle is whatever does that writing.

## The oracle problem

A blockchain removes the need to trust a single party. If a contract holding 100 million in value relies on one server to tell it the price of ETH, then that server is the single point of trust, and the weakest point. Whoever controls it controls the contract.

This is called the **oracle problem**: how do you bring in outside data without bringing back a trusted middleman?

## How decentralized oracles work

The standard answer uses many independent sources and many independent reporters.

1. **Many data sources.** Prices are collected from many exchanges and data companies.
2. **Many nodes.** A network of independent node operators each fetch the data.
3. **Aggregation.** Their answers are combined, usually by taking the **median**, so a few wrong or dishonest reports do not change the result.
4. **On-chain delivery.** The combined value is written to a contract that other contracts can read.
5. **Incentives.** Operators earn fees and can lose reputation or stake for bad data.

**Chainlink** is the most used network of this kind. Others include Pyth, RedStone, API3, and Chronicle.

### Push and pull

| | Push oracle | Pull oracle |
|---|---|---|
| How it works | The oracle writes updates on-chain on a schedule | Signed prices are published off-chain. The user's transaction brings the latest one on-chain |
| Updates | When the price moves by a set percentage, or after a set time | On demand, as often as needed |
| Who pays gas for updates | The oracle network | The user |
| Example | Chainlink Data Feeds | Pyth |

A push feed updates on two triggers: a **deviation threshold** (for example the price moved 0.5 percent) and a **heartbeat** (for example at least once an hour). Between updates, the on-chain price can be slightly old.

## Reading a price feed in Solidity

This uses the Chainlink price feed interface. Feed addresses differ per network and asset. Take them from the official documentation.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract PriceConsumer {
    AggregatorV3Interface public immutable feed;
    uint256 public constant MAX_AGE = 1 hours;      // set to the feed's heartbeat plus a margin

    error StalePrice(uint256 updatedAt);
    error InvalidPrice(int256 answer);

    constructor(address feedAddress) {
        feed = AggregatorV3Interface(feedAddress);
    }

    /// Returns the price with 18 decimals
    function getPrice() public view returns (uint256) {
        (, int256 answer, , uint256 updatedAt, ) = feed.latestRoundData();

        if (answer <= 0) revert InvalidPrice(answer);
        if (block.timestamp - updatedAt > MAX_AGE) revert StalePrice(updatedAt);

        uint8 feedDecimals = feed.decimals();
        return uint256(answer) * 10 ** (18 - feedDecimals);
    }
}
```

### The checks that matter

Many hacked contracts read the price and skipped these.

- **Check that the price is positive.** A zero or negative answer means something is wrong.
- **Check that the price is fresh.** Compare `updatedAt` with the current time. If the feed stopped updating, do not use the old value.
- **Handle decimals.** Feeds use different decimals, often 8 for USD pairs and 18 for ETH pairs. Getting this wrong makes a price wrong by a factor of billions.
- **On layer 2, check the sequencer.** If the layer 2 sequencer was offline, prices may be old. Chainlink provides a sequencer uptime feed for this. See [what layer 2 is](/blogs/what-is-layer-2).
- **Decide what happens on failure.** Usually the safest action is to pause the function, not to fall back to a guess.

## The classic mistake: using a DEX price as an oracle

The simplest "oracle" is to read the current price from a decentralized exchange pool.

```solidity
// DANGEROUS: the spot price of a pool can be moved within one transaction
function badPrice() public view returns (uint256) {
    (uint112 reserveToken, uint112 reserveUsdc, ) = pair.getReserves();
    return uint256(reserveUsdc) * 1e18 / reserveToken;
}
```

A pool's price depends only on the tokens inside it at that moment. Anyone with enough capital can change it, and with a **flash loan** an attacker can borrow that capital for a single transaction with no collateral.

### How an oracle manipulation attack works

1. Take a flash loan of a large amount of USDC.
2. Buy token X in a small pool. The pool price of X jumps far above its real price.
3. Deposit token X as collateral in a lending protocol that reads the price from that pool. The protocol believes the collateral is worth much more than it is.
4. Borrow everything the protocol will lend against it.
5. Sell token X back, repay the flash loan, and keep the borrowed assets.

All of this happens in one transaction. Many DeFi protocols lost funds this way, including the large Mango Markets incident on Solana in 2022, where the price of a thinly traded token was pushed up to borrow against it.

For how pool pricing works, see [what DeFi is](/blogs/what-is-defi).

### Time-weighted average price (TWAP)

A **TWAP** is the average price over a period, such as 30 minutes. To move it, an attacker must hold the price away from its true value for many blocks, which costs real money because other traders will trade against them.

A TWAP is much harder to manipulate than a spot price. Its weaknesses are that it reacts slowly to real price changes, and that it is still unsafe for tokens with very little liquidity.

## Other kinds of oracle data

- **Verifiable randomness (VRF).** Random numbers with a proof. See [randomness in smart contracts](/blogs/smart-contract-randomness).
- **Automation.** Contracts cannot start themselves. Services watch for conditions and send the transaction that triggers an action, such as a liquidation.
- **Cross-chain messages.** Proving on one chain that something happened on another. See [blockchain bridges explained](/blogs/blockchain-bridges-explained).
- **Proof of reserve.** Reporting that the assets backing a token really exist.
- **Any API.** Sports scores, flight delays, weather for insurance.
- **Optimistic oracles.** Someone proposes an answer, and it is accepted unless challenged within a time window. UMA uses this for questions that need human judgment, such as prediction markets.

## The remaining trust

Decentralized oracles reduce trust. They do not remove it.

- **The node operators** could act together.
- **The data sources** could be wrong.
- **The feed's settings** can often be changed by a small group of signers.
- **The underlying market** for a token can be too small to give a meaningful price.
- **Extreme events** can break assumptions. Some feeds have minimum and maximum values built in. When the LUNA token collapsed in 2022, one feed stopped at its minimum price, which was far above the real price, and protocols using it took losses.

## A checklist for using oracles

1. Use an established oracle network. Never use a single DEX spot price.
2. Check for a positive answer and a recent timestamp.
3. Handle decimals with care, and test with real feed values on a fork.
4. Check sequencer uptime on layer 2 networks.
5. Know the feed's heartbeat and deviation settings.
6. Be careful with tokens that have low liquidity. Limit how much can be borrowed against them.
7. Consider a second oracle as a cross-check, and pause if they disagree widely.
8. Decide in advance what the contract does when the oracle fails.
9. Have an emergency pause controlled by a multisig.

More defensive patterns are in [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## FAQ

### What is an oracle in blockchain in simple words?

It is a service that feeds real-world data, such as prices, into a blockchain so that smart contracts can use it.

### Why can a smart contract not call an API?

Every node must get exactly the same result when running a transaction. An outside API could give different answers at different times, so the nodes could not agree.

### Is Chainlink a blockchain?

No. Chainlink is a network of oracle nodes that delivers data to many blockchains. It has its own token, LINK, used to pay node operators.

### What is an oracle manipulation attack?

An attacker changes the price that a protocol reads, often by moving a small trading pool with a flash loan, then uses the false price to borrow or trade at the protocol's expense.
