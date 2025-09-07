// pages/admin/sync.jsx
import { useState } from "react";

export default function AdminSync() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSync() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/sync-to-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sync-secret": secret
        },
        body: JSON.stringify({})
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin: Sync DB → Google Sheet</h1>
      <p>Enter the SYNC secret (from .env.local) and click Sync.</p>
      <input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Sync secret" style={{ padding: 8, width: 320 }} />
      <button onClick={handleSync} disabled={loading} style={{ marginLeft: 8, padding: "8px 12px" }}>
        {loading ? "Syncing..." : "Sync"}
      </button>
      <pre style={{ marginTop: 20 }}>{result ? JSON.stringify(result, null, 2) : "No result yet"}</pre>
    </div>
  );
}
