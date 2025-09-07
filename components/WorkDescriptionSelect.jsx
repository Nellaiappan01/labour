// components/WorkDescriptionSelect.jsx
"use client";

import React from "react";

export default function WorkDescriptionSelect({ id = "workDesc", value, onChange, disabled = false, className = "" }) {
  return (
    <label>
      <div className="label">Work Description</div>
      <select
        id={id}
        name="WorkDescription"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
      >
        <option value="">-- Select work --</option>
        <option value="Brine Pumping Work">Brine Pumping Work</option>
        <option value="Day & Night Watchman Work">Day & Night Watchman Work</option>
        <option value="Company Work">Company Work</option>
      </select>
    </label>
  );
}
