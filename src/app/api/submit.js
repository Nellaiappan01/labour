// src/pages/api/submit.js  (DEV diagnostic)
import dbConnect from "../../lib/mongoose";
import Entry from "../models/Entry";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const payload = req.body || {};
    console.log("[DEBUG API] payload:", payload);

    if (!payload.Date) return res.status(400).json({ error: "Date required" });
    if (!payload.Name && !payload.Contractor) return res.status(400).json({ error: "Contractor required" });

    await dbConnect();
    console.log("[DEBUG API] DB connected");

    const ot = payload.OTHrs ? Number(payload.OTHrs) : 0;
    const doc = await Entry.create({ Date: payload.Date, Name: payload.Name, Contractor: payload.Contractor, Area: payload.Area, WorkDescription: payload.WorkDescription, WorkingShift: payload.WorkingShift, OTHrs: ot });
    console.log("[DEBUG API] created id:", doc._id);

    res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[DEBUG API] ERROR:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Server error", details: String(err), stack: err.stack });
  }
}
