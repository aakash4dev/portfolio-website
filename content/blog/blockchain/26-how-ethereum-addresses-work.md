---
title: How Are Ethereum Addresses Generated? Step-by-Step Guide
description: An Ethereum address is the last 20 bytes of the hash of a public key. See each step, with Python code, checksums, and contract address rules.
tags: Ethereum, Cryptography, Addresses
keywords: how are ethereum addresses generated, ethereum address explained, private key to address, contract address calculation, create2 address, eip-55 checksum
cover: flow key-round hash wallet
---

An Ethereum address is made in three steps: generate a random 256-bit **private key**, derive the **public key** from it with elliptic curve math, then hash the public key with **Keccak-256** and keep the **last 20 bytes**. Written in hexadecimal with `0x` in front, those 20 bytes are your address. A **contract** address is calculated differently: from the address of the account that deployed it and that account's nonce.

## The three steps

```text
Private key (32 bytes, random)
      |  elliptic curve multiplication (secp256k1)
      v
Public key (64 bytes)
      |  Keccak-256 hash
      v
Hash (32 bytes)  ->  keep the last 20 bytes  ->  Address
```

Each step works in one direction only. You cannot get the public key from the address, or the private key from the public key.

### Step 1: The private key

A private key is a random number between 1 and a little less than 2 to the power of 256. It is usually shown as 64 hexadecimal characters.

```text
0x4c0883a69102937d6231471b5dbb6204fe512961708279f2d7b1a2f3c4d5e6f7
```

The number of possible keys is about 10 to the power of 77, which is close to the number of atoms in the visible universe. Two people generating the same key by chance will not happen in practice, provided the randomness is good.

**The randomness is the whole security.** Keys made from weak sources, such as a simple phrase, a timestamp, or a broken generator, have been guessed by attackers and emptied within seconds. Always use the secure random generator of your operating system, which is what real wallets do.

### Step 2: The public key

The private key is multiplied by a fixed point on an elliptic curve called **secp256k1**, the same curve Bitcoin uses.

```text
public key = private key × G
```

`G` is a point everyone knows. The result is another point on the curve with two coordinates, x and y, each 32 bytes: 64 bytes together.

Multiplying is fast. Reversing it, to find the private key from the public key, is the **elliptic curve discrete logarithm problem**, and no known method solves it in a practical time on today's computers.

### Step 3: The address

1. Take the 64-byte public key.
2. Hash it with **Keccak-256**, which gives 32 bytes.
3. Keep the **last 20 bytes**.
4. Write them as 40 hexadecimal characters with `0x` in front.

```text
0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```

## Do it in Python

```python
# pip install eth-keys eth-utils
import secrets
from eth_keys import keys
from eth_utils import keccak, to_checksum_address

# Step 1: a random 32-byte private key
private_key_bytes = secrets.token_bytes(32)
private_key = keys.PrivateKey(private_key_bytes)

# Step 2: the public key (64 bytes: x and y)
public_key = private_key.public_key
public_key_bytes = public_key.to_bytes()

# Step 3: hash and keep the last 20 bytes
address_bytes = keccak(public_key_bytes)[-20:]
address = to_checksum_address(address_bytes)

print("Private key:", private_key)          # never print this in a real app
print("Public key: ", public_key)
print("Address:    ", address)
print(address == public_key.to_checksum_address())   # True
```

No network connection is used. An address does not need to be registered anywhere. It exists as soon as you calculate it, and the blockchain first learns of it when it receives funds or sends a transaction.

## Keccak-256 is not standard SHA-3

Ethereum uses the original **Keccak-256** design. The official SHA-3 standard, published later, changed the padding slightly, so the two give different results.

```python
import hashlib
from eth_utils import keccak

print(hashlib.sha3_256(b"hello").hexdigest())   # standard SHA-3
print(keccak(b"hello").hex())                   # Keccak-256, used by Ethereum
# The two outputs are different.
```

Using `hashlib.sha3_256` for Ethereum work is a common bug.

## The mixed-case checksum (EIP-55)

Addresses are not case-sensitive for the network, but you will see them written with mixed upper and lower case:

```text
0x71c7656ec7ab88b098defb751b7401b5f6d8976f    all lowercase: valid, no checksum
0x71C7656EC7ab88b098defB751B7401B5f6d8976F    mixed case: checksum included
```

The pattern of capitals is a **checksum**, defined in **EIP-55**:

1. Hash the lowercase address (without `0x`) with Keccak-256.
2. For each letter in the address, look at the hex digit at the same position in the hash.
3. If that digit is 8 or more, make the letter uppercase.

