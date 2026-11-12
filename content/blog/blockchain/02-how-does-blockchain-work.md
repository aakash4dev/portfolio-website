---
title: How Does Blockchain Work? Step by Step, With a Python Example
description: Follow one transaction from wallet to confirmed block. Learn hashing, blocks, nodes, and consensus, and build a tiny blockchain in Python.
tags: Blockchain Basics, Hashing, Consensus
keywords: how does blockchain work, how does blockchain work step by step, blockchain working explained, how blockchain technology works, blockchain example
cover: flow pen-line blocks circle-check-big
---

A blockchain works in six steps: a user signs a transaction, sends it to the network, nodes check it, a block producer puts it into a new block, the network agrees on that block, and every node adds it to its copy of the chain. Each block contains the hash of the block before it, which is why old data cannot be changed without breaking the chain.

If you want the general idea first, read [what blockchain is in simple words](/blogs/what-is-blockchain).

## The life of one transaction

Let us follow a payment: Asha sends 1 coin to Ben.

### Step 1: Asha creates and signs the transaction

Her wallet builds a message: "Send 1 coin from Asha's address to Ben's address." The wallet signs it with her **private key**. The signature proves two things:

- The message came from the owner of that address.
- The message has not been changed since it was signed.

Anyone can check the signature with her **public key**, and nobody can fake it without the private key. See [how crypto wallets work](/blogs/how-crypto-wallets-work).

### Step 2: The transaction is sent to the network

The wallet sends the signed transaction to a node. That node passes it to the nodes it knows, and they pass it on. In a few seconds most of the network has seen it.

### Step 3: Nodes check it

Each node checks:

- Is the signature valid?
- Does Asha have at least 1 coin?
- Has she already spent this coin in another transaction?

If a check fails, the node drops the transaction. Valid transactions wait in a queue called the **mempool**.

### Step 4: A block producer builds a block

A block producer (a **miner** in proof of work, a **validator** in proof of stake) picks transactions from the mempool, usually those paying the highest fees first, and puts them into a new block.

### Step 5: The network agrees

The new block is sent to all nodes. Each node checks every transaction in it again and checks that the block follows the rules. The **consensus mechanism** decides which block the network accepts:

- **Proof of work:** the miner must find a number that makes the block's hash start with many zeros. Finding it needs a huge number of tries. Checking it takes an instant.
- **Proof of stake:** a validator is chosen to propose the block, and other validators vote for it. Validators have locked up coins and lose some if they cheat.

More detail is in [proof of work vs proof of stake](/blogs/proof-of-work-vs-proof-of-stake).

### Step 6: The block joins the chain

Every node adds the block to its copy. Ben's wallet now shows 1 more coin. As more blocks are added on top, the transaction becomes harder and harder to reverse. This is called **finality**.

## Hashing: what holds the chain together

A **hash function** takes any data and gives back a fixed-length fingerprint. Bitcoin uses SHA-256.

```python
import hashlib

print(hashlib.sha256(b"hello").hexdigest())
# 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824

print(hashlib.sha256(b"hellp").hexdigest())
# a completely different result
```

A good hash function has three properties:

- **Same input, same output**, every time.
- **A small change gives a totally different output.**
- **It cannot be reversed.** You cannot get the data back from the hash.

Each block stores the hash of the previous block. Change anything in block 5, and its hash changes. Block 6 still holds the old hash of block 5, so the link breaks. To hide the change you would have to rebuild block 6, 7, 8, and every block after, faster than the whole network adds new ones.

## Build a tiny blockchain in Python

This short program shows blocks, hashes, proof of work, and tamper detection.

```python
import hashlib
import json
import time

class Block:
    def __init__(self, index, transactions, previous_hash):
        self.index = index
        self.timestamp = time.time()
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        data = json.dumps([self.index, self.timestamp, self.transactions, self.previous_hash, self.nonce])
        return hashlib.sha256(data.encode()).hexdigest()

    def mine(self, difficulty):
        # proof of work: try nonces until the hash starts with enough zeros
        while not self.hash.startswith("0" * difficulty):
            self.nonce += 1
            self.hash = self.calculate_hash()

class Blockchain:
    def __init__(self, difficulty=4):
        self.difficulty = difficulty
        self.chain = [Block(0, ["genesis"], "0")]

    def add_block(self, transactions):
        block = Block(len(self.chain), transactions, self.chain[-1].hash)
        block.mine(self.difficulty)
        self.chain.append(block)

    def is_valid(self):
        for previous, current in zip(self.chain, self.chain[1:]):
            if current.hash != current.calculate_hash():
                return False                      # the block's data was changed
            if current.previous_hash != previous.hash:
                return False                      # the link is broken
        return True

chain = Blockchain()
chain.add_block(["Asha pays Ben 1"])
chain.add_block(["Ben pays Chen 0.5"])
print(chain.is_valid())                           # True

chain.chain[1].transactions = ["Asha pays Ben 100"]   # try to cheat
print(chain.is_valid())                           # False
```

Changing one transaction makes the chain invalid. A real blockchain adds digital signatures, a network of nodes, and economic rewards, but the core idea is in these 40 lines.

## Why nodes stay honest

A blockchain does not rely on people being good. It relies on rewards and penalties.

- **Rewards.** Block producers earn new coins and transaction fees for making valid blocks.
- **Cost of cheating.** In proof of work, an attacker needs more computing power than the rest of the network combined. In proof of stake, an attacker must buy a huge share of the coins and can lose them.
- **Everyone checks.** A block with an invalid transaction is rejected by honest nodes, and the producer earns nothing for it.

Playing by the rules is the most profitable choice. That is the real invention.

## Merkle trees: proving a transaction is in a block

A block can hold thousands of transactions. They are hashed in pairs, then the results are hashed in pairs, and so on until one hash is left: the **Merkle root**, stored in the block header.

This lets a phone wallet prove that a transaction is in a block by checking a few hashes, without downloading the whole block.

## What smart contract chains add

Bitcoin mainly records who owns which coins. Chains such as Ethereum also store **programs** and their data. A transaction can call a function in a program, and every node runs that code and reaches the same result. See [what a smart contract is](/blogs/what-is-a-smart-contract).

Running code on every node costs resources, so users pay a fee for it. See [what gas fees are](/blogs/what-is-gas-fee).

## FAQ

### How does blockchain work in simple terms?

Users sign transactions, the network checks them, they are grouped into a block, the network agrees on the block, and it is linked to the previous block with a hash so it cannot be changed later.

### What is a node in blockchain?

A node is a computer that runs the blockchain software, keeps a copy of the chain, and checks transactions and blocks.

### How long does a blockchain transaction take?

It depends on the chain. Bitcoin adds a block about every 10 minutes. Ethereum adds one about every 12 seconds. Many newer chains and layer 2 networks confirm in a second or two.

### What happens if two blocks are created at the same time?

The chain splits for a short time. Nodes follow the chain's rule for choosing a branch, such as the one with the most work or the most validator votes. The other branch is dropped and its transactions go back to the queue.
