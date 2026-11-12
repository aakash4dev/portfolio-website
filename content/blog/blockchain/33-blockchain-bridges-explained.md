---
title: What Is a Blockchain Bridge? How Bridges Work and Their Risks
description: A bridge moves tokens and messages between blockchains. Learn lock-and-mint, burn-and-mint, and liquidity bridges, and why bridges get hacked.
tags: Bridges, Interoperability, Security
keywords: what is a blockchain bridge, crypto bridge explained, how do bridges work, cross chain bridge, bridge hacks, wrapped tokens
cover: hero arrow-left-right blocks lock shield-alert coins
---

A **blockchain bridge** is a system that lets you move tokens or data from one blockchain to another. Blockchains cannot read each other directly, so a bridge does not really "send" a token across. In the most common design, it **locks** the token on the first chain and **mints** a matching token on the second. Bridges are essential for a world with many chains, and they have also been the target of the largest hacks in crypto.

I have worked on a cross-chain bridge between Cosmos and EVM chains, and the main lesson is this: the hard part of a bridge is never the transfer. It is deciding **who is trusted to say what happened on the other chain**.

## Why bridges are needed

Each blockchain is a separate system with its own state. Ethereum does not know what happens on Solana. An ETH coin exists only on Ethereum.

Users still want to:

- Use an asset from one chain in an app on another.
- Move to a chain with lower fees. See [what layer 2 is](/blogs/what-is-layer-2).
- Send messages between contracts on different chains.

A bridge makes this possible.

## How bridges move tokens

### 1. Lock and mint

The most common model.

```text
Chain A                                 Chain B
-------                                 -------
1. You deposit 10 ETH into the
   bridge contract. It is LOCKED.
              -- message: "10 ETH locked for address X" -->
                                        2. The bridge MINTS 10 wrapped ETH
                                           to your address.

To go back:
                                        3. You BURN the 10 wrapped ETH.
              <-- message: "10 burned" --
4. The bridge UNLOCKS 10 ETH.
```

The token on chain B is a **wrapped token**: a claim on the real asset locked on chain A. Its value depends on that lock staying intact. If the locked funds are stolen, the wrapped tokens are backed by nothing.

A simplified version of the two contracts:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// On chain A
contract BridgeVault {
    event Locked(address indexed user, uint256 amount, uint256 nonce);
    uint256 public nonce;

    function lock() external payable {
        emit Locked(msg.sender, msg.value, nonce++);
    }
    // unlock() releases funds when a verified burn message arrives
}

// On chain B
interface IWrappedToken {
    function mint(address to, uint256 amount) external;
}

