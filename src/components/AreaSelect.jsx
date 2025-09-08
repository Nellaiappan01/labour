"use client";
import React from "react";

export default function AreaSelect({ value, onChange, disabled }) {
  return (
    <select
      name="Area"
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="input"
    >
      <option value="">-- Select Area --</option>
      <option value="P Block">P Block</option>
      <option value="Q & S Block">Q & S Block</option>
      <option value="D,E,F,G & C,M,N,R Block">D,E,F,G & C,M,N,R Block</option>
      <option value="Seashore & Stor.Yard">Seashore & Stor.Yard</option>
      <option value="180 KVA">180 KVA</option>
      <option value="A,B,K,O & H,I,J,L Block">A,B,K,O & H,I,J,L Block</option>
    </select>
  );
}
