# BNB deploy bilješka

## Token
- AT token: `0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C`

## Mreža
- BNB Smart Chain
- Chain ID: `56`
- RPC primjer: `https://bsc-dataseed.binance.org`

## Što još treba prije live deploya
- stvarni `data/airdrop.csv`
- generiran `data/merkle.json`
- deployana airdrop contract adresa
- 1,000,000 AT poslanih na airdrop contract

## Frontend env
```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0xe3deD38452dad3CE0C2260e8bB80BE83d153b68C
NEXT_PUBLIC_AIRDROP_ADDRESS=0x99E319d418A44eb070fa7dc45E06d881d809a17b
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org
```