contract BridgeMinter {
    IWrappedToken public token;
    address public verifier;                       // who is trusted to report events from chain A
    mapping(uint256 => bool) public processed;

    function mint(address user, uint256 amount, uint256 nonce) external {
        require(msg.sender == verifier, "Not verified");
        require(!processed[nonce], "Already processed");   // stops the same message being used twice
        processed[nonce] = true;
        token.mint(user, amount);
    }
}
```

Everything depends on the line `require(msg.sender == verifier)`. The whole security of a bridge is the answer to: **what is the verifier, and how can it be wrong or corrupted?**

### 2. Burn and mint

The token issuer controls the token on both chains. The token is **burned** on the source chain and **minted** fresh on the destination. No wrapped version is created, so the token is "native" on each chain.

Circle's CCTP moves USDC this way. This is the safest model for a token whose issuer supports it.

### 3. Liquidity pools

The bridge keeps pools of the real asset on both chains. You deposit on chain A and a **liquidity provider** pays you from the pool on chain B, minus a fee. Nothing is wrapped.

- **For:** fast, and you receive the native asset.
- **Against:** limited by the size of the pools. Large transfers get worse rates.
- **Examples:** Across, Stargate, Hop.

### 4. Intents and solvers

You sign a request: "I give 1,000 USDC on chain A and want at least 998 USDC on chain B." A **solver** pays you on chain B from its own funds within seconds and is repaid later, after the bridge confirms your deposit.

The solver carries the waiting time and the risk. This is now the fastest way to bridge for most users.

### 5. Atomic swaps

Two users exchange assets across chains using contracts with hash and time locks, so that either both sides complete or neither does. No third party is trusted. It needs a matching partner and is not widely used.

## Who verifies the message? The trust models

This is the most important section. A bridge must convince chain B that something happened on chain A.

### Externally verified

A group of **validators** or a **multisig** watches chain A and signs a statement of what happened. Chain B accepts it if enough signatures are present.

- **For:** simple, fast, works between any chains.
- **Against:** if enough keys are stolen or the signers act together, they can mint anything.
- **Examples:** many early bridges. Wormhole uses a set of 19 guardians.

### Optimistically verified

A message is assumed valid unless someone challenges it during a waiting period. It needs only **one honest watcher**.

- **For:** stronger trust model.
- **Against:** slower, because of the waiting period.
- **Examples:** the official bridges of optimistic rollups, with about 7 days for withdrawals.

### Natively verified (light clients)

Chain B runs a **light client** of chain A: a contract that checks chain A's block headers and consensus signatures directly. No outside party is trusted. You trust only the two chains themselves.

- **For:** the strongest model.
- **Against:** complex and costly to build and run for chains with different designs.
- **Example:** **IBC** (Inter-Blockchain Communication) between Cosmos chains. See [the Cosmos ecosystem](/blogs/exploring-cosmos-ecosystem).

### ZK verified

A zero-knowledge proof shows that chain A's state is what is claimed, and chain B checks the proof. This gives light-client-level security at a much lower on-chain cost.

- **Examples:** ZK rollup bridges, and newer ZK light client bridges. See [zero-knowledge proofs explained](/blogs/zero-knowledge-proofs-explained).

| Model | You trust | Speed | Security |
|---|---|---|---|
| External validators | A set of signers | Fast | Weakest |
| Optimistic | At least one honest watcher | Slow | Strong |
| Light client | The two chains only | Medium | Strongest |
| ZK proof | The two chains and the proof system | Medium | Very strong |

## Why bridges get hacked

Bridges hold large pools of locked assets in one place, and they are complex systems that span several chains. That combination makes them the best target in crypto.

| Incident | Year | Approximate loss | Cause |
|---|---|---|---|
| Ronin | 2022 | 620 million US dollars | Attackers obtained 5 of 9 validator keys |
| Poly Network | 2021 | 610 million US dollars (mostly returned) | Flaw in contract logic that let the attacker replace the verifier |
| BNB Bridge | 2022 | 570 million US dollars | Bug in proof verification |
| Wormhole | 2022 | 320 million US dollars | Missing signature check allowed minting without a deposit |
| Nomad | 2022 | 190 million US dollars | A bad upgrade made every message count as valid |
| Harmony Horizon | 2022 | 100 million US dollars | 2 of 5 multisig keys compromised |

The causes fall into a few groups:

- **Stolen keys.** A small validator set or multisig is compromised.
- **Faulty verification.** A bug lets a fake message pass as real.
- **Bad upgrades.** A change to the contract introduces a hole.
- **Replay.** The same message is accepted twice.
- **Reorganizations.** The bridge acts on a deposit that is later removed from the source chain.

The Nomad case is a strong example of how one small mistake matters: after an upgrade, the contract treated an empty proof as valid, and hundreds of people copied the first attacker's transaction to take funds.

## Official and third-party bridges

- **Official (canonical) bridges** are run by a chain or rollup itself. A rollup's official bridge inherits the rollup's security. They are usually the safest and often the slowest.
- **Third-party bridges** connect many chains and are faster, with their own trust assumptions on top.

For large amounts where time is not critical, the official bridge is normally the better choice.

## Cross-chain messaging

Modern bridges send **arbitrary messages**, not only tokens. A contract on chain A can call a function on chain B. This allows cross-chain governance, lending against collateral on another chain, and apps that span many networks.

Protocols in this area include IBC, LayerZero, Chainlink CCIP, Axelar, Wormhole, and Hyperlane. Each has a different verification model, and the comparison table above applies to them.

## How to bridge safely as a user

1. **Use the official bridge or a well-established one** with a long record and public audits.
2. **Type the address or use a bookmark.** Fake bridge websites are a common scam.
3. **Send a small test amount first.**
4. **Check which token you will receive.** A wrapped or "bridged" version may not be accepted by apps on the destination chain.
5. **Check that you have gas on the destination chain.** Many bridges can send a little of the native coin along.
6. **Do not keep large amounts in wrapped tokens** longer than you need.
7. **Prefer native issuance.** For USDC, use the issuer's burn-and-mint route when it is available. See [stablecoins explained](/blogs/stablecoins-explained).
8. **Skip the bridge when possible.** Many exchanges let you withdraw directly to the chain you want.

## For developers building with bridges

- **Verify the sender of every cross-chain message**: both the bridge contract and the original sender on the source chain.
- **Make messages single-use** with a nonce, as in the example above.
- **Wait for finality** on the source chain before acting.
- **Add rate limits.** Cap how much can leave per hour. This turned several possible disasters into smaller losses.
- **Add a pause function** controlled by a multisig, and monitoring that triggers it.
- **Plan for failed messages.** A message that cannot be delivered must not lock funds permanently.
- **Treat upgrades as the highest-risk action.** See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).

General defensive patterns are in [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## FAQ

### What is a blockchain bridge in simple words?

It is a tool that lets you move tokens or data from one blockchain to another, usually by locking the asset on one chain and creating a matching one on the other.

### Are crypto bridges safe?

They carry more risk than staying on one chain. Bridges have suffered the largest hacks in crypto. Official rollup bridges and light-client bridges such as IBC are the safest designs.

### What is a wrapped token?

A token on one chain that represents an asset locked on another chain. It can be exchanged back for the original through the bridge, and it is only as safe as that bridge.

### Why are bridges hacked so often?

They hold very large amounts in one place, they are complex, and many rely on a small group of signers. A stolen key or one verification bug can release everything.
