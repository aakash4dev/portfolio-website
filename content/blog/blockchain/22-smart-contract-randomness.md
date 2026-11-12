---
title: How to Generate Random Numbers in Solidity Safely
description: block.timestamp and blockhash are not random. Learn why on-chain randomness is hard and how VRF, commit-reveal, and randomness beacons fix it.
tags: Randomness, VRF, Smart Contract Security
keywords: random number solidity, how to generate random number in smart contract, solidity randomness, chainlink vrf, verifiable random function, commit reveal
cover: hero dice-5 shield-check eye lock shuffle
---

There is **no safe built-in way** to generate a random number in a Solidity smart contract. Values such as `block.timestamp`, `blockhash`, and `block.prevrandao` are public or can be influenced, so an attacker can predict or bias the result. For anything with value at stake, use a **verifiable random function (VRF)** from an oracle network, a **commit-reveal** scheme, or a public randomness beacon. Which one depends on who must be prevented from cheating.

I built a blockchain project around verifiable randomness (VRF Chain), so this is a problem I have spent real time on.

## Why randomness is hard on a blockchain

A blockchain must be **deterministic**. Every node runs the same transaction and must reach exactly the same result. If a contract could call a true `random()` function, each node would get a different number and the network could not agree.

On top of that:

- **All data is public.** There are no secret seeds. See [why private variables are not secret](/blogs/solidity-public-vs-external).
- **Block producers choose what goes in a block** and can decide not to publish a block they dislike.
- **A contract can be called by another contract** that checks the result and cancels the transaction if it loses.

## Insecure methods you will see in tutorials

```solidity
// DO NOT USE for anything valuable
function badRandom() public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao))) % 100;
}
```

Every input here is known or can be influenced.

| Source | Problem |
|---|---|
| `block.timestamp` | Set by the block producer within a small range. Known to every transaction in the block. |
| `blockhash(block.number - 1)` | Already public when your transaction runs. |
| `block.prevrandao` | Known during the block. The proposer can influence it slightly by skipping their slot. |
| `msg.sender`, `tx.origin` | Chosen by the attacker. |
| A "private" seed in storage | Readable by anyone from the chain. |

### How the attack works

The attacker deploys a contract that computes the same formula in the same transaction, then plays only when it wins:

```solidity
interface ILottery {
    function play() external payable;
}

contract Attacker {
    ILottery lottery;

    constructor(ILottery _lottery) {
        lottery = _lottery;
    }

    function attack() external payable {
        // Same formula, same block, same values
        uint256 guess = uint256(keccak256(abi.encodePacked(block.timestamp, address(this), block.prevrandao))) % 100;
        require(guess == 7, "Not a winning block, try again later");
        lottery.play{value: msg.value}();
    }
}
```

If the number is not a winner, the transaction reverts and the attacker loses only a little gas. They repeat until it works. Several early gambling contracts were emptied exactly this way.

## Solution 1: a verifiable random function (VRF)

A **VRF** produces a random number together with a **cryptographic proof** that the number was generated correctly from a given seed and secret key. Anyone can check the proof. The party who generated the number cannot choose it, and nobody else can predict it.

Oracle networks such as **Chainlink VRF** offer this as a service. It works in two transactions:

1. **Request.** Your contract asks for randomness. The request is recorded on-chain.
2. **Fulfil.** The oracle generates the number and proof off-chain and sends them back. An on-chain contract verifies the proof and then calls your contract with the result.

The pattern looks like this. Check the provider's current documentation for exact contract names and parameters, as versions change.

```solidity
// Simplified pattern of a VRF consumer
abstract contract VRFConsumer {
    function requestRandomWords() internal virtual returns (uint256 requestId);
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;
}

contract Raffle is VRFConsumer {
    address[] public players;
    address public winner;
    bool public drawing;

    function enter() external payable {
        require(!drawing, "Draw in progress");
        require(msg.value == 0.01 ether, "Ticket costs 0.01 ETH");
        players.push(msg.sender);
    }

    function draw() external {
        require(players.length > 0, "No players");
        drawing = true;                 // 1. lock entries first
        requestRandomWords();           // 2. then request randomness
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        winner = players[randomWords[0] % players.length];
        drawing = false;
        delete players;
        (bool ok, ) = winner.call{value: address(this).balance}("");
        require(ok, "Payout failed");
    }

    // requestRandomWords() is provided by the VRF library you inherit from
}
```

### Rules for using VRF correctly

- **Lock the inputs before requesting.** Entries must close before the request, as `drawing = true` does above. Otherwise someone could see the pending random number and join at the last moment.
- **Never let users cancel or re-request** after a request is made. They would retry until they like the result.
- **Do not make the callback fail.** If `fulfillRandomWords` reverts, the randomness is lost. Keep it simple, or store the number and process it in a second call.
- **Wait for enough block confirmations** so a chain reorganization cannot change the outcome.

