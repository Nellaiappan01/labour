"use client";

import React, { useState, useEffect } from "react";
import ContractorSelect from "../components/ContractorSelect";
import AltContractorSelect from "../components/AltContractorSelect";
import AreaSelect from "../components/AreaSelect";
import WorkDescriptionSelect from "../components/WorkDescriptionSelect";
import ShiftSelect from "../components/ShiftSelect";

export default function CasualLabourForm() {
  const [formState, setFormState] = useState({
    Date: "",
    Name: "",
    Contractor: "",
    Area: "",
    WorkDescription: "",
    WorkingShift: "",
    OTHrs: ""
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setFormState((s) => ({ ...s, Date: `${yyyy}-${mm}-${dd}` }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "Submitting…" });

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });

      if (!res.ok) throw new Error("Server error");
      await res.json();

      setStatus({ state: "success", message: "Submitted!" });

      setFormState((s) => ({
        Date: s.Date,
        Name: "",
        Contractor: "",
        Area: "",
        WorkDescription: "",
        WorkingShift: "",
        OTHrs: ""
      }));
    } catch (err) {
      console.error("Submit error:", err);
      setStatus({ state: "error", message: "Failed. Try again." });
    }

    setTimeout(() => setStatus({ state: "idle", message: "" }), 3000);
  }

  return (
    <div className="glass-container">
      <h2 className="form-title">ESCEE Industries</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input type="date" name="Date" value={formState.Date} onChange={handleChange} required />

        <ContractorSelect value={formState.Name} onChange={handleChange} disabled={status.state === "loading"} />

        <AltContractorSelect value={formState.Contractor} onChange={handleChange} disabled={status.state === "loading"} />

        <AreaSelect value={formState.Area} onChange={handleChange} disabled={status.state === "loading"} />

        <WorkDescriptionSelect value={formState.WorkDescription} onChange={handleChange} disabled={status.state === "loading"} />

        <ShiftSelect value={formState.WorkingShift} onChange={handleChange} disabled={status.state === "loading"} />

        <input
          type="number"
          name="OTHrs"
          value={formState.OTHrs}
          onChange={handleChange}
          placeholder="OT Hours"
          min="0"
          step="0.25"
        />

        <button type="submit" className="btn-submit">
          {status.state === "loading"
            ? "Submitting…"
            : status.state === "success"
            ? "✅ Done"
            : "Submit"}
        </button>
      </form>

      {status.state !== "idle" && <p className={`status ${status.state}`}>{status.message}</p>}
    </div>
  );
}
