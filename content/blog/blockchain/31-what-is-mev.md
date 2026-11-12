---
title: What Is MEV in Crypto? Sandwich Attacks and How to Avoid Them
description: MEV is profit made by reordering transactions in a block. Learn how front-running and sandwich attacks work and how to protect your trades.
tags: MEV, DeFi, Transactions
keywords: what is mev, mev explained, maximal extractable value, sandwich attack, front running crypto, mev protection, mev bot
cover: hero sandwich bot arrow-left-right timer coins
---

**MEV** stands for **maximal extractable value**. It is the profit that someone can make by choosing which transactions go into a block and in what order. The best-known form is the **sandwich attack**: a bot sees your pending trade, buys before you to push the price up, lets your trade go through at the worse price, and sells right after. You can avoid most of it by setting a low slippage limit and sending trades through a private or MEV-protected route.

The term used to be "miner extractable value". After Ethereum moved to proof of stake, validators replaced miners, and the name changed.

## Why MEV exists

Three facts make MEV possible:

1. **Pending transactions are public.** When you send a transaction, it waits in the **mempool**, where anyone can see it before it is confirmed.
2. **The block producer chooses the order.** There is no rule that says first come, first served.
3. **Order changes outcomes.** On a decentralized exchange, every trade moves the price for the next one.

So someone who can see your trade in advance and place their own around it can profit from it. For how exchange pricing works, see [what DeFi is](/blogs/what-is-defi).

## The main types of MEV

### Arbitrage

A token costs 2,000 on one exchange and 2,010 on another. A bot buys on the first and sells on the second in one transaction, keeping the difference.

This is generally seen as **useful**. It keeps prices in line across markets and does not take money from a specific user.

### Liquidations

When a borrower's collateral falls below the required level, anyone may repay the loan and receive the collateral at a discount. Bots compete to be first.

This is also **useful**: lending protocols depend on fast liquidations to stay solvent.

### Front-running

A bot sees a profitable pending transaction and sends the same one with a higher fee, so that it lands first and takes the profit.

### Sandwich attacks

The form that hurts normal users most. Explained in detail below.

### Back-running

A bot places its transaction right after a large trade, to capture the arbitrage that trade creates. It does not worsen the user's price.

### Others

- **JIT (just-in-time) liquidity:** adding liquidity to a pool for a single block to collect the fees of a large trade.
- **NFT sniping:** buying a mispriced item the moment it is listed.

| Type | Hurts users? | Useful to the market? |
|---|---|---|
| Arbitrage | No | Yes |
| Liquidation | Not directly | Yes |
| Back-running | No | Neutral to useful |
| Front-running | Yes | No |
| Sandwich | Yes | No |

## How a sandwich attack works

You want to buy token X with 10 ETH. Your wallet sets a **slippage tolerance** of 3 percent, which means you accept up to 3 percent fewer tokens than quoted.

1. **You send the trade.** It appears in the public mempool.
2. **A bot sees it.** It calculates how far it can push the price before your trade would fail.
3. **Front-run.** The bot buys token X just before you. The price rises.
4. **Your trade runs** at the higher price. You receive close to 3 percent fewer tokens. Your purchase pushes the price up further.
5. **Back-run.** The bot sells its tokens immediately after, at the price you raised.

```text
Block order:
  1. Bot buys X        (price goes up)
  2. You buy X         (you pay more, price goes up again)
  3. Bot sells X       (bot keeps the difference)
```

The bot's profit comes from your worse price. The three transactions sit next to each other in the same block, with yours in the middle. That is the "sandwich".

A small calculation with a simple pool:

```python
def swap(reserve_in, reserve_out, amount_in, fee=0.003):
    amount_in = amount_in * (1 - fee)
    out = reserve_out * amount_in / (reserve_in + amount_in)
    return out, reserve_in + amount_in, reserve_out - out

eth, tokens = 1_000, 2_000_000        # pool: 1,000 ETH and 2,000,000 X

# Without a sandwich: you swap 10 ETH
you_fair, _, _ = swap(eth, tokens, 10)

# With a sandwich: the bot swaps 20 ETH first
bot_tokens, eth1, tokens1 = swap(eth, tokens, 20)
you_got, eth2, tokens2 = swap(eth1, tokens1, 10)
bot_eth, _, _ = swap(tokens2, eth2, bot_tokens)

print(f"You without sandwich: {you_fair:,.0f} X")
print(f"You with sandwich:    {you_got:,.0f} X  ({(1 - you_got / you_fair):.1%} fewer)")
print(f"Bot profit:           {bot_eth - 20:.3f} ETH")
```

You receive roughly 4 percent fewer tokens, and the bot ends with more ETH than it started with, before gas costs.

