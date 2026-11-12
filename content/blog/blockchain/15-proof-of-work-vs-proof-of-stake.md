---
title: Proof of Work vs Proof of Stake: The Differences Explained
description: Proof of work secures a blockchain with computing power, proof of stake with locked coins. Compare energy, security, rewards, and attack costs.
tags: Consensus, Proof of Stake, Proof of Work
keywords: proof of stake vs proof of work, proof of work vs proof of stake, pow vs pos, proof of stake explained, proof of work explained, ethereum proof of stake
cover: versus pickaxe coins
---

**Proof of work (PoW)** and **proof of stake (PoS)** are two ways for a blockchain to decide who adds the next block and to make cheating expensive. In proof of work, **miners** spend electricity and hardware to solve a puzzle. In proof of stake, **validators** lock up coins as a deposit and lose them if they break the rules. Bitcoin uses proof of work. Ethereum has used proof of stake since September 2022.

## Why a consensus mechanism is needed

A blockchain has no central authority. Thousands of computers must agree on one history of transactions, even though some of them may lie.

The danger is the **Sybil attack**: one person creates millions of fake identities to outvote everyone. If voting were "one computer, one vote", this would be easy.

Both mechanisms solve this by linking voting power to something **scarce and costly**:

- **Proof of work:** computing power, which costs hardware and electricity.
- **Proof of stake:** coins, which cost money to buy and can be taken away.

For the wider picture, see [how blockchain works](/blogs/how-does-blockchain-work).

## How proof of work works

1. Miners collect pending transactions into a candidate block.
2. They search for a number, called a **nonce**, that makes the block's hash smaller than a target value. In practice, a hash that starts with many zeros.
3. A hash cannot be predicted, so the only method is to try billions of nonces. This takes huge computing power.
4. The first miner to find a valid nonce sends the block to the network.
5. Other nodes check it with a single hash calculation and accept it.
6. The winner earns newly created coins plus the transaction fees.

The puzzle is hard to solve and easy to check. Its difficulty adjusts automatically so that blocks arrive at a steady pace, about every 10 minutes on Bitcoin.

```python
import hashlib

def mine(block_data: str, difficulty: int) -> tuple[int, str]:
    prefix = "0" * difficulty
    nonce = 0
    while True:
        digest = hashlib.sha256(f"{block_data}{nonce}".encode()).hexdigest()
        if digest.startswith(prefix):
            return nonce, digest
        nonce += 1

nonce, digest = mine("block 1: Asha pays Ben 1", difficulty=5)
print(nonce, digest)   # takes about a million tries on average
```

Each extra zero makes the search 16 times harder. Bitcoin's real difficulty needs far more tries than any single computer could make, which is why mining uses warehouses of special machines.

**To attack** a proof-of-work chain, you need more than half of the total computing power. This is the **51% attack**. On Bitcoin that would need more hardware and electricity than any single actor is realistically able to gather.

## How proof of stake works

1. Participants lock up coins as a **stake**. On Ethereum, a validator deposits 32 ETH.
2. For each time slot, the protocol picks one validator at random to propose a block. More stake means a higher chance.
3. Other validators check the block and vote for it. These votes are called **attestations**.
4. When enough stake has voted, the block is accepted. After further rounds of voting it becomes **final**, meaning it cannot be reversed without destroying a large amount of stake.
5. Validators earn rewards for proposing and voting correctly.
6. Validators who break the rules, such as signing two different blocks for the same slot, are **slashed**: part of their stake is destroyed and they are removed.

There is no puzzle and no race. Security comes from the deposit that can be lost.

**To attack** a proof-of-stake chain, you would need to buy a very large share of all staked coins, which would push the price up as you buy. If the attack is detected, your stake can be slashed, and the community can remove the attacker's coins with a software change. An attacker's mining hardware in proof of work cannot be destroyed this way.

If you want to earn rewards yourself, see [what crypto staking is](/blogs/what-is-crypto-staking).

## Side-by-side comparison

| | Proof of work | Proof of stake |
|---|---|---|
| Who creates blocks | Miners | Validators |
| Scarce resource | Computing power and electricity | Locked coins |
| Hardware | Special mining machines (ASICs) | A normal computer |
| Energy use | Very high | Very low |
| Penalty for cheating | Wasted electricity | Stake is slashed |
| Cost to attack | 51% of computing power | A large share of all staked coins |
| Finality | Probabilistic: more blocks means more certain | Explicit finality after votes |
| Track record | Since 2009 | Newer at large scale |
| Examples | Bitcoin, Litecoin, Dogecoin, Monero | Ethereum, Solana, Cardano, Cosmos chains |

## Energy use

This is the most visible difference.

Proof of work uses electricity on purpose. The spending is what makes attacks costly. Bitcoin's yearly consumption is comparable to that of a mid-sized country.

Proof of stake needs only ordinary computers. When Ethereum moved from proof of work to proof of stake in the upgrade called **the Merge**, its energy use fell by about 99.95 percent.

Supporters of proof of work reply that much mining uses surplus or renewable energy, and that the energy cost is exactly what anchors the system to the physical world.

## Security arguments on both sides

**In favor of proof of work:**

- The longest history under real attack, with a simple design.
- The cost is external: you cannot fake burned electricity.
- New participants can verify the chain from the first block with no outside help.

**In favor of proof of stake:**

- Attackers can be punished directly by slashing.
- After an attack, the network can recover without the attacker keeping their advantage.
- Explicit finality gives a clear guarantee that a transaction is settled.

**Concerns about proof of work:**

- Mining concentrates in large pools and in regions with cheap power.
- Smaller proof-of-work chains have suffered real 51% attacks, because attackers can rent enough computing power.

**Concerns about proof of stake:**

- "The rich get richer": holders with more coins earn more rewards.
- Large staking services and exchanges can control a big share of stake.
- The design is more complex, with more room for software bugs.

Neither system is free of centralization pressure. They show it in different places.

## Other consensus mechanisms

- **Delegated proof of stake (DPoS).** Coin holders vote for a small group of block producers. Faster, with fewer participants.
- **Proof of authority (PoA).** A fixed list of approved, known validators. Used for private chains and test networks.
- **BFT-style proof of stake.** Validators vote in rounds and a block is final immediately when two thirds agree. Used by Cosmos chains through CometBFT, formerly Tendermint. I describe building this kind of system in [building BFT consensus in Go](/blogs/building-bft-consensus-in-go).
- **Proof of history.** Solana's shared clock for ordering transactions, used together with proof of stake. See [Ethereum vs Solana](/blogs/ethereum-vs-solana).

## Which one is better?

It depends on what the chain is for.

- For a system whose main goal is to be simple, slow to change, and tied to a physical cost, proof of work has the longest record. That fits Bitcoin's goals.
- For a platform that must run many applications with low energy use and fast finality, proof of stake is the common choice. Nearly all smart contract chains launched in recent years use it.

See [Bitcoin vs Ethereum](/blogs/bitcoin-vs-ethereum) for how these choices affect each network.

## FAQ

### What is the main difference between proof of work and proof of stake?

Proof of work secures the network with computing power and electricity. Proof of stake secures it with coins that validators lock up and can lose.

### Why did Ethereum switch to proof of stake?

To cut energy use by about 99.95 percent, to lower the amount of new ETH issued, and to prepare for later scaling upgrades.

### Is proof of stake less secure than proof of work?

They have different security models. Proof of work has a longer record. Proof of stake can punish attackers by destroying their deposit. Both are considered secure on large networks.

### Can I mine a proof-of-stake coin?

No. Proof-of-stake networks have no mining. You take part by staking coins, either by running a validator or by delegating to one.
