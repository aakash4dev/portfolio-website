---
title: How to Create an ERC-20 Token: Step-by-Step With Solidity
description: Create your own crypto token on Ethereum. Write an ERC-20 contract with OpenZeppelin, test it, deploy to a test network, and verify the code.
tags: ERC-20, Solidity, Tutorial
keywords: how to create a token, how to create a token in crypto, create erc20 token, how to make your own cryptocurrency, erc20 token tutorial, deploy token solidity
cover: code SOL coins
---

To create a crypto token, you write a small smart contract that follows the **ERC-20** standard, test it, and deploy it to a blockchain. Using the audited OpenZeppelin library, the contract is fewer than 15 lines. This guide covers the contract, tests, deployment to a free test network, and the safety and legal points you should know before going further.

## What an ERC-20 token is

**ERC-20** is the standard interface for fungible tokens on Ethereum and all EVM chains. "Fungible" means every unit is identical, like money. USDC, LINK, and UNI are ERC-20 tokens.

A token is not a separate blockchain. It is a smart contract that keeps a table of balances:

```text
0xAb5...  ->  1,000 tokens
0x91c...  ->    250 tokens
```

"Sending" a token means calling the contract to update that table. See [what a smart contract is](/blogs/what-is-a-smart-contract).

Because every ERC-20 token has the same functions, any wallet or exchange can support any token with no custom code.

### The standard functions

| Function | What it does |
|---|---|
| `totalSupply()` | Total number of tokens in existence |
| `balanceOf(account)` | Balance of one address |
| `transfer(to, amount)` | Send your tokens to someone |
| `approve(spender, amount)` | Allow another address to spend your tokens |
| `allowance(owner, spender)` | How much a spender may still spend |
| `transferFrom(from, to, amount)` | Spend tokens you were approved for |

`approve` plus `transferFrom` is how exchanges and other contracts move tokens for you. You approve first, then the contract pulls the tokens.

### Decimals

Solidity has no decimal numbers. A token with 18 decimals stores "1 token" as `1000000000000000000` (1 followed by 18 zeros). Wallets divide by `10^18` for display. Most tokens use 18. USDC uses 6.

## Step 1: Set up the project

This guide uses **Foundry**. See [Hardhat vs Foundry](/blogs/hardhat-vs-foundry) if you want to compare tools.

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup

forge init my-token
cd my-token
forge install OpenZeppelin/openzeppelin-contracts
```

Add this line to `remappings.txt` so the imports resolve:

```text
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
```

**Want to skip the setup?** Paste the contract below into Remix at `remix.ethereum.org`, which runs in the browser. Remix downloads the OpenZeppelin imports automatically.

## Step 2: Write the token contract

Create `src/MyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("My Token", "MTK") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

That is a complete token.

- `is ERC20` inherits all the standard functions from OpenZeppelin's tested code.
- `ERC20("My Token", "MTK")` sets the name and symbol.
- `_mint` creates the starting supply and gives it to the deployer.
- Multiplying by `10 ** decimals()` converts whole tokens to the smallest unit.

**Why not write it from scratch?** Token contracts hold real value, and small mistakes are costly. OpenZeppelin's code has been reviewed by many auditors and is used by thousands of projects.

## Step 3: Add optional features

Add only what you need. Every feature is more code that can go wrong and more power that holders must trust you with.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor()
        ERC20("My Token", "MTK")
        ERC20Capped(10_000_000 * 10 ** 18)      // can never exceed 10 million
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
```

| Feature | What it adds | Trade-off |
|---|---|---|
| **Burnable** | Holders can destroy their own tokens | Low risk |
| **Capped** | A hard maximum supply | Reassures holders |
| **Mintable** (owner) | Owner can create new tokens | Holders must trust the owner |
| **Pausable** | Owner can freeze all transfers | Strong central control |
| **Permit** | Approvals by signature, saving a transaction | Low risk |

The OpenZeppelin Contracts Wizard on their website generates this code from checkboxes.

## Step 4: Test it

Create `test/MyToken.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address alice = address(0xA11CE);

    function setUp() public {
        token = new MyToken();
    }

    function test_InitialSupplyGoesToDeployer() public view {
        assertEq(token.balanceOf(address(this)), 1_000_000 ether);
    }

    function test_Transfer() public {
        token.transfer(alice, 100 ether);
        assertEq(token.balanceOf(alice), 100 ether);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(alice);
        vm.expectRevert();
        token.mint(alice, 1 ether);
    }

    function test_CannotMintAboveCap() public {
        vm.expectRevert();
        token.mint(alice, 10_000_000 ether);
    }
}
```

```bash
forge test
```

In Solidity, `ether` is simply shorthand for `10^18`, which matches the 18 decimals.

## Step 5: Deploy to a test network

Use a test network first. Test coins are free and have no value.

1. Create a wallet that you use **only for development**.
2. Get free Sepolia test ETH from a faucet.
3. Get an RPC URL from a node provider, or use a public one.

```bash
export RPC_URL="https://your-sepolia-rpc-url"
export PRIVATE_KEY="your-test-wallet-private-key"

forge create src/MyToken.sol:MyToken \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast
```

The output shows `Deployed to:` followed by your token's address.

**Never** paste the private key of a wallet that holds real funds into a terminal or a file. For real deployments, use an encrypted keystore (`cast wallet import`) or a hardware wallet.

## Step 6: Verify and view the token

Verification publishes your source code on the block explorer so anyone can read it.

```bash
forge verify-contract <TOKEN_ADDRESS> src/MyToken.sol:MyToken \
  --chain sepolia \
  --etherscan-api-key "$ETHERSCAN_API_KEY"
```

To see the token in your wallet, choose "Import token" and paste the contract address.

## Before deploying to a real network

- **Deployment costs gas.** On Ethereum mainnet this can be significant. On a layer 2 it is very low. See [what gas fees are](/blogs/what-is-gas-fee) and [what layer 2 is](/blogs/what-is-layer-2).
- **The contract cannot be edited afterwards.** Test everything first.
- **Decide who holds the owner key.** For anything serious, use a multisig wallet, or give up ownership if no admin functions are needed.
- **A token has no price by itself.** Value appears only if people trade it, which needs liquidity on an exchange.
- **Get an audit** if the token will hold meaningful value or has custom logic.

## Legal and ethical points

Creating a token is easy. Selling one to the public is a legal matter.

- In many countries, a token sold with a promise of profit can count as a **security**, with strict rules.
- Tax and anti-money-laundering rules may apply.
- Launching a token to collect money and then abandoning it is a **rug pull**. It is fraud.

Speak to a lawyer before you sell a token to anyone.

## FAQ

### How much does it cost to create a token?

On a test network it is free. On a real network you pay the gas fee for deployment, which ranges from well under a dollar's worth on layer 2 networks to much more on Ethereum mainnet when it is busy.

### Can I create a token without coding?

Yes. Tools such as the OpenZeppelin Wizard generate the contract, and Remix deploys it from the browser. You should still understand what the code does before you put value in it.

### What is the difference between a coin and a token?

A coin is the native asset of its own blockchain, such as ETH or BTC. A token is created by a smart contract on an existing blockchain.

### Can I change my token after deployment?

Not the code, unless you built it as an upgradeable contract. You can only use the functions you included, such as minting if you added it. See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).