**Cost:** each request has a fee paid to the oracle network, plus gas for the callback.

## Solution 2: commit-reveal

This needs no oracle. It works when the participants themselves supply the randomness.

1. **Commit.** Each player picks a secret number and submits only its hash.
2. **Reveal.** After commits close, each player reveals the number. The contract checks that it matches the hash.
3. **Combine.** The revealed numbers are mixed, for example with XOR, to form the result.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CommitReveal {
    mapping(address => bytes32) public commitments;
    uint256 public combined;
    uint256 public commitDeadline;
    uint256 public revealDeadline;

    constructor() {
        commitDeadline = block.timestamp + 1 hours;
        revealDeadline = commitDeadline + 1 hours;
    }

    // hash = keccak256(abi.encodePacked(secret, msg.sender))
    function commit(bytes32 hash) external payable {
        require(block.timestamp < commitDeadline, "Commit phase over");
        require(msg.value == 0.1 ether, "Deposit required");
        commitments[msg.sender] = hash;
    }

    function reveal(uint256 secret) external {
        require(block.timestamp >= commitDeadline && block.timestamp < revealDeadline, "Not reveal phase");
        require(commitments[msg.sender] == keccak256(abi.encodePacked(secret, msg.sender)), "Wrong secret");

        delete commitments[msg.sender];
        combined ^= secret;
        payable(msg.sender).transfer(0.1 ether);     // deposit returned on reveal
    }
}
```

As long as **one** participant picks a truly random secret, the combined result is unpredictable to the others.

**The weakness: the last revealer.** The last person to reveal can compute the final result before submitting. If they do not like it, they can refuse to reveal. That is why this contract takes a **deposit** that is lost by anyone who does not reveal. The deposit must be worth more than the benefit of cheating.

Including `msg.sender` in the hash stops one player from copying another player's commitment.

## Solution 3: public randomness beacons

- **drand** is a network of independent organizations that jointly publish a new verifiable random value every few seconds. No single member can predict or bias it. A contract can verify a drand value on-chain, or an oracle can relay it.
- **RANDAO** is Ethereum's built-in beacon, exposed as `block.prevrandao`. Validators mix in their contributions. It is better than `blockhash`, and it still has a known weakness: a block proposer can skip their slot to avoid a result they dislike, giving them a one-bit influence per slot. It is acceptable for low-value uses, especially if you commit to a **future** block that nobody can know when the bet is placed.
- **VDFs (verifiable delay functions)** force a long computation that cannot be sped up, so nobody can calculate the result in time to manipulate it.

## Comparing the options

| Method | Trust needed | Cost | Speed | Good for |
|---|---|---|---|---|
| `block.timestamp`, `blockhash` | Unsafe | Free | Instant | Tests and toys only |
| `block.prevrandao` (future block) | Block proposers | Free | Minutes | Low-value uses |
| Commit-reveal | Participants, with deposits | Gas only | Two phases | Games between a fixed set of players |
| VRF oracle | The oracle network and its proof | Fee per request | Seconds to minutes | Lotteries, NFT traits, games |
| drand beacon | The beacon's members | Low | Seconds | Public draws, leader selection |

## Which should you use?

- **Lottery, raffle, NFT reveal, loot drops:** a VRF oracle.
- **A game between two or a few known players:** commit-reveal with deposits.
- **Choosing a validator or committee in a protocol:** a beacon or VRF built into the protocol.
- **Shuffling test data or picking a cosmetic color:** `block.prevrandao` is fine.

A good test: **if someone could gain more than the cost of a few failed transactions by predicting the number, the simple methods are unsafe.**

## More mistakes to avoid

- **Modulo bias.** `random % n` is slightly unfair unless `n` divides the range evenly. With a 256-bit number the bias is far too small to matter for normal sizes of `n`.
- **Reusing one random number carelessly.** To get several values from one result, hash it with a counter: `keccak256(abi.encode(random, i))`.
- **Acting in the same transaction as the request.** Randomness that arrives in the same transaction as the user's choice can always be checked and reverted by a contract.

For a broader security checklist, see [smart contract security best practices](/blogs/smart-contract-security-and-optimization). For how oracles deliver outside data in general, see [blockchain oracles explained](/blogs/blockchain-oracles-explained).

## FAQ

### Can Solidity generate a random number?

Not securely by itself. The EVM is deterministic and all its data is public. Secure randomness must come from outside the contract, with a proof, or from a commit-reveal process.

### Is block.prevrandao safe to use?

It is safer than blockhash or timestamp but can be slightly influenced by the block proposer and is known during the block. Do not use it directly for high-value outcomes.

### What is a VRF in blockchain?

A verifiable random function produces a random number plus a proof that it was generated correctly. A contract checks the proof before using the number, so the provider cannot choose the result.

### Why not use an API to get a random number?

A contract cannot call an API, and if one server supplied the number, everyone would have to trust that server. VRF and beacons replace that trust with cryptographic proofs.
