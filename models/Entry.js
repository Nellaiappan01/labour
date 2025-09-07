// models/Entry.js
import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  Date: { type: String, required: true },                // YYYY-MM-DD
  Name: { type: String },                                // contractor (hidden Name field)
  Contractor: { type: String },                          // alternate contractor hidden
  Area: { type: String },
  WorkDescription: { type: String },
  WorkingShift: { type: String },
  OTHrs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Avoid model overwrite in dev with HMR
export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
