"use client";
import React from "react";

export default function AltContractorSelect({ value, onChange, disabled }) {
  return (
    <select
      name="Contractor"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="input"
    >
      <option value="">-- Alternate Contractor (optional) --</option>
      <option value="C.Ganesh Ayyadurai">C.Ganesh Ayyadurai</option>
      <option value="A.Peppy">A.Peppy</option>
    </select>
  );
}
