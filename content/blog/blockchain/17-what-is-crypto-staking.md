---
title: What Is Staking in Crypto? How It Works, Rewards, and Risks
description: Staking means locking coins to help secure a proof-of-stake blockchain and earning rewards. Learn the ways to stake and the risks of each.
tags: Staking, Proof of Stake, Crypto Basics
keywords: what is staking, what is staking in crypto, crypto staking explained, staking income, how does staking work, liquid staking
cover: hero lock coins percent shield-check timer
---

**Staking** is locking up cryptocurrency to help run and secure a proof-of-stake blockchain. In return, the network pays you rewards, usually in the same coin. Your staked coins act as a deposit: validators who follow the rules earn rewards, and validators who cheat can lose part of their deposit. Staking is how networks such as Ethereum, Solana, Cardano, and Cosmos stay secure.

This article explains how staking works. It is not financial advice.

## Why staking exists

A blockchain needs honest participants to check transactions and add blocks. Proof-of-stake networks get honesty through money at risk:

- To take part, a **validator** must lock up coins.
- Good behavior earns rewards.
- Bad behavior is punished by **slashing**: part of the deposit is destroyed.

An attacker would need to buy and risk a huge amount of coins, which makes attacks very costly. The alternative system, where miners spend electricity, is compared in [proof of work vs proof of stake](/blogs/proof-of-work-vs-proof-of-stake).

## How staking works, step by step

1. **Coins are locked** in the network's staking system.
2. **A validator runs software** on a computer that stays online all the time.
3. **The network picks validators** to propose new blocks. More stake means a higher chance of being picked.
4. **Other validators check and vote** on each block.
5. **Rewards are paid** to validators that did their job.
6. **Penalties apply** to validators that are offline (small) or that act dishonestly (large).

Most people do not run a validator. They give their coins to one, as described below.

## Where the rewards come from

- **New coins** created by the network (inflation).
- **Transaction fees** paid by users.

Reward rates differ by network and change over time. On many networks, the rate goes **down** as more coins are staked, because the rewards are shared among more participants.

One point is often missed: if rewards come mostly from new coins, everyone who does not stake has their share of the total supply reduced. Part of the "yield" is simply keeping up with inflation. The real return is the reward rate minus the inflation rate.

A simple calculation:

```python
staked = 10          # coins
reward_rate = 0.04   # 4% per year
inflation = 0.015    # 1.5% new supply per year

reward = staked * reward_rate
real_rate = (1 + reward_rate) / (1 + inflation) - 1

print(f"Reward after one year: {reward} coins")       # 0.4 coins
print(f"Real return: {real_rate:.2%}")                # about 2.46%
```

Rewards are paid in the coin itself. If the coin's price falls 50 percent, a 4 percent reward does not protect you.

## Ways to stake

### 1. Run your own validator (solo staking)

You lock the required amount, such as 32 ETH on Ethereum, and run the validator software on your own machine.

- **For:** full control, full rewards, best for the network's decentralization.
- **Against:** needs capital, technical skill, and a machine that is online around the clock. Mistakes can lead to penalties.

### 2. Delegate to a validator

On networks such as Solana, Cardano, and Cosmos chains, you **delegate** your coins to a validator from your own wallet. The coins stay yours, and the validator takes a commission from the rewards.

- **For:** simple, no minimum on most networks, you keep custody.
- **Against:** if your validator misbehaves, you may share the penalty. Choose one with a good record.

### 3. Liquid staking

A liquid staking protocol stakes your coins and gives you a **liquid staking token (LST)** that represents your stake plus its rewards. You can sell that token or use it in DeFi while the original coins stay staked.

- **For:** no lock-up in practice, no minimum, the token can be used elsewhere.
- **Against:** smart contract risk, and the token can trade below the value of the coins behind it during market stress.

Examples: Lido (stETH), Rocket Pool (rETH), Jito (JitoSOL).

### 4. Stake through an exchange

A centralized exchange stakes for you with one click.

- **For:** the easiest option.
- **Against:** the exchange holds your coins. You depend on the company staying honest, solvent, and allowed to operate in your country. It also takes a larger cut.

### 5. Staking pools

Several users combine funds to reach the validator minimum and share the rewards. Most liquid staking protocols are pools.

| Method | Minimum | You hold the keys | Technical skill | Main risk |
|---|---|---|---|---|
| Solo validator | High | Yes | High | Your own mistakes |
| Delegation | Very low | Yes | Low | Validator choice |
| Liquid staking | Very low | Yes, of the LST | Low | Smart contract, price gap |
| Exchange | Very low | No | None | The exchange |

## The risks of staking

- **Price risk.** The largest risk. Rewards are small next to the price swings of most coins.
- **Lock-up and unbonding periods.** Many networks make you wait before you can withdraw: about 21 days on Cosmos chains, a few days on Solana, and a queue of variable length on Ethereum. You cannot sell during that time.
- **Slashing.** If the validator you use breaks the rules, part of the stake can be destroyed. On reputable validators this is rare.
- **Downtime penalties.** A validator that is offline earns less or loses a little.
- **Smart contract risk.** Liquid staking and pools depend on contracts that can have bugs.
- **Custody risk.** With an exchange, a failure or freeze of the company can lock your coins.
- **Scams.** Fake "staking" sites and tokens promise very high returns and steal deposits. See [how crypto wallets work](/blogs/how-crypto-wallets-work) for how to protect your keys.
- **Tax.** Many countries treat staking rewards as income when received.

## Real staking vs "staking" as a marketing word

The word is used loosely. Be careful to tell these apart:

- **Protocol staking** secures a proof-of-stake blockchain. Rewards come from the network itself.
- **Token "staking" in an app** often means only that you lock a token in a contract and receive more of the same token. That is a rewards program, not network security. The return comes from new tokens being printed, and the price often falls as fast as the rewards arrive.

A promised return far above normal network rates is a warning sign. Ask: where does the money come from?

## Restaking

**Restaking** lets already-staked coins secure additional services at the same time, earning extra rewards and taking on extra slashing conditions. EigenLayer on Ethereum introduced the idea. It raises both return and risk, since one failure can affect several systems together.

## How to choose a validator

If you delegate, look at:

- **Uptime:** close to 100 percent.
- **Commission:** reasonable, and not suddenly changed in the past.
- **Slashing history:** none.
- **Size:** avoid the very largest. Spreading stake across many validators keeps the network decentralized.
- **Identity:** a known team with a public presence.

## How to start

1. Pick a coin you already intend to hold. Do not buy a coin only for its staking rate.
2. Read that network's rules: minimum, unbonding period, slashing.
3. Choose a method from the table above.
4. Start with a small amount and make one full round trip: stake, receive a reward, unstake, withdraw.
5. Keep a record of rewards for tax purposes.

## FAQ

### What is staking in simple words?

It is locking up your coins to help a blockchain run securely, and receiving rewards in return, similar to interest.

### Is staking safe?

Staking on a major network through a reputable validator carries low technical risk, but your coins can still fall in price, and they may be locked when you want to sell. Exchanges and smart contracts add their own risks.

### Can I lose money by staking?

Yes. The coin's price can fall, a validator can be slashed, a contract can be hacked, or a platform can fail. Rewards do not guarantee a profit.

### What is the difference between staking and mining?

Mining secures a proof-of-work chain with computing power and electricity. Staking secures a proof-of-stake chain with locked coins. Both earn rewards for helping to add blocks.
