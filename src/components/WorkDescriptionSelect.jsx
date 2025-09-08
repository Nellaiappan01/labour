"use client";
import React from "react";

export default function WorkDescriptionSelect({ value, onChange, disabled }) {
  return (
    <select
      name="WorkDescription"
      value={value}
      onChange={onChange}
      required
      disabled={disabled}
      className="input"
    >
      <option value="">-- Work Description --</option>
      <option value="Brine Pumping Work">Brine Pumping Work</option>
      <option value="Day & Night Watchman Work">Day & Night Watchman Work</option>
      <option value="Company Work">Company Work</option>
    </select>
  );
}
