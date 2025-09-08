// src/app/api/submit/route.js
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || "";
const FORM_SECRET = process.env.FORM_SECRET || ""; // injected server-side to sheet if present
const FETCH_TIMEOUT_MS = 10000; // 10s

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function postToGoogleSheet(payload) {
  if (!GOOGLE_SHEETS_URL) {
    console.warn("No GOOGLE_SHEETS_URL configured");
    return { ok: false, status: 0, text: "no_sheet_url" };
  }

  // clone payload so we don't mutate the caller's object
  const toSend = { ...payload };
  if (FORM_SECRET) toSend._secret = FORM_SECRET;

  const params = new URLSearchParams();
  Object.entries(toSend).forEach(([k, v]) => params.append(k, String(v ?? "")));

  try {
    const r = await fetchWithTimeout(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString(),
    });

    const text = await r.text().catch(() => "");
    return { ok: r.ok, status: r.status, text };
  } catch (err) {
    // network/timeout error
    console.error("postToGoogleSheet fetch error:", String(err));
    return { ok: false, status: 0, text: String(err) };
  }
}

export async function POST(req) {
  try {
    // parse JSON safely
    const body = await req.json().catch(() => ({}));

    // basic validation
    if (!body.Date) {
      return new Response(JSON.stringify({ error: "Date required" }), { status: 400 });
    }
    if (!body.Name && !body.Contractor) {
      return new Response(JSON.stringify({ error: "Name or Contractor required" }), { status: 400 });
    }

    // forward to sheet
    const result = await postToGoogleSheet(body);

    if (!result.ok) {
      // give helpful details in logs; return concise to client
      console.error("Sheet post failed:", result);
      // If no sheet url configured, return 500 with clear message
      if (result.text === "no_sheet_url") {
        return new Response(JSON.stringify({ error: "Server misconfiguration: GOOGLE_SHEETS_URL missing" }), { status: 500 });
      }
      // return 502 for upstream failure
      return new Response(JSON.stringify({ error: "Sheet post failed", details: result.text || `status:${result.status}` }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, sheetStatus: result.status }), { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "Server error", details: String(err) }), { status: 500 });
  }
}
