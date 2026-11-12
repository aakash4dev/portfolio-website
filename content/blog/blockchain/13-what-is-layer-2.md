---
title: What Is Layer 2 in Blockchain? Rollups Explained Simply
description: A layer 2 is a network built on top of a blockchain to make it faster and cheaper. Learn how optimistic and ZK rollups work and how they differ.
tags: Layer 2, Rollups, Scaling
keywords: what is layer 2 blockchain, layer 2 explained, optimistic rollup vs zk rollup, what is a rollup, layer 1 vs layer 2, ethereum layer 2
cover: hero layers zap blocks shrink shield-check
---

A **layer 2** (L2) is a separate network built on top of a main blockchain, the **layer 1** (L1), that processes transactions faster and at lower cost while relying on the layer 1 for security. The most common type is a **rollup**: it runs many transactions off the main chain, bundles them, and posts the compressed result back to it. Arbitrum, Optimism, Base, and zkSync are layer 2 networks on Ethereum.

## Why layer 2 networks exist

On Ethereum, every node runs every transaction. That keeps the network secure and open to anyone with a normal computer, but it limits capacity to roughly 15 to 30 transactions per second. When demand is high, users bid for space and fees rise. See [what gas fees are](/blogs/what-is-gas-fee).

Making blocks much bigger would raise the hardware needed to run a node and push out ordinary participants. So Ethereum took another path: keep layer 1 small and secure, and move most activity to layer 2.

A simple picture: a court handles final rulings, not every small deal. People settle everyday business between themselves and go to court only when there is a dispute. Layer 1 is the court. Layer 2 is where the daily business happens.

## Layer 1 vs layer 2

| | Layer 1 | Layer 2 |
|---|---|---|
| Role | Security, final settlement, data storage | Fast and cheap execution |
| Examples | Ethereum, Bitcoin | Arbitrum, Optimism, Base, zkSync, Starknet, Lightning |
| Fees | Higher | Much lower |
| Speed | Slower | Faster |
| Security | Its own validators | Inherited from layer 1 |

## How a rollup works

A rollup does three things:

1. **Executes transactions off-chain.** A node called the **sequencer** collects user transactions, orders them, and runs them.
2. **Bundles them.** Hundreds or thousands of transactions are compressed into one batch.
3. **Posts to layer 1.** The batch data and a summary of the new state are written to Ethereum.

```text
Users -> Sequencer -> Batch of 1,000 transactions
                          |
                          v
            One transaction on Ethereum (L1)
            containing compressed data + new state
```

The layer 1 fee for that one transaction is shared among all the users in the batch, so each pays a small part.

Because the data is on Ethereum, anyone can rebuild the full state of the layer 2 from layer 1 alone. This is what separates a real rollup from a separate chain with its own security.

The open question is: **how does layer 1 know the sequencer's result is correct?** The two kinds of rollup answer this differently.

## Optimistic rollups

An optimistic rollup **assumes the result is correct** unless someone proves otherwise.

- The sequencer posts the new state with no proof.
- A **challenge period** follows, usually about 7 days.
- During that time, anyone can submit a **fraud proof** showing that a transaction was run incorrectly.
- If the fraud proof is right, the bad result is cancelled and the party that posted it is penalized.

**Strengths:** simpler technology, fully compatible with existing Ethereum contracts and tools.

**Weakness:** withdrawing to layer 1 through the official bridge takes about 7 days, because the challenge period must pass. Third-party bridges offer faster exits for a fee.

**Examples:** Arbitrum, Optimism, Base.

## ZK rollups

A ZK (zero-knowledge) rollup **proves the result is correct** with math.

- The sequencer runs the transactions.
- A **prover** creates a **validity proof**: a small piece of cryptographic data showing that every transaction in the batch followed the rules.
- A smart contract on layer 1 checks the proof. Checking is fast and cheap, even though creating the proof is heavy work.
- If the proof is valid, the new state is final. No waiting period is needed.

**Strengths:** fast finality on layer 1, quick withdrawals, security based on math and not on someone watching.

**Weaknesses:** generating proofs needs a lot of computing power, and the technology is complex.

