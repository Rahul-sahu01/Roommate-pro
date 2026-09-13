import React from 'react';

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  multiline = false,
  required = false,
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <sup>*</sup>}
      </label>

      {multiline ? (
        <textarea
          value={value || ''}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          required={required}
        />
      )}
    </div>
  );
}
