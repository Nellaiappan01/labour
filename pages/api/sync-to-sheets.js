// pages/api/sync-to-sheets.js
import dbConnect from "../../lib/mongoose";
import Entry from "../../models/Entry";

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const rows = await Entry.find({}).sort({ createdAt: 1 }).lean();

    if (!GOOGLE_SHEETS_URL) {
      return res.status(400).json({ ok: false, error: "GOOGLE_SHEETS_URL not set" });
    }

    // Post rows one by one (or batch if your Apps Script supports it)
    const results = [];
    for (const r of rows) {
      const payload = new URLSearchParams();
      payload.append("Date", r.Date || "");
      payload.append("Name", r.Name || "");
      payload.append("Contractor", r.Contractor || "");
      payload.append("Area", r.Area || "");
      payload.append("WorkDescription", r.WorkDescription || "");
      payload.append("WorkingShift", r.WorkingShift || "");
      payload.append("OTHrs", r.OTHrs != null ? String(r.OTHrs) : "");

      try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          },
          body: payload.toString()
        });
        results.push({ id: r._id, ok: true, status: response.status });
        // optional: await response.text();
      } catch (err) {
        results.push({ id: r._id, ok: false, error: String(err) });
      }
    }

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error("sync error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
