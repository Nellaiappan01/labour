// src/app/page.jsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#74ebd5,#9face6)"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, fontWeight: 800 }}>ESCEE Industries</h1>
        <p style={{ marginBottom: 20, color: "#064E3B" }}>Casual Labour Form</p>
        <Link href="/casual-labour" style={{
          display: "inline-block",
          padding: "12px 20px",
          background: "#0ea5e9",
          color: "#fff",
          borderRadius: 10,
          fontWeight: 700,
          textDecoration: "none"
        }}>
          Open Labour Form
        </Link>
      </div>
    </main>
  );
}
