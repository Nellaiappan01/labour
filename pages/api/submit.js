// pages/api/submit.js
import dbConnect from "../../lib/mongoose";
import Entry from "../../models/Entry";

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // handle both form-data and json
  const body = req.body && Object.keys(req.body).length ? req.body : {};
  // If request is sent as form-data by browser fetch with FormData, in Next.js it will parse as multipart if you use bodyParser false.
  // For simplicity assume client sends application/x-www-form-urlencoded or application/json

  try {
    await dbConnect();

    // extract fields (matching your form names)
    const {
      Date = "",        // visible date input
      Name = "",        // hiddenContractor
      Contractor = "",  // hiddenAltContractor
      Area = "",
      WorkDescription = "",
      WorkingShift = "",
      OTHrs = ""
    } = req.body || req.query || body;

    // Convert OTHrs to number safely
    const otNumber = OTHrs ? Number(OTHrs) : 0;

    const doc = await Entry.create({
      Date,
      Name,
      Contractor,
      Area,
      WorkDescription,
      WorkingShift,
      OTHrs: otNumber
    });

    // After saving to DB, push to Google Sheet via your Apps Script URL (if provided)
    if (GOOGLE_SHEETS_URL) {
      // build FormData-like payload
      const payload = new URLSearchParams();
      payload.append("Date", Date);
      payload.append("Name", Name);
      payload.append("Contractor", Contractor);
      payload.append("Area", Area);
      payload.append("WorkDescription", WorkDescription);
      payload.append("WorkingShift", WorkingShift);
      payload.append("OTHrs", String(otNumber));

      // Post to Apps Script URL
      // Note: Apps Script expects a form POST similar to your front-end
      try {
        const r = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          },
          body: payload.toString()
        });
        // you can check response status/text if needed
        // const text = await r.text();
      } catch (err) {
        console.error("Failed to post to Google Sheets:", err);
        // don't fail the whole request if sheet post fails — but return a note
        return res.status(201).json({ ok: true, saved: true, sheetError: String(err) });
      }
    }

    return res.status(201).json({ ok: true, saved: true, id: doc._id });
  } catch (err) {
    console.error("submit error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