**Examples:** zkSync Era, Starknet, Linea, Scroll, Polygon zkEVM.

For the idea behind the proofs, see [zero-knowledge proofs explained](/blogs/zero-knowledge-proofs-explained). For a deeper technical look, see [ZK rollups in depth](/blogs/zero-knowledge-proofs-zk-rollups).

## Optimistic vs ZK rollups

| | Optimistic rollup | ZK rollup |
|---|---|---|
| How correctness is ensured | Fraud proofs if challenged | Validity proof for every batch |
| Assumption | At least one honest party is watching | The math is sound |
| Withdrawal to L1 | About 7 days | Minutes to hours |
| EVM compatibility | Excellent | Good and improving |
| Cost to operate | Lower | Higher, due to proving |
| Maturity | More mature | Advancing quickly |

## Where the data goes: blobs

Posting data to Ethereum used to be the largest cost for rollups. In March 2024, an Ethereum upgrade (EIP-4844) added **blobs**: a cheaper kind of data space made for rollups. Blob data is kept for about 18 days, which is long enough for anyone to check it, and is then removed.

After this upgrade, fees on major layer 2s fell sharply, often to around a cent or less per transaction.

## Other types of layer 2

- **Validium.** Like a ZK rollup, but the data is stored off-chain. Cheaper, with a weaker guarantee, since users depend on the data staying available.
- **State channels.** Two parties lock funds and exchange signed updates off-chain, settling on-chain at the end. Bitcoin's **Lightning Network** works this way.
- **Sidechains.** Independent blockchains with their own validators, connected by a bridge. They do **not** inherit layer 1 security, so strictly speaking they are not layer 2. Polygon PoS is a well-known example.
- **Layer 3.** A network built on top of a layer 2, often for one specific app.

## How to use a layer 2

1. **Add the network** to your wallet. Most wallets include the major ones.
2. **Move funds to it.** Use the network's official bridge, a trusted third-party bridge, or withdraw directly from an exchange that supports that network.
3. **Use apps as usual.** Your address is the same as on Ethereum. You still need a little ETH on the layer 2 for fees.

Always check which network you are on before sending. Funds on Arbitrum are not the same as funds on Ethereum mainnet until you bridge them. See [blockchain bridges explained](/blogs/blockchain-bridges-explained).

## For developers

Deploying to an EVM layer 2 is nearly the same as deploying to Ethereum. You change the network address in your config.

```bash
# Deploy the same contract to a layer 2 with Foundry
forge create src/Counter.sol:Counter \
  --rpc-url https://your-l2-rpc-url \
  --private-key "$PRIVATE_KEY"
```

Points to keep in mind:

- `block.number` and `block.timestamp` can behave differently from layer 1.
- Messages between layer 1 and layer 2 are not instant.
- A few low-level operations differ on some ZK rollups. Check the network's docs.

## The trade-offs and risks

- **Centralized sequencers.** Most rollups today run a single sequencer operated by the team. It cannot steal funds in a properly built rollup, but it can delay or reorder transactions. Decentralizing sequencers is in progress.
- **Upgrade keys.** Many rollups can be upgraded by a small group. This is a trust assumption.
- **Stage of maturity.** Some rollups still run with "training wheels": fraud or validity proofs that are not fully live or can be overridden. The site L2BEAT tracks the stage and risks of each network.
- **Split liquidity.** Assets are spread across many networks, and moving between them adds steps and bridge risk.

## FAQ

### What is layer 2 in simple words?

It is a faster, cheaper network that sits on top of a blockchain. It handles the transactions and records the results on the main chain for security.

### Is Polygon a layer 2?

Polygon PoS is a sidechain with its own validators, so it does not fully inherit Ethereum's security. Polygon also builds a ZK rollup, which is a true layer 2.

### Are layer 2 networks safe?

Well-built rollups inherit much of Ethereum's security, but most still have added trust points such as a single sequencer and upgrade keys. Check a network's risk summary before moving large amounts.

### Do I need ETH on a layer 2?

On most Ethereum layer 2s, yes. Fees are paid in ETH on that network, though the amounts are very small.
