---
title: What Is an ABI in Ethereum? Smart Contract ABI Explained
description: An ABI describes a smart contract's functions so apps can call them. Learn what is in an ABI, how calls are encoded, and how to use one in code.
tags: ABI, Ethereum, dApp Development
keywords: what is abi, what is an abi ethereum, smart contract abi, abi explained, how to get contract abi, abi encoding, function selector
cover: flow file-json binary file-code
---

An **ABI**, or **Application Binary Interface**, is a description of a smart contract's functions, events, and errors, written as JSON. A deployed contract is only bytecode, and the blockchain stores no function names. The ABI tells your app how to turn a call such as `transfer(address, 100)` into the raw bytes the contract expects, and how to turn the bytes that come back into values you can read.

## Why an ABI is needed

When Solidity code is compiled, two things come out:

- **Bytecode:** the machine code that is deployed to the chain.
- **ABI:** a JSON description of how to talk to that bytecode.

The EVM understands only bytes. A transaction to a contract carries a field called `data`, which looks like this:

```text
0xa9059cbb000000000000000000000000ab5801a7d398351b8be11c439e05c5b3259aec9b0000000000000000000000000000000000000000000000000000000000000064
```

Without the ABI, neither you nor your app can know that this means "call `transfer`, send 100 units to address `0xAb58...`".

**An ABI is to a smart contract what an API description is to a web service.** It lists what you can call and with which inputs. See [what an API is](/blogs/what-is-an-api).

## What an ABI looks like

For this function:

```solidity
function transfer(address to, uint256 amount) external returns (bool);
event Transfer(address indexed from, address indexed to, uint256 value);
```

the ABI contains:

```json
[
  {
    "type": "function",
    "name": "transfer",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "event",
    "name": "Transfer",
    "anonymous": false,
    "inputs": [
      { "name": "from", "type": "address", "indexed": true },
      { "name": "to", "type": "address", "indexed": true },
      { "name": "value", "type": "uint256", "indexed": false }
    ]
  }
]
```

### The fields

| Field | Meaning |
|---|---|
| `type` | `function`, `event`, `error`, `constructor`, `fallback`, or `receive` |
| `name` | The function or event name |
| `inputs` | Parameters, with name and type |
| `outputs` | Return values |
| `stateMutability` | `pure`, `view`, `nonpayable`, or `payable` |
| `indexed` | For events: whether the value can be searched |

`stateMutability` tells an app how to call the function:

- **`view` and `pure`:** read only. Called for free, with no transaction.
- **`nonpayable`:** changes state. Needs a transaction and gas.
- **`payable`:** changes state and can receive ETH.

Only `external` and `public` functions appear in the ABI. See [public vs external](/blogs/solidity-public-vs-external).

## How a function call is encoded

The `data` of a call has two parts.

### 1. The function selector (4 bytes)

Take the function **signature**: the name plus the parameter types, with no spaces and no parameter names.

```text
transfer(address,uint256)
```

Hash it with Keccak-256 and keep the first 4 bytes:

```text
keccak256("transfer(address,uint256)") = 0xa9059cbb2ab09eb2...
selector = 0xa9059cbb
```

The contract's bytecode begins with a lookup: "if the first 4 bytes are `a9059cbb`, jump to the transfer code".

### 2. The arguments (32 bytes each)

Each simple argument is padded on the left to 32 bytes.

```text
0xa9059cbb                                                          selector
000000000000000000000000ab5801a7d398351b8be11c439e05c5b3259aec9b    to (address)
0000000000000000000000000000000000000000000000000000000000000064    amount (100 = 0x64)
```

Dynamic types such as `string`, `bytes`, and arrays are encoded with an offset that points to where their data starts, followed by their length and content.

You do not need to do this by hand. Libraries do it for you:

```javascript
// npm install viem
import { encodeFunctionData, decodeFunctionData, parseAbi, toFunctionSelector } from "viem";

const abi = parseAbi(["function transfer(address to, uint256 amount) returns (bool)"]);

const data = encodeFunctionData({
  abi,
  functionName: "transfer",
  args: ["0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", 100n],
});
console.log(data);                                            // 0xa9059cbb0000...0064
console.log(toFunctionSelector("transfer(address,uint256)")); // 0xa9059cbb
console.log(decodeFunctionData({ abi, data }));               // { functionName: 'transfer', args: [...] }
```

## Using an ABI to call a contract

