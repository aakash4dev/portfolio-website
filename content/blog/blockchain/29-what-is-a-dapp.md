---
title: What Is a dApp? How Decentralized Apps Work and How to Build One
description: A dApp is an app whose back end runs on smart contracts. Learn the parts of a dApp, how it differs from a normal app, and build a simple one.
tags: dApp, Web3, Tutorial
keywords: what is a dapp, dapp explained, decentralized application, how to build a dapp, dapp vs app, dapp architecture
cover: flow monitor wallet blocks
---

A **dApp**, or **decentralized application**, is an app whose core logic and data live in smart contracts on a blockchain instead of on a company's server. Users connect with a crypto wallet, and each action that changes data is a transaction they sign. The website looks like any other website. The difference is behind it: no company database, and rules that are public and cannot be changed quietly.

## dApp vs normal app

| | Normal web app | dApp |
|---|---|---|
| Back end | Company servers | Smart contracts on a blockchain |
| Database | Private, owned by the company | The blockchain, public |
| Login | Email and password | Wallet connection |
| Who can change the rules | The company, at any time | Nobody, or whoever the contract allows |
| Cost of an action | Free for the user | A gas fee |
| Speed | Instant | Seconds, waiting for a block |
| If the company closes | The app is gone | The contracts keep running |
| Mistakes | Support can often reverse them | Usually final |

## The parts of a dApp

```text
┌─────────────────────────────────────────────┐
│  Front end (React, Next.js)                 │
│  what the user sees                         │
└──────────────┬──────────────────────────────┘
               │ uses a library (viem, ethers, wagmi)
┌──────────────┴──────────────┐   ┌───────────────────────┐
│  Wallet (MetaMask etc.)     │   │  RPC node / provider  │
│  holds keys, signs          │   │  reads chain data     │
└──────────────┬──────────────┘   └──────────┬────────────┘
               │ signed transactions          │ calls
┌──────────────┴──────────────────────────────┴───────────┐
│  Smart contracts on the blockchain                      │
│  the logic and the data                                 │
└─────────────────────────────────────────────────────────┘
        Optional: indexer (fast queries), IPFS (files), oracles (outside data)
```

### 1. Smart contracts

The back end. They hold the data and the rules. See [what a smart contract is](/blogs/what-is-a-smart-contract).

### 2. The front end

A normal website built with HTML, CSS, and JavaScript, usually React. It shows data and prepares transactions.

### 3. The wallet

The user's keys and identity. It asks the user to approve every transaction. See [how crypto wallets work](/blogs/how-crypto-wallets-work).

### 4. An RPC node

The front end cannot talk to "the blockchain" directly. It sends requests to a node through an interface called JSON-RPC. Most apps use a node provider service for this.

### 5. A library

**viem**, **ethers.js**, or **wagmi** for React. The library turns function calls into the encoded data the chain expects, using the contract's ABI. See [what an ABI is](/blogs/what-is-an-abi).

### Optional parts

- **Indexer.** Blockchains are slow to query for history ("all donations by this user"). An indexer such as The Graph or Ponder listens to events and stores them in a database for fast queries.
- **Decentralized storage.** IPFS or Arweave for images and large files.
- **Oracles.** For outside data such as prices. See [blockchain oracles explained](/blogs/blockchain-oracles-explained).

## How one user action flows

A user clicks "Donate 0.1 ETH":

1. The front end builds a transaction that calls `donate()` with 0.1 ETH.
2. The wallet opens and shows the details. The user approves.
3. The wallet signs and sends the transaction to the network.
4. The front end shows "pending" and waits.
5. A validator includes the transaction in a block. The contract's code runs.
6. The contract emits a `Donated` event.
7. The front end sees the receipt and updates the page.

Reading data, such as the total raised, needs no wallet approval and no fee. It is a free call. See [transaction vs call](/blogs/ethereum-transaction-vs-call).

## Build a simple dApp

We will build a tip jar: anyone can send ETH with a message, and the owner can withdraw.

