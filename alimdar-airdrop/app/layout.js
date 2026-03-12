export const metadata = {
  title: "Alimdar Token Airdrop",
  description: "Claim your AT airdrop"
};

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#0b1020", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
