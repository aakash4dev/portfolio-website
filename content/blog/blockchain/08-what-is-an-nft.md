---
title: What Is an NFT? How Non-Fungible Tokens Really Work
description: An NFT is a unique token on a blockchain that records who owns an item. Learn how NFTs work, what you really own, real uses, and the risks.
tags: NFT, ERC-721, Digital Ownership
keywords: what is nft, what is nft in crypto, nft explained, how do nfts work, nft in blockchain, what is nft art
cover: hero image fingerprint tag wallet link
---

An **NFT**, or **non-fungible token**, is a unique token on a blockchain that records who owns a specific item. "Non-fungible" means it cannot be swapped one for one with another token, because each one is different. An NFT is an ownership record, similar to a certificate. The image, video, or other item it points to is usually stored somewhere else.

## Fungible vs non-fungible

**Fungible** things are interchangeable. One 10-rupee note is the same as any other 10-rupee note. One bitcoin equals any other bitcoin.

**Non-fungible** things are unique. A concert ticket for seat A12 is not the same as one for seat Z40. A house deed, a signed painting, and a passport are all non-fungible.

| | Fungible token | Non-fungible token |
|---|---|---|
| Each unit | Identical | Unique |
| Divisible | Yes: you can send 0.5 | No: you own the whole token |
| Common standard | ERC-20 | ERC-721 |
| Example | USDC, ETH | A ticket, an artwork, a domain name |

## How an NFT works

An NFT is an entry in a smart contract. The contract keeps a list:

```text
Token 1  -> owned by 0xAb5...
Token 2  -> owned by 0x91c...
Token 3  -> owned by 0xAb5...
```

When you buy token 2, the contract changes the owner of token 2 to your address. Every node on the network records the change, and anyone can check it. See [what a smart contract is](/blogs/what-is-a-smart-contract).

### The parts of an NFT

- **Contract address:** the collection it belongs to.
- **Token ID:** a number that is unique within that collection.
- **Owner:** the wallet address that holds it.
- **Metadata link (token URI):** a link to a file that describes the item.

The metadata is usually a small JSON file:

```json
{
  "name": "Sunset #42",
  "description": "A hand-drawn sunset over the sea.",
  "image": "ipfs://bafybeigdyr.../sunset-42.png",
  "attributes": [
    { "trait_type": "Sky", "value": "Orange" },
    { "trait_type": "Rarity", "value": "Rare" }
  ]
}
```

### Where the image is stored

Storing a full image on a blockchain is very expensive, so most NFTs store only the link. The image itself lives:

- **On IPFS or Arweave:** decentralized storage. The link is based on the file's content, so the file cannot be swapped without changing the link. This is the better choice.
- **On a normal web server:** if the company stops paying for the server, the image disappears and the NFT points to nothing.
- **Fully on-chain:** a few collections store the artwork in the contract itself. This is the most durable and the most costly.

## What you own, and what you do not

This is the most misunderstood part.

**You own:** the token. Your wallet address is recorded as its owner, and only you can transfer or sell it.

**You usually do not own:**

- **The copyright.** Unless the creator's terms give it to you, you cannot use the image commercially.
- **The only copy.** Anyone can save the image. What they cannot copy is the ownership record.
- **A guarantee of value.** The token is worth what someone will pay.

A fair comparison is a signed print from an artist. Copies of the picture exist everywhere. Yours is the one with the provable link to the artist.

## A minimal NFT contract

The **ERC-721** standard defines the functions every NFT contract has, so that all wallets and marketplaces can work with any collection.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyCollection is ERC721URIStorage, Ownable {
    uint256 private nextId = 1;

    constructor() ERC721("My Collection", "MYC") Ownable(msg.sender) {}

    function mint(address to, string calldata uri) external onlyOwner returns (uint256) {
        uint256 id = nextId++;
        _safeMint(to, id);
        _setTokenURI(id, uri);
        return id;
    }
}
```

**Minting** means creating a new token. Here only the contract owner can mint, and each token gets its own metadata link. The OpenZeppelin library provides the tested standard code.

Another standard, **ERC-1155**, lets one contract hold many token types, both unique and identical. It is common in games.

## What NFTs are used for

- **Digital art and collectibles.** The first popular use.
- **Tickets.** Proof of entry that is hard to fake, with resale rules set by the organizer.
- **Gaming items.** Skins, weapons, and characters that players can trade.
- **Domain names.** Names such as `alice.eth` that work as wallet addresses.
- **Membership and access.** Holding a token opens a community, a product, or an event.
- **Certificates.** Diplomas and licenses that can be checked instantly.
- **Real-world assets.** Tokens linked to property, luxury goods, or invoices. The legal link to the physical item is the hard part.
- **Positions in DeFi.** Some protocols represent a user's deposit as an NFT. See [what DeFi is](/blogs/what-is-defi).

## How to buy or create an NFT

1. Set up a wallet and keep the seed phrase safe. See [how crypto wallets work](/blogs/how-crypto-wallets-work).
2. Get the coin of the chain you will use, to pay for the item and for [gas fees](/blogs/what-is-gas-fee).
3. Go to a marketplace or the project's official site. Check the address carefully.
4. Connect your wallet and buy, or use the create option to mint your own.

Many marketplaces support "lazy minting", where the NFT is only created on-chain when someone buys it, so the creator pays no fee in advance.

## The risks

- **Prices can fall to zero.** After the boom of 2021 and 2022, most collections lost nearly all their value. Treat any purchase as money you may not get back.
- **Scams.** Fake collections copy real ones. Fake websites ask you to sign a transaction that gives away all your NFTs.
- **Wash trading.** Sellers trade with themselves to fake demand.
- **Rug pulls.** A team sells out a collection and disappears.
- **Broken links.** If the image is on a normal server, it can vanish.
- **Stolen art.** People mint work they did not create.
- **Malicious airdrops.** Unknown NFTs that appear in your wallet may link to phishing sites. Do not interact with them.

**Safety habits:** check the contract address against the project's official channels, never sign a transaction you do not understand, and keep valuable NFTs in a wallet you do not connect to new sites.

## FAQ

### What does NFT stand for?

Non-fungible token. It is a unique token on a blockchain that cannot be exchanged one for one with another token.

### Can I just screenshot an NFT?

You can copy the image, but not the ownership record. The blockchain still shows the real owner, and only that owner can sell the token.

### Are NFTs dead?

The speculation boom ended and most collectibles lost their value. The technology is still used for tickets, game items, domain names, memberships, and tokenized assets.

### Which blockchain is used for NFTs?

Ethereum is the largest. Many NFTs are also on its layer 2 networks, Solana, Polygon, and Bitcoin through a system called Ordinals.
