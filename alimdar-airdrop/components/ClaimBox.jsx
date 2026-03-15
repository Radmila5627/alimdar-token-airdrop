 "use client";

import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const AIRDROP_ABI = [
  "function claim(uint256 amount, bytes32[] calldata proof) external",
  "function claimed(address) view returns (bool)"
];

function getPreferredEthereumProvider() {
  if (typeof window === "undefined") return null;

  const { ethereum } = window;

  if (!ethereum) return null;

  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find((p) => p.isMetaMask);
    if (metaMaskProvider) return metaMaskProvider;
  }

  if (ethereum.isMetaMask) return ethereum;

  return null;
}

export default function ClaimBox() {
  const [wallet, setWallet] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [hasProvider, setHasProvider] = useState(false);

  const airdropAddress = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "56");

  useEffect(() => {

    if (typeof window === "undefined") return;

    if (window.ethereum) {
      setHasProvider(true);
    }

  }, []);

  useEffect(() => {

    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (accounts) => {
      setWallet(accounts[0] || "");
    });

  }, []);

  useEffect(() => {

    if (!window.ethereum) return;

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

  }, []);

  async function connectWallet() {

    if (!hasProvider) {
      setStatus("MetaMask nije instaliran / MetaMask not installed");
      return;
    }

    const ethereum = getPreferredEthereumProvider();

    if (!ethereum) {
      setStatus("MetaMask nije pronađen / MetaMask not found");
      return;
    }

    try {

      setLoading(true);
      setStatus("");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setStatus(
          "MetaMask nema aktivan account. / MetaMask has no active account."
        );
        return;
      }

      const currentChainIdHex = await ethereum.request({
        method: "eth_chainId",
      });

      if (parseInt(currentChainIdHex, 16) !== chainId) {

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });

      }

      setWallet(accounts[0]);
      setStatus("Wallet connected / Wallet spojen");

    } catch (error) {

      console.error("Wallet connect error:", error);

      setStatus(
        error?.message ||
          "Spajanje walleta nije uspjelo / Wallet connection failed"
      );

    } finally {

      setLoading(false);

    }
  }

  async function checkEligibility(addr) {

    if (!addr) return;

    try {

      setLoading(true);
      setStatus("");

      const res = await fetch(`/api/eligible?address=${addr}`);
      const data = await res.json();

      setEligibility(data);

      if (!data.eligible) {
        setStatus(
          "Ovaj wallet nema pravo na airdrop. / This wallet is not eligible for the airdrop."
        );
      }

    } catch (error) {

      console.error("Eligibility error:", error);

      setStatus(
        "Provjera prava nije uspjela. / Eligibility check failed."
      );

    } finally {

      setLoading(false);

    }
  }

  async function claim() {

    if (!wallet || !eligibility?.eligible || !airdropAddress) return;

    const ethereum = getPreferredEthereumProvider();

    if (!ethereum) {
      setStatus("MetaMask nije pronađen / MetaMask not found");
      return;
    }

    try {

      setLoading(true);
      setStatus("");

      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(
        airdropAddress,
        AIRDROP_ABI,
        signer
      );

      const tx = await contract.claim(
        BigInt(eligibility.amount),
        eligibility.proof
      );

      setStatus(`Transakcija poslana / Transaction sent: ${tx.hash}`);

      await tx.wait();

      setStatus(
        "Claim uspješan. Tokeni su poslani. / Claim successful. Tokens have been sent."
      );

    } catch (error) {

      console.error("Claim error:", error);

      setStatus(
        error?.shortMessage ||
          error?.message ||
          "Claim nije uspio. / Claim failed."
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    if (wallet) {
      checkEligibility(wallet);
    }
  }, [wallet]);

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginTop: 0 }}>Alimdar Token (AT) Airdrop</h1>
        <p style={subStyle}>BNB Chain • Hrvatski / English</p>

        <div style={infoBox}>
          <p>
            <strong>Token / Token:</strong> {tokenAddress}
          </p>
          <p>
            <strong>Airdrop Contract / Airdrop ugovor:</strong> {airdropAddress}
          </p>
          <p>
            <strong>Chain ID:</strong> {chainId}
          </p>
        </div>

        {!wallet ? (
          <button onClick={connectWallet} style={buttonStyle} disabled={loading}>
            {loading
              ? "Connecting... / Spajanje..."
              : "Connect Wallet / Spoji Wallet"}
          </button>
        ) : (
          <>
            <div style={walletBox}>
              <strong>Connected wallet / Spojeni wallet:</strong>
              <br />
              {wallet}
            </div>

            <button
              onClick={() => checkEligibility(wallet)}
              style={buttonStyle}
              disabled={loading}
            >
              {loading
                ? "Checking... / Provjera..."
                : "Check Eligibility / Provjeri pravo"}
            </button>
          </>
        )}

        {eligibility?.eligible && (
          <div style={claimBoxStyle}>
            <p>
              <strong>Eligible amount / Iznos za claim:</strong>{" "}
              {eligibility.amountFormatted} AT
            </p>

            <button onClick={claim} style={buttonStyle} disabled={loading}>
              {loading
                ? "Claim in progress... / Claim u tijeku..."
                : "Claim AT Tokens / Preuzmi AT tokene"}
            </button>
          </div>
        )}

        {status && <p style={{ marginTop: 16 }}>{status}</p>}
      </div>
    </div>
  );
}

const wrapStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "#0b1020"
};

const cardStyle = {
  width: "100%",
  maxWidth: 820,
  background: "#131a2e",
  color: "#fff",
  padding: 28,
  borderRadius: 18,
  boxShadow: "0 14px 40px rgba(0,0,0,.35)"
};

const subStyle = {
  opacity: 0.85,
  marginTop: -4
};

const infoBox = {
  background: "#0f1528",
  padding: 14,
  borderRadius: 12,
  marginTop: 18,
  lineHeight: 1.7
};

const walletBox = {
  background: "#0f1528",
  padding: 14,
  borderRadius: 12,
  marginTop: 16,
  marginBottom: 12,
  wordBreak: "break-all"
};

const claimBoxStyle = {
  background: "#0f1528",
  padding: 16,
  borderRadius: 12,
  marginTop: 16
};

const buttonStyle = {
  background: "#4f7cff",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: 12
};
