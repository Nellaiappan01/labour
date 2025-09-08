"use client";
import React from "react";

export default function ShiftSelect({ value, onChange, disabled }) {
  return (
    <select
      name="WorkingShift"
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="input"
    >
      <option value="">-- Shift --</option>
      <option value="Day">Day</option>
      <option value="Night">Night</option>
    </select>
  );
}
