---
title: Zero-Knowledge Proofs Explained With Simple Examples
description: A zero-knowledge proof lets you prove something is true without revealing why. Learn how ZK proofs work, SNARKs vs STARKs, and blockchain uses.
tags: Zero Knowledge, Cryptography, Privacy
keywords: zero knowledge proof, zero knowledge proof example, zero knowledge proofs explained, zero knowledge proof in blockchain, zk snark vs zk stark
cover: hero eye-off shield-check key-round lock circle-check-big
---

A **zero-knowledge proof (ZKP)** is a method that lets one party, the **prover**, convince another party, the **verifier**, that a statement is true without revealing any information beyond the fact that it is true. You can prove you know a password without showing the password, or prove you are over 18 without showing your date of birth. In blockchains, ZK proofs are used for privacy and for scaling.

## A simple example: the two balls

Your friend is color-blind. You have two balls, one red and one green, that look identical to them. You want to prove the balls are different colors **without saying which is which**.

1. Your friend holds one ball in each hand and shows you.
2. They put their hands behind their back and either swap the balls or do not.
3. They show you the balls again and ask: "Did I swap them?"
4. You can see the colors, so you answer correctly.

If the balls were the same color, you could only guess, and you would be right half the time. After 20 rounds with every answer correct, the chance that you were guessing is less than one in a million.

Your friend is now convinced the balls differ. They still do not know which is red. That is a zero-knowledge proof.

## Another example: the cave

A circular cave has one entrance and a locked door deep inside that connects the left path and the right path.

- Peggy claims she knows the secret word that opens the door.
- She walks in and takes a path at random. Victor does not see which.
- Victor then shouts which path she must come out of: left or right.
- If she knows the word, she can always come out the right way, passing through the door when needed.
- If she does not, she can only succeed half the time.

After many rounds, Victor is sure. He never hears the word.

## The three properties

Every zero-knowledge proof must have these:

| Property | Meaning |
|---|---|
| **Completeness** | If the statement is true, an honest prover can convince the verifier |
| **Soundness** | If the statement is false, a cheating prover cannot convince the verifier, except with a tiny chance |
| **Zero-knowledge** | The verifier learns nothing except that the statement is true |

## Interactive and non-interactive proofs

The two examples above are **interactive**: prover and verifier go back and forth many times.

On a blockchain that would be far too slow. Blockchains use **non-interactive** proofs: the prover creates one piece of data, and anyone can check it at any time, with no conversation. This is what makes ZK practical for smart contracts.

## How ZK proofs work in practice

Real systems do not use caves. The process looks like this:

1. **Write the statement as a circuit.** The rule you want to prove ("I know a number whose hash is H" or "these 1,000 transactions are all valid") is turned into a large set of math equations.
2. **The prover computes a proof** using their secret input, called the **witness**. This step is heavy and can take seconds to minutes.
3. **The verifier checks the proof.** This step is very fast, often a few milliseconds, and the proof is small.

That imbalance is the key feature: **hard to make, easy to check**.

A tiny circuit written in Circom, a language for ZK circuits:

```circom
pragma circom 2.0.0;

// Prove you know two numbers a and b that multiply to c,
// without revealing a or b.
template Multiplier() {
    signal input a;       // private
    signal input b;       // private
    signal output c;      // public

    c <== a * b;
}

component main = Multiplier();
```

If `c` is 221, a proof shows that you know two factors of 221 without saying they are 13 and 17. Real circuits have millions of such constraints.

## SNARKs and STARKs

These are the two main families of proof systems.

| | zk-SNARK | zk-STARK |
|---|---|---|
| Stands for | Succinct Non-interactive ARgument of Knowledge | Scalable Transparent ARgument of Knowledge |
| Proof size | Very small, a few hundred bytes | Larger, tens to hundreds of kilobytes |
| Verification cost on-chain | Low | Higher |
| Trusted setup | Needed in many versions | Not needed |
| Quantum resistance | Not in common versions | Yes, based on hash functions |
| Used by | Zcash, zkSync, Scroll, Linea | Starknet |

### What a trusted setup is

Many SNARK systems need a one-time ceremony that creates public parameters. The ceremony produces secret random values, often called **toxic waste**, that must be destroyed. If someone kept them, they could create fake proofs.

To reduce this risk, ceremonies involve many independent people. The result is safe as long as **at least one** of them was honest and destroyed their part. STARKs and some newer SNARKs avoid a trusted setup entirely.

## What ZK proofs are used for in blockchain

### 1. Scaling: ZK rollups

This is the largest use today. A ZK rollup runs thousands of transactions off the main chain and posts one small proof to Ethereum showing all of them were valid. Ethereum checks the proof instead of running every transaction again.

Here the proofs are used for their small size and fast checking. Most ZK rollups do not hide transaction data. See [what layer 2 is](/blogs/what-is-layer-2) and [ZK rollups in depth](/blogs/zero-knowledge-proofs-zk-rollups).

### 2. Privacy

- **Private payments.** Zcash hides the sender, receiver, and amount while proving that no coins were created from nothing.
- **Private smart contracts.** Networks such as Aztec and Aleo run contracts on hidden data.

### 3. Identity

- Prove you are over 18 without showing your birth date.
- Prove you hold a valid passport without showing the passport.
- Prove you are one unique person without revealing who you are.

### 4. Other uses

- **Proof of reserves.** An exchange proves it holds enough funds to cover customer balances without publishing each balance.
- **Bridges.** One chain verifies the state of another with a proof, instead of trusting a group of signers. See [blockchain bridges explained](/blogs/blockchain-bridges-explained).
- **Verifiable computing.** Prove that a program, or even an AI model, ran correctly on given inputs.

## zkEVM and zkVM

- A **zkEVM** proves the correct running of Ethereum-style smart contracts, so existing Solidity code can be used on a ZK rollup.
- A **zkVM** proves the running of general programs written in languages such as Rust. Developers write normal code and the system creates the proof.

These tools mean most developers will use ZK without writing circuits by hand.

## The limits

- **Proving is expensive.** Creating a proof needs far more computing power than simply running the program. Hardware and software improvements are reducing this fast.
- **Circuits are hard to write and audit.** A missing constraint can let an attacker prove a false statement. Such bugs have been found in production systems.
- **Trusted setups** add a trust assumption where they are used.
- **Privacy has legal friction.** Regulators in several countries have acted against some privacy tools.

## ZK and FHE

Both are privacy technologies, and they solve different problems. A ZK proof shows that a computation was done correctly, possibly on hidden inputs. **Fully homomorphic encryption (FHE)** lets someone compute directly on encrypted data without ever seeing it. See [FHE in blockchain](/blogs/understanding-fhe-in-blockchain).

## FAQ

### What is a zero-knowledge proof in simple words?

It is a way to prove that something is true without revealing the information behind it. For example, proving you know a secret without telling the secret.

### Do ZK rollups keep my transactions private?

Usually not. Most ZK rollups use the proofs for scaling, and transaction data is still public. Privacy-focused networks are a separate category.

### What is the difference between a SNARK and a STARK?

SNARKs have very small proofs and often need a trusted setup. STARKs have larger proofs, need no trusted setup, and are resistant to quantum computers.

### Who invented zero-knowledge proofs?

Shafi Goldwasser, Silvio Micali, and Charles Rackoff introduced the concept in a paper in 1985.
