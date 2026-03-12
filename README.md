# Alimdar Token (AT) Airdrop

![BNB Chain](https://img.shields.io/badge/Network-BNB%20Chain-yellow)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![Solidity](https://img.shields.io/badge/Smart%20Contract-Solidity-363636)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-blue)

Official claim airdrop dApp for **Alimdar Token (AT)** on **BNB Smart Chain**.

## Overview

This project allows eligible wallets to claim their **AT token allocation** through a Merkle-based airdrop contract and a simple web interface deployable on Vercel.

## Token Info

- **Token Name:** Alimdar Token
- **Symbol:** AT
- **Network:** BNB Smart Chain
- **Token Address:** `0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C`

## Airdrop Info

- **Distribution Type:** Claim airdrop
- **Initial Distribution:** `1,000,000 AT`
- **Claim Method:** Wallet connect + on-chain claim
- **Eligibility:** Wallet must exist in the Merkle distribution list

## Features

- Claim-based airdrop
- Merkle proof verification
- BNB Smart Chain support
- Next.js frontend ready for Vercel
- Secure wallet-based claiming
- Unclaimed token recovery after campaign ends

## Security Notice

- This website will **never ask for your seed phrase**
- Users only need to connect a supported wallet
- Claims are verified on-chain using Merkle proof validation
- Users do **not** need to install Vercel

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C
NEXT_PUBLIC_AIRDROP_ADDRESS=0xYOUR_AIRDROP_ADDRESS
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
```

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Merkle data:

```bash
npm run build:airdrop
```

Run locally:

```bash
npm run dev
```

## Deploy Flow

1. Edit `data/airdrop.csv`
2. Run `npm run build:airdrop`
3. Deploy `contracts/MerkleAirdrop.sol`
4. Send `1,000,000 AT` to the deployed airdrop contract
5. Set `.env.local`
6. Connect the GitHub repo to Vercel
7. Deploy

## GitHub

Recommended repository name:

```text
alimdar-token-airdrop
```

Recommended description:

```text
Official Alimdar Token (AT) claim airdrop dApp on BNB Smart Chain.
```

Recommended topics:

```text
airdrop, bnb-chain, solidity, nextjs, vercel, web3, token, merkle-airdrop
```

## Disclaimer

Always verify the official contract address before interacting with the application.
