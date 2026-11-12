---
title: What Are Stablecoins? Types, How They Work, and Risks
description: A stablecoin is a crypto token made to stay at a fixed value, usually one US dollar. Learn the types, how the peg holds, and what can go wrong.
tags: Stablecoins, DeFi, Crypto Basics
keywords: what are stablecoins, stablecoins explained, how do stablecoins work, usdt vs usdc, types of stablecoins, are stablecoins safe
cover: hero circle-dollar-sign landmark scale shield-check anchor
---

A **stablecoin** is a cryptocurrency designed to keep a steady value, most often **one US dollar**. Unlike Bitcoin or ETH, its price is meant not to move. Stablecoins do this by holding reserves such as cash and government bonds, by locking up other crypto as collateral, or by using algorithms. They are the main money of the crypto economy, used for trading, payments, savings, and sending funds across borders.

## Why stablecoins exist

Bitcoin and ETH can move 10 percent in a day. That makes them hard to use for prices, salaries, or loans.

Moving back to a bank every time you want to avoid that risk is slow and costly. A stablecoin gives you a dollar-like asset that stays **on the blockchain**:

- It moves in seconds, at any hour, to anyone with a wallet.
- It works inside smart contracts.
- It gives people in countries with high inflation access to a more stable currency.

## How a stablecoin stays at one dollar

The fixed price is called the **peg**. The peg holds mainly through **arbitrage**, when the token can be exchanged with the issuer for real value.

Say an issuer promises to create or redeem tokens at exactly one dollar each:

- **The market price falls to 0.98.** Traders buy the token at 0.98 and redeem it with the issuer for 1.00. Their buying pushes the price back up.
- **The market price rises to 1.02.** Traders give the issuer 1.00, receive a new token, and sell it for 1.02. Their selling pushes the price back down.

The peg is only as strong as the promise behind it. If people doubt that redemption will work, the price falls and stays down.

## The four types of stablecoins

### 1. Fiat-backed

A company holds reserves in the traditional financial system and issues one token for each dollar held.

- **Reserves:** cash, short-term US government bonds, and similar assets.
- **Examples:** USDT (Tether), USDC (Circle), PYUSD (PayPal).
- **For:** simple, stable, very liquid.
- **Against:** you must trust the company and its banks. The issuer can **freeze** tokens in any address. It is centralized.

This type makes up most of the stablecoin market.

### 2. Crypto-backed

Users lock up crypto in a smart contract and mint stablecoins against it. Because crypto prices move, the loan is **over-collateralized**.

- **Example:** deposit ETH worth 150, mint 100 DAI.
- If the collateral's value falls too far, the position is **liquidated**: the collateral is sold to repay the debt.
- **Examples:** DAI and USDS (Sky, formerly MakerDAO), LUSD (Liquity), GHO (Aave).
- **For:** transparent, since the collateral is visible on-chain. Less dependent on a company.
- **Against:** needs more capital than it creates. It depends on fast liquidations and reliable price oracles. See [blockchain oracles explained](/blogs/blockchain-oracles-explained).

Many of these now hold fiat-backed stablecoins or tokenized government bonds as part of their collateral, so they are less independent than they first appear.

### 3. Algorithmic

These try to hold the peg with little or no collateral, by automatically growing and shrinking supply, often using a second token to absorb price changes.

- **For:** capital-efficient in theory.
- **Against:** they depend on confidence. When confidence breaks, they can enter a **death spiral**.

**The TerraUSD collapse.** In May 2022, the algorithmic stablecoin UST lost its peg. The system created large amounts of its partner token LUNA to defend it, which crashed LUNA's price, which reduced confidence further. Within days, both were nearly worthless, and tens of billions of dollars in value were gone. This event ended most trust in uncollateralized designs.

### 4. Commodity-backed and yield-bearing

- **Commodity-backed:** tokens backed by gold or other assets, such as PAXG.
- **Synthetic dollars:** tokens that hold the peg with a hedged position, such as holding crypto and an equal short position in futures. USDe (Ethena) works this way. The return comes from market conditions that can reverse.
- **Yield-bearing:** tokens that pass interest from government bonds to holders.

| Type | Backing | Trust placed in | Main risk |
|---|---|---|---|
| Fiat-backed | Cash and bonds | The issuer and its banks | Reserve quality, freezing, regulation |
| Crypto-backed | Excess crypto collateral | Smart contracts and oracles | Collateral crash, contract bugs |
| Algorithmic | Little or none | Market confidence | Death spiral |
| Synthetic | Hedged positions | Exchanges and market conditions | Hedge failure, negative funding |

## USDT vs USDC

