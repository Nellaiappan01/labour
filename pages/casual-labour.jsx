"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CasualLabourForm() {
  const [formState, setFormState] = useState({
    Date: "",
    ContractorVisible: "",
    ContractorAltVisible: "",
    Area: "",
    WorkDescription: "",
    WorkingShift: "",
    OTHrs: ""
  });

  // status: "idle" | "loading" | "success" | "error" | "timeout"
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const abortRef = useRef(null);

  // initialize today's date in YYYY-MM-DD
  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setFormState((s) => ({ ...s, Date: `${yyyy}-${mm}-${dd}` }));
  }, []);

  // unified change handler (works for inputs & selects)
  function handleChange(e) {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!formState.Date) return "Please select a date.";
    if (!formState.ContractorVisible) return "Please select a contractor.";
    if (formState.OTHrs !== "" && Number(formState.OTHrs) < 0) return "OT Hours cannot be negative.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status.state === "loading") return;

    const v = validate();
    if (v) {
      setStatus({ state: "error", message: v });
      setTimeout(() => setStatus({ state: "idle", message: "" }), 3500);
      return;
    }

    setStatus({ state: "loading", message: "Submitting…" });

    // AbortController for timeout/cancel
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutMs = 10000; // 10s timeout
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const payload = {
      Date: formState.Date,
      Name: formState.ContractorVisible,
      Contractor: formState.ContractorAltVisible,
      Area: formState.Area,
      WorkDescription: formState.WorkDescription,
      WorkingShift: formState.WorkingShift,
      OTHrs: formState.OTHrs === "" ? 0 : Number(formState.OTHrs)
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      abortRef.current = null;

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error((err && err.error) || `Server returned ${res.status}`);
      }

      const json = await res.json();
      setStatus({ state: "success", message: "Submitted successfully." });

      // reset form but keep date
      setFormState((s) => ({
        Date: s.Date,
        ContractorVisible: "",
        ContractorAltVisible: "",
        Area: "",
        WorkDescription: "",
        WorkingShift: "",
        OTHrs: ""
      }));

      setTimeout(() => setStatus({ state: "idle", message: "" }), 3000);
      console.log("submit result:", json);
    } catch (err) {
      clearTimeout(timeout);
      abortRef.current = null;
      if (err.name === "AbortError") {
        setStatus({ state: "timeout", message: "Request timed out. Try again." });
      } else {
        console.error(err);
        setStatus({ state: "error", message: "Submission failed. See console." });
      }
      setTimeout(() => setStatus({ state: "idle", message: "" }), 4000);
    }
  }

  function handleCancel() {
    if (abortRef.current) {
      abortRef.current.abort();
      setStatus({ state: "idle", message: "Cancelled" });
    }
  }

  const isBusy = status.state === "loading";
  const isSuccess = status.state === "success";
  const isError = status.state === "error" || status.state === "timeout";

  // helper to add 'has' class for floating labels when value exists
  const has = (val) => (val !== "" && val !== null && typeof val !== "undefined");

  return (
    <main className="page-root">
      <div className="card" role="application" aria-labelledby="formTitle">
        {/* Header */}
        <div className="header">
          <div className="brand-badge" aria-hidden>
            <strong>ES</strong>
          </div>
          <div className="brand-info">
            <div id="formTitle" className="title">ESCEE</div>
            <div className="subtitle">INDUSTRIES PRIVATE LIMITED</div>
          </div>
        </div>

        <div className="content">
          {/* Main form area */}
          <div className="form-wrap">
            <form onSubmit={handleSubmit} className={isError ? "shake" : ""} noValidate>
              {/* status */}
              <div style={{ minHeight: 28, marginBottom: 6 }} aria-live="polite">
                {status.state === "loading" && <div className="chip info">{status.message}</div>}
                {isSuccess && <div className="chip success">{status.message}</div>}
                {isError && <div className="chip error">{status.message}</div>}
              </div>

              <div className="form-grid">
                {/* Date */}
                <div className="field">
                  <input
                    name="Date"
                    type="date"
                    value={formState.Date}
                    onChange={handleChange}
                    className={`input ${has(formState.Date) ? "has" : ""}`}
                    disabled={isBusy}
                    required
                  />
                  <label className="label">Date</label>
                </div>

                {/* Contractor */}
                <div className="field">
                  <select
                    name="ContractorVisible"
                    value={formState.ContractorVisible}
                    onChange={handleChange}
                    className={`input ${has(formState.ContractorVisible) ? "has" : ""}`}
                    disabled={isBusy}
                    required
                  >
                    <option value=""> </option>
                    <option value="M.Ambikavathy">M.Ambikavathy</option>
                    <option value="M.Muniyasamy">M.Muniyasamy</option>
                    <option value="A.Gurusamy">A.Gurusamy</option>
                    <option value="P.Ezhilarasan">P.Ezhilarasan</option>
                    <option value="A.Ramasamy">A.Ramasamy</option>
                    <option value="M.Rangasamy">M.Rangasamy</option>
                    <option value="I.BackiyaRaj">I.BackiyaRaj</option>
                    <option value="Abbas">Abbas</option>
                    <option value="AnthonySamy">AnthonySamy</option>
                    <option value="NagaRaj">NagaRaj</option>
                    <option value="Thon Xavier">Thon Xavier</option>
                    <option value="S.Pandi">S.Pandi</option>
                    <option value="S.Murgandi">S.Murgandi</option>
                    <option value="Devaraj">Devaraj</option>
                    <option value="P.Rajiv Gandhi">P.Rajiv Gandhi</option>
                    <option value="Thommai Arulanatham">Thommai Arulanatham</option>
                    <option value="AnthonySamy(P block)">AnthonySamy(P block)</option>
                    <option value="Anthony Arockiya Selvan">Anthony Arockiya Selvan</option>
                    <option value="A.Selvaraj">A.Selvaraj</option>
                    <option value="Saveri Muthu">Saveri Muthu</option>
                    <option value="AnthonyRayyappan">AnthonyRayyappan</option>
                    <option value="Thangaraj">Thangaraj</option>
                    <option value="SennaMuniyasamy">SennaMuniyasamy</option>
                    <option value="Ganeshan">Ganeshan</option>
                    <option value="Muthulakshmi">Muthulakshmi</option>
                    <option value="Shanmugalakshmi">Shanmugalakshmi</option>
                  </select>
                  <label className="label">Contractor</label>
                </div>

                {/* Alternate Contractor */}
                <div className="field">
                  <select
                    name="ContractorAltVisible"
                    value={formState.ContractorAltVisible}
                    onChange={handleChange}
                    className={`input ${has(formState.ContractorAltVisible) ? "has" : ""}`}
                    disabled={isBusy}
                  >
                    <option value=""> </option>
                    <option value="C.Ganesh Ayyadurai">C.Ganesh Ayyadurai</option>
                    <option value="A.Peppy">A.Peppy</option>
                  </select>
                  <label className="label">Alternate Contractor (optional)</label>
                </div>

                {/* Area */}
                <div className="field">
                  <select
                    name="Area"
                    value={formState.Area}
                    onChange={handleChange}
                    className={`input ${has(formState.Area) ? "has" : ""}`}
                    disabled={isBusy}
                  >
                    <option value=""> </option>
                    <option value="A,B,K,O & H,I,J,L Block">A,B,K,O & H,I,J,L Block</option>
                    <option value="Q & S Block">Q & S Block</option>
                    <option value="D,E,F,G & C,M,N,R Block">D,E,F,G & C,M,N,R Block</option>
                    <option value="Seashore & Stor.Yard">Seashore & Stor.Yard</option>
                    <option value="180 KVA">180 KVA</option>
                    <option value="P Block">P Block</option>
                  </select>
                  <label className="label">Area</label>
                </div>

                {/* Work Description */}
                <div className="field">
                  <select
                    name="WorkDescription"
                    value={formState.WorkDescription}
                    onChange={handleChange}
                    className={`input ${has(formState.WorkDescription) ? "has" : ""}`}
                    disabled={isBusy}
                  >
                    <option value=""> </option>
                    <option value="Brine Pumping Work">Brine Pumping Work</option>
                    <option value="Day & Night Watchman Work">Day & Night Watchman Work</option>
                    <option value="Company Work">Company Work</option>
                  </select>
                  <label className="label">Work Description</label>
                </div>

                {/* Shift */}
                <div className="field">
                  <select
                    name="WorkingShift"
                    value={formState.WorkingShift}
                    onChange={handleChange}
                    className={`input ${has(formState.WorkingShift) ? "has" : ""}`}
                    disabled={isBusy}
                  >
                    <option value=""> </option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                  <label className="label">Shift</label>
                </div>

                {/* OT Hours */}
                <div className="field">
                  <input
                    name="OTHrs"
                    type="number"
                    placeholder=""
                    value={formState.OTHrs}
                    onChange={handleChange}
                    className={`input ${has(formState.OTHrs) ? "has" : ""}`}
                    min="0"
                    step="0.25"
                    disabled={isBusy}
                  />
                  <label className="label">OT Hours</label>
                </div>
              </div>

              {/* desktop actions */}
              <div className="actions-desktop" style={{ marginTop: 14 }}>
                <div className="actions">
                  <button
                    className={`submit ${isBusy ? "loading" : ""} ${isSuccess ? "done" : ""}`}
                    type="submit"
                    disabled={isBusy}
                    aria-busy={isBusy}
                  >
                    <span className="btnInner">
                      {isBusy ? (
                        <>
                          <svg className="spinner" viewBox="0 0 50 50" aria-hidden>
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                          </svg>
                          <span>Submitting…</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <svg className="check" viewBox="0 0 24 24" aria-hidden>
                            <path d="M20 6L9 17l-5-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                          <span>Done</span>
                        </>
                      ) : (
                        <span>Submit</span>
                      )}
                    </span>
                  </button>

                  {isBusy && (
                    <button type="button" className="cancel" onClick={handleCancel} aria-label="Cancel submission">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* mobile sticky submit (visible on small screens via CSS) */}
              <div className="sticky-submit" role="region" aria-label="Submit bar">
                <button
                  className={`submit ${isBusy ? "loading" : ""} ${isSuccess ? "done" : ""}`}
                  type="submit"
                  disabled={isBusy}
                  aria-busy={isBusy}
                >
                  {isBusy ? "Submitting…" : isSuccess ? "Done" : "Submit"}
                </button>
                <button type="button" className="cancel" onClick={() => { setFormState((s) => ({ ...s, ContractorVisible: "", ContractorAltVisible:"", Area:"", WorkDescription:"", WorkingShift:"", OTHrs:"" })); }}>
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Side panel for desktop */}
          <aside className="side-panel" aria-hidden={false}>
            <div className="summary">
              <h3>Quick Tips</h3>
              <p>Pick the contractor and area, choose shift, enter OT hours (0.25 increments allowed).</p>
              <hr style={{ border: "none", height: 1, background: "rgba(255,255,255,0.02)", margin: "10px 0" }} />
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                Submissions are saved to our database immediately and synced to the Google Sheet in the background.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* small page-level CSS to float labels when value present (works with the external stylesheet) */}
      <style jsx>{`
        /* ensure floating labels also work when we add 'has' class */
        .input.has + .label,
        select.input.has + .label {
          transform: translateY(-30px);
          font-size: 11px;
          color: var(--accent);
          top: 8px;
        }

        /* tiny override to ensure select visible on dark bg */
        select.input option { color: #000; }

        /* adjust sticky-submit visibility: hide on desktop (CSS already hides but we add safety) */
        @media (min-width: 720px) {
          .sticky-submit { display: none !important; }
        }
      `}</style>
    </main>
  );
}
