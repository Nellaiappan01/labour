// components/AltContractorSelect.jsx
"use client";

import React from "react";

export default function AltContractorSelect({ id = "altContractor", value, onChange, disabled = false, className = "" }) {
  return (
    <label>
      <div className="label">Alternate Contractor (optional)</div>
      <select
        id={id}
        name="ContractorAltVisible"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
      >
        <option value="">-- Select (optional) --</option>
        <option value="C.Ganesh Ayyadurai">C.Ganesh Ayyadurai</option>
        <option value="A.Peppy">A.Peppy</option>
      </select>
    </label>
  );
}
