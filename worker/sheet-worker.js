// worker/sheet-worker.js
// Run: node worker/sheet-worker.js
const path = require("path");

// load .env.local from project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const Queue = require("bull");
const mongoose = require("mongoose");

// require Entry model (supports both CJS and ESM default export)
let Entry;
try {
  Entry = require("../models/Entry").default || require("../models/Entry");
} catch (err) {
  console.error("Failed to load models/Entry.js:", err);
  process.exit(1);
}

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
if (!GOOGLE_SHEETS_URL) {
  console.warn("Warning: GOOGLE_SHEETS_URL not set in .env.local — worker will still start, but won't post to sheets.");
}

const sheetQueue = new Queue("sheetQueue", REDIS_URL);

async function connectDB() {
  if (mongoose.connection && mongoose.connection.readyState === 1) return;
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set in .env.local");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Worker: MongoDB connected");
}

sheetQueue.process(async (job) => {
  await connectDB();
  const { entryId, payload } = job.data;

  try {
    if (!GOOGLE_SHEETS_URL) throw new Error("GOOGLE_SHEETS_URL not configured");
    const params = new URLSearchParams();
    params.append("Date", payload.Date || "");
    params.append("Name", payload.Name || "");
    params.append("Contractor", payload.Contractor || "");
    params.append("Area", payload.Area || "");
    params.append("WorkDescription", payload.WorkDescription || "");
    params.append("WorkingShift", payload.WorkingShift || "");
    params.append("OTHrs", String(payload.OTHrs ?? ""));

    // Node 18+ has global fetch. If you installed node-fetch and prefer it, you could require it.
    const r = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString()
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`Sheets responded ${r.status} ${txt}`);
    }

    // mark document as synced
    await Entry.findByIdAndUpdate(entryId, { synced: true, syncedAt: new Date() });
    console.log(`Job ${job.id} succeeded for entry ${entryId}`);
    return Promise.resolve();
  } catch (err) {
    console.error(`Job ${job.id} failed for entry ${entryId}:`, err);
    // Throw error so Bull can retry if configured (backoff, attempts)
    throw err;
  }
});

sheetQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} permanently failed:`, err.message || err);
});

sheetQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed.`);
});

console.log("Sheet worker started — waiting for jobs...");
