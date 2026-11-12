---
title: What Is a DAO in Crypto? How Decentralized Organizations Work
description: A DAO is an organization run by rules in smart contracts and votes from its members. Learn how DAOs work, with examples, benefits, and problems.
tags: DAO, Governance, Web3
keywords: what is dao, what is dao in crypto, what is dao in blockchain, dao explained, decentralized autonomous organization, how does a dao work
cover: hero vote users landmark coins file-code
---

A **DAO**, or **decentralized autonomous organization**, is a group that manages shared money and makes decisions through rules written in smart contracts and votes by its members, instead of through a board or a chief executive. Members usually hold **governance tokens** that give them voting power. Proposals that pass a vote can be carried out automatically by code.

Note: in programming, DAO also means "data access object", a design pattern in Java and Spring. This article is about the blockchain meaning.

## DAO vs a traditional company

| | Traditional company | DAO |
|---|---|---|
| Who decides | Executives and a board | Token holders, by vote |
| Rules | Company bylaws and contracts | Smart contracts |
| Treasury | Bank account controlled by officers | On-chain, moved only by passed proposals or approved signers |
| Transparency | Private records | Public votes and transactions |
| Joining | Hiring or buying shares through a broker | Getting the token or being granted membership |
| Location | A registered country | Global, on the internet |

## How a DAO works

### 1. The rules are written in smart contracts

The contracts define who can vote, how votes are counted, how long voting lasts, and what happens when a proposal passes. See [what a smart contract is](/blogs/what-is-a-smart-contract).

### 2. Members hold governance tokens

A token usually equals voting power: more tokens, more votes. Tokens are distributed through sales, rewards to users, grants to contributors, or airdrops.

### 3. Someone makes a proposal

Examples:

- "Spend 50,000 USDC to fund a security audit."
- "Change the trading fee from 0.3 percent to 0.25 percent."
- "Upgrade the protocol contract to version 3."

Most DAOs require a minimum token balance to submit a proposal, to prevent spam.

### 4. Members vote

Voting stays open for a fixed time, often 3 to 7 days. To pass, a proposal usually needs:

- **A majority** of votes in favor.
- **A quorum:** a minimum total number of votes, so that a handful of people cannot decide for everyone.

### 5. The result is carried out

In an on-chain DAO, a passed proposal waits in a **timelock** for a day or two. This delay gives members time to react if something harmful passed. After the delay, anyone can trigger the contract to carry out the action.

```text
Proposal -> Voting period -> Passed? -> Timelock delay -> Executed by code
```

## A minimal voting contract

This simplified example shows the idea. Real DAOs use audited frameworks such as OpenZeppelin Governor.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVotes {
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleDAO {
    struct Proposal {
        string description;
        uint256 deadline;
        uint256 yes;
        uint256 no;
        mapping(address => bool) voted;
    }

    IVotes public token;
    Proposal[] public proposals;

    constructor(IVotes _token) {
        token = _token;
    }

    function propose(string calldata description) external {
        Proposal storage p = proposals.push();
        p.description = description;
        p.deadline = block.timestamp + 3 days;
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.timestamp < p.deadline, "Voting ended");
        require(!p.voted[msg.sender], "Already voted");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        p.voted[msg.sender] = true;
        if (support) p.yes += weight; else p.no += weight;
    }

    function passed(uint256 id) external view returns (bool) {
        Proposal storage p = proposals[id];
        return block.timestamp >= p.deadline && p.yes > p.no;
    }
}
```

**This contract has a serious flaw**, and it is a useful one to understand. It reads the voter's balance at the moment of voting. Someone could vote, send the tokens to a second wallet, and vote again. Or they could borrow a huge number of tokens for one transaction with a flash loan. Real governance contracts use a **snapshot**: voting power is fixed at a block before the proposal was made.

## Types of DAOs

- **Protocol DAOs** govern DeFi protocols: fees, upgrades, and treasury. Examples: Uniswap, Aave, MakerDAO (now Sky). See [what DeFi is](/blogs/what-is-defi).
- **Grant DAOs** fund public goods and open-source work. Example: Gitcoin.
- **Investment DAOs** pool money to invest together.
- **Collector DAOs** buy art or NFTs as a group. ConstitutionDAO raised about 47 million US dollars in 2021 to bid on a copy of the US Constitution. It lost the auction and refunded contributors.
- **Social DAOs** are communities with token-based membership.
- **Service DAOs** are networks of freelancers who share work and income.

## Voting systems

- **Token voting:** one token, one vote. Simple, and it favors large holders.
- **Delegation:** holders hand their voting power to a delegate who votes regularly. Common in large DAOs, where most holders do not follow every proposal.
- **Quadratic voting:** the cost of extra votes rises steeply, which gives small holders more weight. It needs a way to stop one person from using many wallets.
- **Off-chain voting:** members sign votes for free on a platform such as Snapshot, and a group of trusted signers carries out the result. Cheaper, but it relies on those signers.
- **Multisig:** a small group of key holders, for example 5 of 9, approves each action. Many "DAOs" are in practice controlled by a multisig, especially early on.

## Benefits

- **Open records.** Every vote and payment is public.
- **Global participation.** Anyone can join without borders or paperwork.
- **Shared ownership.** Users of a product can have a say in it.
- **Rules that hold.** A passed proposal is carried out by code, and an action that did not pass cannot be executed by the contract.

## Problems

- **Low turnout.** Most token holders never vote. Decisions are often made by a small active group.
- **Concentrated power.** A few large holders, often founders and investors, can control outcomes. "Decentralized" can be more of a label than a fact.
- **Slow decisions.** A week of voting is too slow for emergencies, so many DAOs keep an emergency multisig.
- **Governance attacks.** An attacker who gathers enough voting power can pass a proposal to drain the treasury. In 2022, the Beanstalk protocol lost about 180 million US dollars' worth of assets to a governance attack that used a flash loan.
- **Smart contract bugs.** "The DAO", an early investment fund on Ethereum, was hacked in 2016 through a [reentrancy bug](/blogs/reentrancy-attack-explained). About 60 million US dollars' worth of ETH was taken, and the dispute over how to respond split the network into Ethereum and Ethereum Classic.
- **Legal uncertainty.** In some court cases, DAO members have been treated as partners who can be personally liable. Some places now offer legal forms for DAOs, such as the Wyoming DAO LLC and foundations in various countries.

## How to join or start a DAO

**To join:** find the DAO's forum and governance page, read past proposals, get the token or apply for membership, and take part in discussions before voting. Much of the real decision-making happens in the forum, before a vote starts.

**To start one:** you do not need to write contracts from zero.

- **Safe** for a shared multisig treasury.
- **Snapshot** for free off-chain voting.
- **OpenZeppelin Governor** or **Aragon** for on-chain governance.
- **Tally** for a voting interface.

Start small with a multisig and move to token voting only when the community is large enough to need it. Get legal advice on the structure before handling other people's money.

## FAQ

### What does DAO stand for?

Decentralized autonomous organization. It is a group that is run by smart contracts and member votes instead of central management.

### How do DAOs make money?

It depends on the type. Protocol DAOs earn fees from their product. Investment DAOs earn from their holdings. Many DAOs are funded by a treasury of their own token.

### Are DAOs legal?

DAOs are not illegal in themselves, but their legal status is unclear in many countries. Without a legal structure, members may carry personal liability. Rules differ widely by place.

### Is a DAO really decentralized?

It varies. Some have thousands of active voters. Many are controlled by a small number of large holders or a multisig. Check how voting power is distributed and who can upgrade the contracts.