## How to protect yourself

### 1. Set a low slippage tolerance

Slippage is the room you give an attacker. With 0.5 percent slippage, a bot can take at most 0.5 percent. With 10 percent, it can take 10 percent.

- **Major tokens:** 0.1 to 0.5 percent is normally enough.
- **Volatile or small tokens:** you may need more, which is exactly why they are sandwiched more often.

If the price moves beyond your limit, the trade fails and you lose only the gas fee.

### 2. Use a private or MEV-protected route

These send your transaction straight to block builders, so it is never visible in the public mempool.

- **MEV-protected RPC endpoints**, such as Flashbots Protect and MEV Blocker. You add one as a network in your wallet.
- **Wallets with built-in protection.** Several wallets now route swaps privately by default.

Some of these services also return part of the back-running profit to you.

### 3. Use intent-based or batch-auction exchanges

Services such as CoW Swap, UniswapX, and 1inch Fusion do not send your trade to a pool directly. You sign an **intent** ("I want at least this many tokens"), and professional **solvers** compete to fill it at the best price. Batch auctions settle many orders at one price, which leaves nothing to sandwich.

### 4. Split large trades

A smaller trade moves the price less and offers less profit to a bot. Trade in pools with deep liquidity when you can.

### 5. Use a layer 2

Many layer 2 networks have a single sequencer that orders transactions as they arrive and has no public mempool, which makes classic sandwiching harder. MEV still exists there in other forms. See [what layer 2 is](/blogs/what-is-layer-2).

## How the MEV system works on Ethereum

MEV has become an organized market with several roles:

- **Searchers** run bots that find opportunities and build **bundles**: groups of transactions that must be included together in a fixed order.
- **Builders** assemble complete blocks from bundles and normal transactions, trying to make the most valuable block.
- **Relays** pass blocks from builders to validators.
- **Validators (proposers)** pick the block that pays them the most, using software called **MEV-Boost**.

This design is called **proposer-builder separation (PBS)**. Most Ethereum blocks are built this way. Competition among searchers means most of the profit is bid away and ends up with validators, which raises staking rewards. See [what crypto staking is](/blogs/what-is-crypto-staking).

## Is MEV bad?

It depends on the type.

**Harms:**

- Users get worse prices through sandwiches and front-running.
- Bidding wars between bots have at times raised gas fees for everyone.
- Block building is concentrated in a few builders, which raises censorship concerns.
- If the MEV in one block is very large, validators have an incentive to reorganize the chain to capture it.

**Benefits:**

- Arbitrage keeps prices consistent.
- Liquidations keep lending markets healthy.
- MEV income adds to validator rewards and so to network security.

The goal of most research is not to remove MEV, which is not possible, but to reduce the harmful kinds and share the rest fairly.

## MEV for developers

If you write contracts, design them so users are not exposed.

- **Always take a minimum output and a deadline** in swap functions, and never hard-code them as zero.

```solidity
// Bad: accepts any price, at any time
router.swapExactTokensForTokens(amountIn, 0, path, msg.sender, type(uint256).max);

// Good: the caller sets a minimum and a deadline
router.swapExactTokensForTokens(amountIn, minAmountOut, path, msg.sender, deadline);
```

- **Do not swap inside a function anyone can trigger** without price limits. Bots will sandwich your contract's own trades, such as automatic reward conversions.
- **Use commit-reveal** for actions where being copied is a problem, such as bids. See [randomness in smart contracts](/blogs/smart-contract-randomness).
- **Do not depend on the spot price of a pool.** See [blockchain oracles explained](/blogs/blockchain-oracles-explained).
- **Assume every pending transaction is visible** and can be copied or placed between others.

## Research directions

- **Encrypted mempools:** transactions stay hidden until their order is fixed.
- **Fair ordering rules** enforced by the protocol.
- **Order flow auctions:** searchers pay users for the right to back-run them.
- **Enshrined PBS:** moving builder and proposer separation into Ethereum's core protocol.
- **App-level solutions:** exchanges that capture MEV for their own liquidity providers.

## FAQ

### What is MEV in simple words?

It is extra profit made by controlling the order of transactions in a block, such as trading just before and after someone else's trade.

### Is MEV illegal?

It is not clearly illegal in most places, and arbitrage and liquidation are normal market activity. Sandwich attacks resemble front-running, which is illegal in traditional markets, and regulators are beginning to examine it.

### How do I know if I was sandwiched?

Look at your transaction on a block explorer. If the same address traded the same token immediately before and after you in the same block, you were sandwiched. Some tools check this for you.

### Does a low slippage setting stop MEV?

It limits how much can be taken from you. It does not hide your transaction. For better protection, combine low slippage with a private transaction route.
