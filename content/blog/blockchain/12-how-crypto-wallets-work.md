---
title: How Do Crypto Wallets Work? Keys, Seed Phrases, and Safety
description: A crypto wallet stores keys, not coins. Learn how private keys, public keys, addresses, and seed phrases work, and how to keep funds safe.
tags: Wallets, Security, Crypto Basics
keywords: crypto wallet how does it work, how to create crypto wallet, how to use crypto wallet, what is a seed phrase, private key vs public key, hot wallet vs cold wallet
cover: hero wallet key-round lock fingerprint shield-check
---

A **crypto wallet** does not hold coins. Your coins are records on a blockchain. The wallet holds your **private keys**, which are secret numbers that prove you own those records and let you sign transactions to move them. Whoever has the private key controls the funds. If you lose the key and its backup, nobody can recover the funds for you.

## The three things a wallet manages

### Private key

A very large random number, kept secret. It works like a password that can never be changed and never be reset.

```text
Private key (example, never use):
0x4c0883a69102937d6231471b5dbb6204fe512961708279f2d7b1a2f3c4d5e6f7
```

### Public key

Calculated from the private key with one-way math (elliptic curve cryptography). Going from private to public is easy. Going back is not possible in practice.

### Address

A shorter form of the public key. This is what you share to receive funds, like an account number.

```text
Private key  --(one-way math)-->  Public key  --(hash)-->  Address
   secret                           can share               can share
```

| | Can you share it? | Used for |
|---|---|---|
| Address | Yes | Receiving funds |
| Public key | Yes | Checking your signatures |
| Private key | **Never** | Signing transactions |
| Seed phrase | **Never** | Restoring all your keys |

The steps for Ethereum are explained in [how Ethereum addresses work](/blogs/how-ethereum-addresses-work).

## How a transaction is signed

When you send funds:

1. Your wallet builds a message: "send this amount from my address to that address".
2. The wallet **signs** the message with your private key. The signature is a piece of data that only your key could produce for that exact message.
3. The wallet sends the message and signature to the network.
4. Every node checks the signature against your public key. If it matches, the transaction is valid.

Your private key never leaves the wallet. Only the signature is sent.

## What a seed phrase is

Managing a separate private key for every account would be painful. Modern wallets create all your keys from a single **seed phrase**, also called a recovery phrase: a list of 12 or 24 common words.

```text
Example only, never use:
army van defense carry jealous true garbage claim echo media make crunch
```

The same phrase always produces the same keys, in the same order. So:

- **With the phrase, you can restore your whole wallet** on any device, even if your phone is destroyed.
- **Anyone else with the phrase can do the same** and take everything.

The words come from a standard list of 2,048 words (the BIP-39 standard). A 12-word phrase has about 2 to the power of 128 possible combinations, which cannot be guessed.

One phrase can create accounts on many blockchains, because each chain derives its keys along a different path.

## Create a wallet in code

This shows there is nothing mysterious in a wallet. It uses the `ethers` library.

```javascript
// npm install ethers
import { Wallet, verifyMessage } from "ethers";

const wallet = Wallet.createRandom();
console.log("Address:    ", wallet.address);
console.log("Seed phrase:", wallet.mnemonic.phrase);   // never print this in a real app

// Sign a message and check who signed it
const signature = await wallet.signMessage("Hello");
console.log(verifyMessage("Hello", signature) === wallet.address);   // true
```

Creating a wallet needs no internet connection and no registration. It is only math on your own device.

## Types of wallets

### Custodial vs non-custodial

| | Custodial | Non-custodial (self-custody) |
|---|---|---|
| Who holds the keys | A company, such as an exchange | You |
| Forgot your password | The company can reset it | No reset. The seed phrase is the only backup |
| Main risk | The company is hacked, fails, or freezes your account | You lose the phrase or get tricked |
| Example | An exchange account | MetaMask, Trust Wallet, Ledger |

The saying "not your keys, not your coins" refers to this. In a custodial wallet you hold a promise from a company.

### Hot vs cold

- **Hot wallet:** keys are on a device connected to the internet, such as a phone app or browser extension. Convenient for daily use. More exposed to malware and phishing.
- **Cold wallet:** keys are kept offline, usually on a **hardware wallet**, a small device that signs transactions inside itself and never reveals the key. Best for savings.

A common setup: a hot wallet with a small amount for everyday use, and a hardware wallet for the rest.

### Smart contract wallets

A newer type where the wallet is a smart contract, not just a key pair. This allows features normal wallets lack:

- Recovery through trusted contacts if you lose a key
- Spending limits
- Several signatures required for large payments
- Login with a passkey or fingerprint
- Someone else paying the gas fee

This approach is called **account abstraction**. A **multisig** wallet, which needs for example 2 of 3 keys to approve a transaction, is the form most used by teams and DAOs.

## How to set up a wallet safely

1. **Download from the official site or app store.** Fake wallet apps are a common trap.
2. **Create a new wallet** and write the seed phrase **on paper**.
3. **Store the paper somewhere safe** from fire, water, and other people. Consider a second copy in another location.
4. **Never store the phrase digitally.** No photos, no cloud notes, no email, no password in a chat app.
5. **Send a small test amount first**, then try restoring the wallet from the phrase before you trust it with more.

## The main ways people lose crypto

- **Phishing.** A fake website or "support agent" asks for your seed phrase. **No real service will ever ask for it.**
- **Malicious approvals.** You sign a transaction that gives a contract permission to move all of a token. Read every prompt, and revoke approvals you no longer need.
- **Fake airdrops and unknown tokens** that lead to scam sites.
- **Clipboard malware** that replaces a copied address with the attacker's. Check the first and last characters after pasting.
- **Address poisoning.** Scammers send tiny transactions from an address that looks like one you use, hoping you copy it from your history.
- **Wrong network.** Sending tokens on a chain the receiver does not support.
- **Lost seed phrase.** No backup means no recovery.
- **Blind signing.** Approving something on a hardware wallet without reading the details.

## Good habits

- Use a hardware wallet for anything you cannot afford to lose.
- Use a separate wallet for trying new apps.
- Bookmark the sites you use and open them from the bookmark.
- Be suspicious of urgency. Scams depend on rushing you.
- Keep some of the chain's own coin for fees. See [what gas fees are](/blogs/what-is-gas-fee).
- Tell a trusted person how your backup can be found if something happens to you.

## FAQ

### Where are my coins actually stored?

On the blockchain, as a balance linked to your address. The wallet stores the keys that control that balance.

### What happens if I lose my phone?

Install the wallet on a new device and enter your seed phrase. All your accounts and balances return. Without the phrase, the funds cannot be recovered.

### Can someone steal my crypto with only my wallet address?

No. An address only lets people send you funds or view your public balance. They need your private key, your seed phrase, or a signature from you.

### Which is safer, a hot wallet or a cold wallet?

A cold wallet is safer because the keys stay offline. A hot wallet is more convenient. Many people use both: cold for savings and hot for small daily amounts.
