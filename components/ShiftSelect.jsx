// components/ShiftSelect.jsx
"use client";

import React from "react";

export default function ShiftSelect({ id = "shiftSelect", value, onChange, disabled = false, className = "" }) {
  return (
    <label>
      <div className="label">Shift</div>
      <select
        id={id}
        name="WorkingShift"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
      >
        <option value="">-- Select shift --</option>
        <option value="Day">Day</option>
        <option value="Night">Night</option>
      </select>
    </label>
  );
}
