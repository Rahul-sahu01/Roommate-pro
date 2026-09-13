import React from 'react';

export function SelectField({ label, value, options, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
