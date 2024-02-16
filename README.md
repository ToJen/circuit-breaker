# VeriZK


<img src="./docs/Logo.png" alt="Logo" width="200" />

## TL;DR: 

- VeriZK uses Zero-Knowledge Proofs and Machine Learning to certify smart contract security in the DeFi ecosystem without exposing source code, targeting developers who prioritize both privacy and integrity.
- Our **Goal** is to : use zkML to prove the absence of vulnerabilities in (closed-) source code. VeriZK leverages zkML (Zero-Knowledge Machine Learning) to prove the absence of vulnerabilities in (closed-) source code, particularly focusing on smart contracts within the decentralized finance (DeFi) ecosystem.

## Storytelling : User Experience 

Imagine you've poured countless hours into crafting the perfect smart contract, only to face the daunting task of proving its safety without revealing your confidential source code.

Enter VeriZK! With VeriZK, developers can now confidently showcase the integrity of their contracts without compromising their code's confidentiality. Through Zero-Knowledge Proofs and Machine Learning, VeriZK empowers you to demonstrate your contract's reliability while keeping your code private. Say goodbye to sleepless nights worrying about rug pulls or vulnerabilities – VeriZK has got your back, ensuring your creations are as trustworthy as they are confidential.

## Architecture 

- **Circuit** : Utilizes Zero-Knowledge Proofs in [Noir Language](https://noir-lang.org/docs/getting_started/installation/) to validate machine learning inferences on smart contract bytecode, ensuring privacy and integrity without revealing the bytecode.
- **Oracle** : A Rust-built intermediary that securely connects off-chain machine learning predictions with on-chain smart contract decisions, enhancing contracts without exposing underlying data or models.
- **Machine Learning**: Analyzes smart contract bytecode to infer properties or vulnerabilities, acting as a privacy-preserving tool that abstracts complex contract logic for secure validation.

## How it's Made



## Technologies Used

### AZTEC 

Noir Language is used to .. 

### SINDRI 

Sindri is used 

### SCROLL 

- Custom verification of smart contracts using Foundry : after deploying contracts, verification process is as follow :
```
forge verify-contract \
    --num-of-optimizations 10 \
    --watch \
    --constructor-args  $(cast abi-encode "constructor(uint256)" 1000) \
    --verifier etherscan \
    --verifier-url https://api-sepolia.scrollscan.dev/api \
    --etherscan-api-key D62920783A4311EE9D6600155D570C742E \
    --compiler-version v0.8.20+commit.a1b79de6 \
     \
    
``` 

### AVAIL 



# Instructions:

```
cd frontend
yarn install
yarn chain
yarn deploy
yarn start
```