### Step 1: The contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipJar {
    address public immutable owner;
    uint256 public totalTips;

    event Tipped(address indexed from, uint256 amount, string message);

    constructor() {
        owner = msg.sender;
    }

    function tip(string calldata message) external payable {
        require(msg.value > 0, "Send some ETH");
        totalTips += msg.value;
        emit Tipped(msg.sender, msg.value, message);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not the owner");
        (bool ok, ) = owner.call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }
}
```

Deploy it to a test network with Remix, Foundry, or Hardhat. See [Hardhat vs Foundry](/blogs/hardhat-vs-foundry). Note the contract address.

### Step 2: The front end

This is a single HTML file with no build step. It uses viem from a CDN.

```html
<!doctype html>
<html>
  <body>
    <h1>Tip Jar</h1>
    <p>Total tips: <span id="total">...</span> ETH</p>
    <button id="connect">Connect wallet</button>
    <input id="message" placeholder="Your message" />
    <button id="tip" disabled>Send 0.001 ETH</button>
    <p id="status"></p>

    <script type="module">
      import { createPublicClient, createWalletClient, custom, http, parseAbi, parseEther, formatEther }
        from "https://esm.sh/viem";
      import { sepolia } from "https://esm.sh/viem/chains";

      const address = "0xYourTipJarAddress";
      const abi = parseAbi([
        "function totalTips() view returns (uint256)",
        "function tip(string message) payable",
      ]);

      const publicClient = createPublicClient({ chain: sepolia, transport: http() });
      let walletClient, account;

      async function refresh() {
        const total = await publicClient.readContract({ address, abi, functionName: "totalTips" });
        document.getElementById("total").textContent = formatEther(total);
      }

      document.getElementById("connect").onclick = async () => {
        if (!window.ethereum) return alert("Install a wallet such as MetaMask");
        walletClient = createWalletClient({ chain: sepolia, transport: custom(window.ethereum) });
        [account] = await walletClient.requestAddresses();
        document.getElementById("connect").textContent = account.slice(0, 6) + "..." + account.slice(-4);
        document.getElementById("tip").disabled = false;
      };

      document.getElementById("tip").onclick = async () => {
        const status = document.getElementById("status");
        try {
          status.textContent = "Confirm in your wallet...";
          const hash = await walletClient.writeContract({
            account, address, abi, functionName: "tip",
            args: [document.getElementById("message").value],
            value: parseEther("0.001"),
          });
          status.textContent = "Waiting for confirmation...";
          await publicClient.waitForTransactionReceipt({ hash });
          status.textContent = "Thank you!";
          refresh();
        } catch (error) {
          status.textContent = error.shortMessage || "Transaction cancelled";
        }
      };

      refresh();
    </script>
  </body>
</html>
```

That is a complete dApp: reading state, connecting a wallet, sending a transaction, and waiting for the result.

### Step 3: For a real project

- Use **React with wagmi**, which gives hooks for connecting wallets, reading, and writing.
- Use a wallet connection kit so users can pick from many wallets, including mobile ones.
- Check that the user is on the **right network** and offer to switch.
- Use your own RPC provider key. Public endpoints have limits.

## What makes dApp front ends different

Things a web developer must get used to:

- **Every write is slow and can fail.** Show clear states: waiting for signature, pending, confirmed, failed.
- **Users can reject.** Handle a cancelled transaction calmly.
- **Numbers are big integers.** One ETH is `1000000000000000000` wei. Use `BigInt`, never floating-point numbers, and convert only for display.
- **State changes outside your app.** Other users and contracts change the data. Refresh on new blocks or events.
- **The user may be on the wrong chain or have no gas.**
- **Simulate before sending** to catch errors before the user pays. Most libraries do this for you.

## How decentralized is a dApp in reality?

Often less than the name suggests.

- The **contracts** are decentralized if they are not upgradeable by a small group. See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).
- The **front end** is usually hosted on a normal server and domain. The company can change or remove it. Advanced users can still call the contracts directly.
- The **RPC provider** is usually one company.
- The **indexer** is often a central service.

A fair description: the rules and funds are decentralized. The convenient way to reach them often is not.

## Types of dApps

- **DeFi:** exchanges, lending, stablecoins. See [what DeFi is](/blogs/what-is-defi).
- **NFT marketplaces and minting sites.** See [what an NFT is](/blogs/what-is-an-nft).
- **DAO tools:** voting and treasury management. See [what a DAO is](/blogs/what-is-a-dao).
- **Games** with tradable items.
- **Social apps** where users own their profile.
- **Identity and naming**, such as ENS.

## Security basics for dApp builders

- **The contract is the security boundary.** Never rely on the front end to block an action. Anyone can call the contract directly.
- **Ask for the smallest token approval** that works.
- **Show users what they are signing** in plain words.
- **Protect your domain and hosting.** Attackers have replaced the front ends of real projects with versions that drain wallets.
- **Test and audit the contracts.** See [smart contract security best practices](/blogs/smart-contract-security-and-optimization).

## FAQ

### What does dApp stand for?

Decentralized application. It is an app whose back-end logic runs in smart contracts on a blockchain.

### Do I need crypto to use a dApp?

To read data, usually not. To make changes you need a wallet and a small amount of the chain's coin for gas. Some dApps pay the gas for their users.

### What language are dApps written in?

Contracts are usually written in Solidity for EVM chains or Rust for Solana. The front end is written in JavaScript or TypeScript, commonly with React.

### Is a dApp safer than a normal app?

It removes the risk of a company misusing a private database. It adds the risks of contract bugs, fake websites, and mistakes that cannot be undone.
