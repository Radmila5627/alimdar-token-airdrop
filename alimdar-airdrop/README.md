# Alimdar Token (AT) Airdrop Claim Starter

Repo-ready starter za:
- Solidity smart contract za claim airdrop
- Next.js frontend spreman za Vercel
- Primjer CSV-a za 1,000,000 AT distribuciju
- Skripta za izradu Merkle stabla iz CSV-a

## Što ovaj starter radi
1. Napraviš listu wallet adresa i količina AT tokena u `data/airdrop.csv`
2. Pokreneš skriptu koja generira `merkle.json`
3. Deployaš `MerkleAirdrop.sol` s:
   - adresom postojećeg AT tokena
   - Merkle rootom
   - početkom i krajem claim perioda
4. Pošalješ 1,000,000 AT na airdrop contract
5. Frontend na Vercelu korisnicima omogućava:
   - connect wallet
   - provjeru eligibility
   - claim tokena

## Važna napomena za korisnike
Korisnici NE moraju instalirati Vercel. Vercel je samo hosting platforma.
Na stranici otvore link, spoje wallet i claimaju token.

## Brzi start

### 1) Instalacija
```bash
npm install
```

### 2) Uredi CSV
Datoteka:
```bash
data/airdrop.csv
```

Format:
```csv
address,amount
0x1111111111111111111111111111111111111111,250000
0x2222222222222222222222222222222222222222,150000
```

> `amount` je u cijelim AT tokenima. Skripta ih pretvara u 18 decimala.

### 3) Generiraj Merkle tree
```bash
npm run build:airdrop
```

To kreira:
- `data/merkle.json`

### 4) Deploy contract
Prije deploya postavi env varijable u `.env.local` i po želji u Hardhat configu.

### 5) Fundaj contract
Pošalji ukupno 1,000,000 AT na adresu deployanog airdrop contracta.

### 6) Frontend za Vercel
U `.env.local` stavi:
```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0xYOUR_TOKEN_ADDRESS
NEXT_PUBLIC_AIRDROP_ADDRESS=0xYOUR_AIRDROP_ADDRESS
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_RPC_URL=https://YOUR_RPC
```

Deploy na Vercel:
```bash
vercel
```

## GitHub
Ovaj folder je spreman za GitHub repo:
```bash
git init
git add .
git commit -m "Initial Alimdar AT airdrop starter"
```

## Sigurnosne napomene
- Stranica nikad ne smije tražiti seed phrase
- Korisnik treba samo wallet signature / transakciju za claim
- Obavezno provjeri token decimals i mrežu prije deploya
- Preporuka: prvo testnet, pa tek onda mainnet

## Što trebaš zamijeniti
- `TOKEN_ADDRESS`
- `CHAIN_ID`
- RPC URL
- stvarni CSV s walletima
- stvarne datume claim perioda

