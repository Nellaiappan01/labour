"use client";
import React from "react";

export default function ContractorSelect({ value, onChange, disabled }) {
  return (
    <select
      name="Name"
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="input"
    >
      <option value="">-- Select Contractor --</option>
      <option value="M.Ambikavathy">M.Ambikavathy</option>
      <option value="M.Muniyasamy">M.Muniyasamy</option>
      <option value="A.Gurusamy">A.Gurusamy</option>
      <option value="P.Ezhilarasan">P.Ezhilarasan</option>
      <option value="A.Ramasamy">A.Ramasamy</option>
      <option value="M.Rangasamy">M.Rangasamy</option>
      <option value="I.BackiyaRaj">I.BackiyaRaj</option>
    </select>
  );
}
