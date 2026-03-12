import fs from "fs";
import path from "path";
import { ethers } from "ethers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return Response.json({ eligible: false, error: "Missing address" }, { status: 400 });
  }

  let checksummed;
  try {
    checksummed = ethers.getAddress(address);
  } catch {
    return Response.json({ eligible: false, error: "Invalid address" }, { status: 400 });
  }

  const merklePath = path.join(process.cwd(), "data", "merkle.json");
  if (!fs.existsSync(merklePath)) {
    return Response.json({
      eligible: false,
      error: "merkle.json not found. Run npm run build:airdrop first."
    }, { status: 500 });
  }

  const merkle = JSON.parse(fs.readFileSync(merklePath, "utf8"));
  const claim = merkle.claims?.[checksummed];

  if (!claim) {
    return Response.json({ eligible: false });
  }

  return Response.json({
    eligible: true,
    amount: claim.amount,
    amountFormatted: claim.amountFormatted,
    proof: claim.proof
  });
}
