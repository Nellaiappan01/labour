// components/ContractorSelect.jsx
"use client";

import React from "react";

export default function ContractorSelect({ id = "contractor", value, onChange, disabled = false, className = "" }) {
  return (
    <label>
      <div className="label">Contractor</div>
      <select
        id={id}
        name="ContractorVisible"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
        required
      >
        <option value="">-- Select contractor --</option>
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
    </label>
  );
}
