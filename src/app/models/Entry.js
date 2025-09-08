// src/models/Entry.js
import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  Date: { type: String, required: true },
  Name: { type: String },
  Contractor: { type: String },
  Area: { type: String },
  WorkDescription: { type: String },
  WorkingShift: { type: String },
  OTHrs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