```javascript
import { createPublicClient, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({ chain: mainnet, transport: http() });

// A "human-readable" ABI: easier to write than JSON
const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]);

const token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";   // USDC on Ethereum

const [balance, decimals, symbol] = await Promise.all([
  client.readContract({ address: token, abi, functionName: "balanceOf", args: ["0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"] }),
  client.readContract({ address: token, abi, functionName: "decimals" }),
  client.readContract({ address: token, abi, functionName: "symbol" }),
]);

console.log(`${Number(balance) / 10 ** decimals} ${symbol}`);
```

You only need to include the functions you use. A partial ABI works fine.

To interact with any contract you need three things: **its address, its ABI, and a connection to the network**.

## Events and the ABI

Events are stored as logs. The ABI is needed to decode them too.

- **Topic 0** is the hash of the event signature, such as `Transfer(address,address,uint256)`.
- **Indexed parameters** become additional topics, which lets you filter by them. An event can have up to three.
- **Non-indexed parameters** go into the log's data, ABI-encoded.

```javascript
const logs = await client.getContractEvents({
  address: token,
  abi: parseAbi(["event Transfer(address indexed from, address indexed to, uint256 value)"]),
  eventName: "Transfer",
  fromBlock: "latest",
});
console.log(logs[0]?.args);   // { from, to, value }
```

## Where to get a contract's ABI

- **Your own contract:** the compiler writes it.
  - Foundry: `out/MyContract.sol/MyContract.json`, or run `forge inspect MyContract abi`.
  - Hardhat: `artifacts/contracts/MyContract.sol/MyContract.json`.
  - Remix: the "ABI" button in the compiler tab.
- **Someone else's contract:** if the source is verified, block explorers such as Etherscan show the ABI on the contract's "Code" tab and provide it through their API.
- **Standard contracts:** ERC-20, ERC-721, and other standards have well-known ABIs included in most libraries.
- **Unverified contracts:** you can still call functions if you know their signatures. Signature databases map known 4-byte selectors back to names.

## ABI and proxies

With an upgradeable contract, you send transactions to the **proxy's address** but use the **implementation's ABI**. The proxy forwards every call. Block explorers show this as "Read as Proxy" and "Write as Proxy". See [upgradeable smart contracts](/blogs/upgradeable-smart-contracts).

## ABI encoding inside Solidity

Solidity gives you the same encoding functions:

```solidity
bytes memory a = abi.encode(uint256(1), address(this));          // standard, padded
bytes memory b = abi.encodePacked(uint8(1), "hello");            // compact, no padding
bytes memory c = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
bytes memory d = abi.encodeCall(IERC20.transfer, (to, amount));  // type-checked, preferred

(uint256 x, address y) = abi.decode(a, (uint256, address));
```

**A warning about `abi.encodePacked`:** with two or more dynamic values, different inputs can produce the same bytes. `("ab", "c")` and `("a", "bc")` both give `abc`. If you hash the result for a signature or an ID, use `abi.encode` instead.

## Common problems

- **"Function not found" or a revert with no reason:** wrong ABI, wrong address, or wrong network.
- **Selector collision:** two different signatures can share the same 4 bytes. It is rare, and it matters in proxies.
- **Outdated ABI:** after a contract upgrade, your front end still uses the old ABI. Update it with each deployment.
- **Wrong types:** `uint` in a signature must be written as `uint256` when calculating a selector.
- **Blind signing:** if a wallet cannot decode the data, the user sees only hex. Verified contracts and clear ABIs let wallets show what is being signed.

## ABI vs API

| | API (web) | ABI (smart contract) |
|---|---|---|
| Describes | Endpoints of a server | Functions of a contract |
| Format | Often OpenAPI or JSON | JSON |
| Transport | HTTP | Blockchain transactions and calls |
| Data encoding | JSON text | Binary, 32-byte words |

To see where the ABI fits in a full application, read [what a dApp is](/blogs/what-is-a-dapp). To understand reads versus writes, see [transaction vs call](/blogs/ethereum-transaction-vs-call).

## FAQ

### What does ABI stand for?

Application Binary Interface. It defines how to encode calls to a smart contract and how to decode its responses.

### Is the ABI stored on the blockchain?

No. Only the bytecode is stored. The ABI is kept off-chain, in your project files or on a block explorer when the contract is verified.

### Can I call a contract without its ABI?

Yes, if you know the function signature. You can build the selector and encode the arguments yourself, or write a small ABI with just that function.

### What is a function selector?

The first 4 bytes of the Keccak-256 hash of a function's signature, such as `transfer(address,uint256)`. It tells the contract which function to run.