```python
from eth_utils import keccak

def to_checksum(address: str) -> str:
    address = address.lower().removeprefix("0x")
    digest = keccak(address.encode()).hex()
    return "0x" + "".join(
        char.upper() if int(digest[i], 16) >= 8 else char
        for i, char in enumerate(address)
    )

print(to_checksum("0x71c7656ec7ab88b098defb751b7401b5f6d8976f"))
```

If you mistype a single character, the capital pattern will almost certainly no longer match, and a wallet can warn you. Always use and store the checksummed form.

## From a seed phrase to many addresses

Wallets do not ask you to save a private key for each account. They use a **seed phrase** of 12 or 24 words, from which all keys are derived in a fixed order (the BIP-32, BIP-39, and BIP-44 standards).

```text
Seed phrase -> master key -> m/44'/60'/0'/0/0 -> first account
                          -> m/44'/60'/0'/0/1 -> second account
                          -> ...
```

The number `60` is the code for Ethereum. The same phrase always gives the same accounts, which is how you restore a wallet on a new device. See [how crypto wallets work](/blogs/how-crypto-wallets-work).

## How contract addresses are calculated

A contract has no private key. Its address is computed when it is deployed.

### CREATE: the default

```text
address = last 20 bytes of keccak256( rlp([deployer address, deployer nonce]) )
```

The **nonce** is the number of transactions the deployer account has sent, or for a contract, the number of contracts it has created. So the address of a contract is known before it is deployed.

```python
import rlp
from eth_utils import keccak, to_checksum_address, to_canonical_address

def create_address(deployer: str, nonce: int) -> str:
    encoded = rlp.encode([to_canonical_address(deployer), nonce])
    return to_checksum_address(keccak(encoded)[-20:])

print(create_address("0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 0))
```

One consequence: the same deployer account using the same nonce on two different chains gets the same contract address on both.

### CREATE2: an address you choose in advance

```text
address = last 20 bytes of keccak256( 0xff ++ deployer ++ salt ++ keccak256(init code) )
```

The address depends on the deploying contract, a **salt** you pick, and the contract's creation code. It does not depend on a nonce.

This allows:

- **The same address on every chain.**
- **Counterfactual deployment.** You can give out an address and receive funds at it before the contract exists. Smart contract wallets use this.
- **Vanity addresses**, by trying many salts.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Factory {
    function deploy(bytes32 salt) external returns (address) {
        return address(new Child{salt: salt}());
    }

    function predict(bytes32 salt) external view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(
            bytes1(0xff), address(this), salt, keccak256(type(Child).creationCode)
        ));
        return address(uint160(uint256(hash)));
    }
}

contract Child {}
```

## Two types of accounts

| | Externally owned account (EOA) | Contract account |
|---|---|---|
| Controlled by | A private key | Its code |
| Address from | The public key | Deployer and nonce, or CREATE2 |
| Can start a transaction | Yes | No, only react to one |
| Has code | No | Yes |

Both use the same 20-byte address format. You cannot tell them apart by looking. You can check by asking a node whether code exists at the address.

## Common questions about safety

**Can two people get the same address?** In theory yes, since addresses are 160 bits. The chance is so small that it is ignored in practice.

**Can someone find my private key from my address?** No. That would require reversing both a hash function and elliptic curve multiplication.

**What about quantum computers?** A large enough quantum computer could, in theory, derive a private key from a **public key**. An address that has never sent a transaction has only revealed the hash of its public key, which adds protection. Work on quantum-resistant signature schemes is under way.

**What is the zero address?** `0x0000000000000000000000000000000000000000` is used as a marker for "no address". Tokens sent to it are lost, because nobody has its private key.

## Practical tips

- **Never generate keys with your own random function.** Use a trusted wallet or library.
- **Compare the first and last characters** of an address after pasting.
- **Do not trust an address because it looks familiar.** Scammers create addresses that match the start and end of one you use.
- **Remember that the same address works on every EVM chain**, but your assets on one chain are not on another. See [what layer 2 is](/blogs/what-is-layer-2).
- **Names such as `alice.eth` point to addresses.** They are easier to read, and you should still check the resolved address.

## FAQ

### How is an Ethereum address created?

A random private key is generated, the public key is derived from it with secp256k1, the public key is hashed with Keccak-256, and the last 20 bytes of the hash become the address.

### Is an Ethereum address the same as a public key?

No. The address is the last 20 bytes of the hash of the public key. It is shorter, and the public key cannot be recovered from it alone.

### Why do Ethereum addresses have capital letters?

The mix of capital and small letters is a checksum defined in EIP-55. It lets wallets detect typing errors.

### How is a smart contract address determined?

By default from the deployer's address and nonce. With CREATE2, from the deployer, a salt, and the hash of the contract's creation code.
