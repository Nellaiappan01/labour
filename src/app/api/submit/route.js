// src/app/api/submit/route.js
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || "";
const FORM_SECRET = process.env.FORM_SECRET || ""; // only used server->sheet, not required from client

async function postToGoogleSheet(payload) {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("No GOOGLE_SHEETS_URL configured");
    return { ok: false, status: 0, text: "no_sheet_url" };
  }
  // inject server-side secret so the Apps Script can validate it (if you added that)
  if (FORM_SECRET) payload._secret = FORM_SECRET;

  const params = new URLSearchParams();
  Object.entries(payload).forEach(([k, v]) => params.append(k, String(v ?? "")));

  const r = await fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: params.toString(),
  });
  const text = await r.text().catch(() => "");
  return { ok: r.ok, status: r.status, text };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    // basic validation
    if (!body.Date) return new Response(JSON.stringify({ error: "Date required" }), { status: 400 });
    if (!body.Name && !body.Contractor) return new Response(JSON.stringify({ error: "Name or Contractor required" }), { status: 400 });

    // forward to sheet (server injects secret; client doesn't need it)
    const result = await postToGoogleSheet(body);
    if (!result.ok) {
      console.error("Sheet post failed:", result);
      return new Response(JSON.stringify({ error: "Sheet post failed", details: result.text || result }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, sheetStatus: result.status }), { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "Server error", details: String(err) }), { status: 500 });
  }
}
