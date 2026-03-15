 Alimdar Token (AT) Airdrop
BNB Chain Next.js Solidity Vercel License

Official claim airdrop dApp for Alimdar Token (AT) on BNB Smart Chain.

Overview
This project allows eligible wallets to claim their AT token allocation through a Merkle-based airdrop contract and a simple web interface deployable on Vercel.

Token Info
Token Name: Alimdar Token
Symbol: AT
Network: BNB Smart Chain
Token Address: 0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C
Airdrop Info
Distribution Type: Claim airdrop
Initial Distribution: 1,000,000 AT
Claim Method: Wallet connect + on-chain claim
Eligibility: Wallet must exist in the Merkle distribution list
Features
Claim-based airdrop
Merkle proof verification
BNB Smart Chain support
Next.js frontend ready for Vercel
Secure wallet-based claiming
Unclaimed token recovery after campaign ends
Security Notice
This website will never ask for your seed phrase
Users only need to connect a supported wallet
Claims are verified on-chain using Merkle proof validation
Users do not need to install Vercel
Environment Variables
Create .env.local:

  NEXT_PUBLIC_TOKEN_ADDRESS=0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C
NEXT_PUBLIC_AIRDROP_ADDRESS=0x9d666B91Ca9B5c1961c924136d8293Ce5C52D89e
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
Local Setup
Install dependencies:

npm install
Generate Merkle data:

npm run build:airdrop
Run locally:

npm run dev
Deploy Flow
Edit data/airdrop.csv
Run npm run build:airdrop
Deploy contracts/MerkleAirdrop.sol
Send 1,000,000 AT to the deployed airdrop contract
Set .env.local
Connect the GitHub repo to Vercel
Deploy
GitHub
Recommended repository name:

alimdar-token-airdrop
Recommended description:

Official Alimdar Token (AT) claim airdrop dApp on BNB Smart Chain.
Recommended topics:

airdrop, bnb-chain, solidity, nextjs, vercel, web3, token, merkle-airdrop
Disclaimer
Always verify the official contract address before interacting with the application.