"use client";

import { useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const AIRDROP_ABI = [
  "function claim(uint256 amount, bytes32[] calldata proof) external",
  "function claimed(address) view returns (bool)",
  "function claimStart() view returns (uint64)",
  "function claimEnd() view returns (uint64)"
];

export default function ClaimBox() {
  const [wallet, setWallet] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const airdropAddress = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Instaliraj MetaMask ili drugi EVM wallet.");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWallet(accounts[0]);
    setStatus("Wallet spojen.");
  }

  async function checkEligibility(addr) {
    if (!addr) return;
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`/api/eligible?address=${addr}`);
      const data = await res.json();
      setEligibility(data);
      if (!data.eligible) setStatus("Ovaj wallet trenutno nije na airdrop listi.");
    } catch (e) {
      setStatus("Greška pri provjeri eligibility.");
    } finally {
      setLoading(false);
    }
  }

  async function claim() {
    if (!wallet || !eligibility?.eligible || !airdropAddress) return;
    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(airdropAddress, AIRDROP_ABI, signer);
      const tx = await contract.claim(eligibility.amount, eligibility.proof);
      setStatus(`Transakcija poslana: ${tx.hash}`);
      await tx.wait();
      setStatus("Claim uspješan. AT tokeni su poslani u wallet.");
    } catch (e) {
      setStatus(e?.shortMessage || e?.message || "Claim nije uspio.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (wallet) checkEligibility(wallet);
  }, [wallet]);

  return (
    <div style={{
      maxWidth: 640,
      margin: "60px auto",
      padding: 24,
      borderRadius: 16,
      background: "#131a2e",
      boxShadow: "0 10px 30px rgba(0,0,0,.35)"
    }}>
      <h1 style={{ marginTop: 0 }}>Alimdar Token (AT) Airdrop</h1>
      <p>Claim stranica je hostana na Vercelu. Korisnici ne moraju instalirati Vercel.</p>
      <p><strong>Sigurnost:</strong> stranica nikad ne traži seed phrase. Potrebna je samo wallet veza i claim transakcija.</p>

      {!wallet ? (
        <button onClick={connectWallet} style={btnStyle}>Spoji wallet</button>
      ) : (
        <>
          <div style={infoStyle}><strong>Wallet:</strong> {wallet}</div>
          <button onClick={() => checkEligibility(wallet)} style={btnStyle} disabled={loading}>
            {loading ? "Provjera..." : "Provjeri eligibility"}
          </button>
        </>
      )}

      {eligibility?.eligible && (
        <div style={cardStyle}>
          <p><strong>Eligible si za:</strong> {eligibility.amountFormatted} AT</p>
          <button onClick={claim} style={btnStyle} disabled={loading}>
            {loading ? "Claim u tijeku..." : "Claim AT"}
          </button>
        </div>
      )}

      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
}

const btnStyle = {
  background: "#4f7cff",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold"
};

const infoStyle = {
  background: "#0f1528",
  padding: 12,
  borderRadius: 10,
  marginBottom: 12
};

const cardStyle = {
  background: "#0f1528",
  padding: 16,
  borderRadius: 10,
  marginTop: 16
};
