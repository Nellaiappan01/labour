// components/AreaSelect.jsx
"use client";

import React from "react";

export default function AreaSelect({ id = "areaSelect", value, onChange, disabled = false, className = "" }) {
  return (
    <label>
      <div className="label">Area</div>
      <select
        id={id}
        name="Area"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
      >
        <option value="">-- Select area --</option>
        <option value="A,B,K,O & H,I,J,L Block">A,B,K,O & H,I,J,L Block</option>
        <option value="Q & S Block">Q & S Block</option>
        <option value="D,E,F,G & C,M,N,R Block">D,E,F,G & C,M,N,R Block</option>
        <option value="Seashore & Stor.Yard">Seashore & Stor.Yard</option>
        <option value="180 KVA">180 KVA</option>
        <option value="P Block">P Block</option>
      </select>
    </label>
  );
}