| | USDT (Tether) | USDC (Circle) |
|---|---|---|
| Launched | 2014 | 2018 |
| Size | Largest | Second largest |
| Strongest in | Global trading, emerging markets | US-regulated use, DeFi |
| Transparency | Regular attestation reports | Regular attestation reports, mostly cash and short-term government bonds |
| Can freeze addresses | Yes | Yes |

Both have held their peg through most market stress, with short exceptions. In March 2023, USDC briefly fell to about 0.88 after part of its cash reserve was caught in the failure of Silicon Valley Bank. It recovered within days when the deposits were guaranteed. The event showed that a fiat-backed stablecoin carries the risks of the banking system.

## What stablecoins are used for

- **Trading.** Most crypto trades are priced in a stablecoin.
- **DeFi.** Lending, borrowing, and liquidity pools. See [what DeFi is](/blogs/what-is-defi).
- **Payments and remittances.** Sending money across borders in minutes for a small fee.
- **Savings** in countries with unstable currencies.
- **Payroll and business payments** for international teams.
- **Settlement** between financial companies.

Stablecoins are one of the clearest cases of blockchain technology being used for something other than speculation.

## For developers: stablecoins are ERC-20 tokens

On EVM chains a stablecoin is an ERC-20 token, with some traps to know.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Payments {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;

    constructor(IERC20 _usdc) {
        usdc = _usdc;
    }

    // The user must first call usdc.approve(address(this), amount)
    function pay(address merchant, uint256 amount) external {
        usdc.safeTransferFrom(msg.sender, merchant, amount);
    }
}
```

- **Decimals differ.** USDC and USDT use **6 decimals**, not 18. One USDC is `1000000`. DAI uses 18. Hard-coding 18 is a common and costly bug.
- **USDT does not follow the standard exactly.** On Ethereum, its `transfer` returns no value, which breaks contracts that expect a boolean. Use OpenZeppelin's **SafeERC20**, as above.
- **Addresses can be frozen or blocked.** A transfer can fail because the sender or receiver is on a blacklist. Design so one blocked address cannot lock everyone's funds.
- **The contracts are upgradeable.** The issuer can change the code. See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).
- **The same name on different chains can be different tokens.** A bridged version is not the same as one issued natively. See [blockchain bridges explained](/blogs/blockchain-bridges-explained).
- **Do not assume the price is exactly one.** In lending and liquidation logic, use a price feed and plan for a depeg.

To create a simple token of your own, see [how to create an ERC-20 token](/blogs/create-erc20-token).

## The risks

- **Depeg.** The price falls below one dollar, for a short time or for good.
- **Reserve risk.** The backing assets may be worth less than claimed, or hard to sell quickly.
- **Bank risk.** Reserves in a bank that fails can be stuck.
- **Freezing and censorship.** A centralized issuer can freeze your tokens, by its own choice or under legal order.
- **Smart contract risk.** Bugs in the token or the system behind it.
- **Regulatory risk.** New laws can restrict a stablecoin in your country. Regions such as the European Union and the United States have passed specific stablecoin rules, and requirements continue to develop.
- **Bridge risk.** A bridged stablecoin depends on the bridge staying secure.
- **No deposit insurance.** A stablecoin is not a bank deposit. In most places, no government scheme covers losses.
- **Yield that is too good.** A high return on a "stable" asset means a risk is being taken somewhere. Before 2022, one platform offered about 20 percent on UST.

## How to choose and use a stablecoin

1. **Prefer large, long-standing stablecoins** with regular public reports on their reserves.
2. **Check how it is backed.** If you cannot understand where the stability comes from, do not hold much of it.
3. **Spread your holdings** across more than one if the amount matters to you.
4. **Use the natively issued version** on your chain when one exists.
5. **Verify the token's contract address** from the issuer's official site. Fake tokens with the same name are common.
6. **Keep your own keys** for long-term holdings. See [how crypto wallets work](/blogs/how-crypto-wallets-work).
7. **Keep the chain's own coin for fees.** You need ETH to move USDC on Ethereum. See [what gas fees are](/blogs/what-is-gas-fee).

## FAQ

### What is a stablecoin in simple words?

It is a crypto token built to always be worth the same amount, usually one US dollar, so that it can be used like digital cash.

### Are stablecoins safe?

They are far more stable than other crypto, but not risk-free. They can lose their peg, the issuer can fail or freeze funds, and they are not covered by deposit insurance.

### What is the difference between USDT and USDC?

Both are dollar-backed stablecoins from private companies. USDT is larger and widely used in global trading. USDC is issued by a US-based company and is often preferred where regulation and reserve transparency matter most.

### How do stablecoin issuers make money?

Mainly from interest on the reserves. They hold the dollars in government bonds and similar assets and keep most of the interest, while holders of the token usually receive none.
