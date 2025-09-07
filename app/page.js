// pages/index.jsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#f7f9fb,#e2e8f0)",
        padding: "24px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#ffffff",
          padding: "48px 32px",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(15,23,42,0.1)",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
            fontWeight: "800",
            color: "#0b1220",
            margin: 0,
          }}
        >
          Welcome to ESCEE
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            fontWeight: "500",
            color: "#6b7280",
            margin: "14px 0 32px",
          }}
        >
          Industries Private Limited
        </p>

        <Link
          href="/casual-labour"
          style={{
            display: "inline-block",
            width: "100%",
            padding: "18px 20px",
            borderRadius: "12px",
            background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
            color: "#ffffff",
            fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
            fontWeight: "700",
            textDecoration: "none",
            letterSpacing: "0.5px",
            boxShadow: "0 12px 30px rgba(37,99,235,0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow =
              "0 18px 36px rgba(37,99,235,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow =
              "0 12px 30px rgba(37,99,235,0.3)";
          }}
        >
          🚀 Open Labour Form
        </Link>
      </div>
    </main>
  );
}
