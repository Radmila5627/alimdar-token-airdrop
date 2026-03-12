const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("ethers");

const csvPath = path.join(process.cwd(), "data", "airdrop.csv");
const outPath = path.join(process.cwd(), "data", "merkle.json");

if (!fs.existsSync(csvPath)) {
  console.error("Missing data/airdrop.csv");
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, "utf8");
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

const rows = parsed.data.map((row) => {
  const address = ethers.getAddress(row.address.trim());
  const amount = ethers.parseUnits(String(row.amount).trim(), 18).toString();
  return { address, amount };
});

const leaves = rows.map(({ address, amount }) =>
  Buffer.from(
    ethers.solidityPackedKeccak256(["address", "uint256"], [address, amount]).slice(2),
    "hex"
  )
);

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();

const claims = {};
for (const row of rows) {
  const leaf = Buffer.from(
    ethers.solidityPackedKeccak256(["address", "uint256"], [row.address, row.amount]).slice(2),
    "hex"
  );
  claims[row.address] = {
    amount: row.amount,
    amountFormatted: ethers.formatUnits(row.amount, 18),
    proof: tree.getHexProof(leaf),
  };
}

const output = {
  root,
  totalRecipients: rows.length,
  totalAmountRaw: rows.reduce((acc, r) => acc + BigInt(r.amount), 0n).toString(),
  totalAmountFormatted: rows.reduce((acc, r) => acc + BigInt(r.amount), 0n) / 10n**18n + "",
  claims,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Merkle root: ${root}`);
console.log(`Saved to ${outPath}`);
