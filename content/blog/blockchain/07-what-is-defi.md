---
title: What Is DeFi? Decentralized Finance Explained for Beginners
description: DeFi offers lending, trading, and earning without banks, using smart contracts. Learn how it works, the main apps, and the real risks.
tags: DeFi, Ethereum, Finance
keywords: what is defi, defi explained, decentralized finance, how does defi work, defi for beginners, defi risks
cover: hero landmark arrow-left-right coins percent wallet
---

**DeFi** stands for **decentralized finance**. It is a set of financial services, such as trading, lending, borrowing, and earning interest, that run on smart contracts on a blockchain instead of through banks or brokers. Anyone with a crypto wallet can use them. No account application is needed, and the code holds and moves the money according to public rules.

## DeFi vs traditional finance

| | Traditional finance | DeFi |
|---|---|---|
| Who runs it | Banks, brokers, exchanges | Smart contracts |
| Who holds your money | The bank | You, in your own wallet, or a contract |
| Access | Account, ID checks, approval | A wallet and an internet connection |
| Opening hours | Business days | Always |
| Rules | Private policies | Public code anyone can read |
| If something goes wrong | Support, insurance, courts | Usually nobody to call |
| Speed of settlement | Hours to days | Seconds to minutes |

The last row of protections matters. DeFi removes the middleman, and with it the person who could fix your mistake.

## How DeFi works

Three building blocks make DeFi possible:

1. **A blockchain that runs programs**, such as Ethereum. See [what blockchain is](/blogs/what-is-blockchain).
2. **Smart contracts** that hold funds and apply rules. See [what a smart contract is](/blogs/what-is-a-smart-contract).
3. **Wallets** that let users sign transactions. See [how crypto wallets work](/blogs/how-crypto-wallets-work).

A DeFi app, often called a **protocol**, is a set of smart contracts with a website on top. When you click "Swap" or "Deposit", your wallet asks you to sign a transaction that calls the contract.

Because contracts can call each other, protocols combine like building blocks. A lending app can use a price feed from another protocol and tokens from a third.

## The main types of DeFi apps

### Decentralized exchanges (DEXs)

A DEX lets you swap one token for another directly from your wallet. Most use an **automated market maker (AMM)** in place of an order book.

An AMM holds a **liquidity pool**: two tokens locked in a contract. The simplest pricing rule is:

```text
x × y = k
```

Here `x` and `y` are the amounts of each token and `k` stays constant. If you take token A out, you must put token B in so that the product stays the same. Taking more of A makes it more expensive.

```python
# A pool with 10 ETH and 20,000 USDC
eth, usdc = 10, 20_000
k = eth * usdc                    # 200,000

# You want to buy 1 ETH
new_eth = eth - 1                 # 9
new_usdc = k / new_eth            # 22,222.22
cost = new_usdc - usdc
print(round(cost, 2))             # 2222.22 USDC, not 2000
```

The starting price was 2,000 USDC per ETH, but you paid 2,222. That difference is **price impact**, and it grows with the size of your trade relative to the pool. Real pools also charge a small fee.

Examples: Uniswap, Curve, PancakeSwap.

### Lending and borrowing

Users deposit tokens into a pool and earn interest. Others borrow from the pool and pay interest. There is no credit check, so loans are **over-collateralized**: to borrow 100 units of value you might deposit 150.

If the value of your collateral falls too low, anyone can repay part of your loan and take your collateral at a discount. This is **liquidation**.

Interest rates change automatically. When most of a pool is borrowed, rates rise to attract deposits.

Examples: Aave, Compound, Morpho.

### Stablecoins

Tokens designed to hold a steady value, most often one US dollar. They are the money of DeFi: people trade with them, lend them, and save in them. See [stablecoins explained](/blogs/stablecoins-explained).

### Liquid staking

When you stake ETH to help secure Ethereum, it is locked. Liquid staking protocols give you a token that represents your staked ETH, which you can still trade or use elsewhere. See [what crypto staking is](/blogs/what-is-crypto-staking).

Examples: Lido, Rocket Pool.

### Derivatives and other products

- **Perpetual futures:** bet on prices with leverage.
- **Yield aggregators:** move deposits between protocols to find the best return.
- **Bridges:** move tokens between chains. See [blockchain bridges explained](/blogs/blockchain-bridges-explained).
- **Prediction markets**, on-chain insurance, and tokenized real-world assets such as government bonds.

## Key terms

| Term | Meaning |
|---|---|
| **TVL** | Total value locked: the value of all assets deposited in a protocol |
| **APY** | Yearly return including compounding |
| **Liquidity provider (LP)** | Someone who deposits tokens into a pool and earns fees |
| **Slippage** | The difference between the price you expected and the price you got |
| **Impermanent loss** | A loss LPs take when the two token prices move apart |
| **Gas** | The network fee for each transaction. See [what gas fees are](/blogs/what-is-gas-fee) |
| **Yield farming** | Moving funds between protocols to earn the highest rewards |

## The real risks of DeFi

DeFi can lose your money in ways a bank account cannot. Know these before depositing anything.

- **Smart contract bugs.** A flaw in the code can let an attacker drain the funds. Very large sums have been lost this way. See [reentrancy attacks](/blogs/reentrancy-attack-explained).
- **Scams and rug pulls.** A team launches a token, attracts deposits, and takes the money. Fake copies of real websites steal wallet approvals.
- **Liquidation.** A fast price drop can sell your collateral at a loss.
- **Impermanent loss.** Providing liquidity can return less than simply holding the two tokens.
- **Stablecoin failure.** A stablecoin can lose its link to the dollar. Some have collapsed completely.
- **Oracle manipulation.** If a protocol reads a price that can be pushed around, attackers can borrow against inflated collateral. See [blockchain oracles explained](/blogs/blockchain-oracles-explained).
- **Admin keys.** Many protocols can be changed by their team. If those keys are stolen or misused, users lose.
- **User error.** A wrong address, a lost seed phrase, or a signed malicious approval cannot be reversed.
- **Legal uncertainty.** Rules differ by country and are changing.

A very high advertised return is not a gift. It is payment for a risk, and often the risk is not obvious.

## How to try DeFi safely

1. **Start with an amount you can afford to lose completely.**
2. **Use well-known protocols** that have run for years and have been audited several times.
3. **Type the website address yourself** or use a saved bookmark. Do not click links from ads or messages.
4. **Read what you sign.** If a wallet prompt asks for unlimited approval of a token, understand why.
5. **Use a separate wallet** for experiments, not the one holding your savings.
6. **Remove old approvals** from time to time with a token approval checker.
7. **Try a test network or a layer 2 first.** Fees are low and mistakes are cheap. See [what layer 2 is](/blogs/what-is-layer-2).
8. **Keep records.** Many countries tax crypto trades and income.

## FAQ

### What does DeFi stand for?

Decentralized finance. It means financial services run by smart contracts on a blockchain, without banks or brokers.

### Is DeFi safe?

It carries more risk than a regulated bank. Contract bugs, scams, price crashes, and user mistakes can all cause total loss, and there is usually no insurance or support. Established, audited protocols lower the risk but do not remove it.

### How do people earn money in DeFi?

By lending tokens for interest, providing liquidity to exchanges for trading fees, staking, and receiving reward tokens. Each method has its own risks.

### What is the difference between DeFi and crypto?

Crypto is the broad term for digital assets on blockchains. DeFi is one use of crypto: financial apps built from smart contracts.
