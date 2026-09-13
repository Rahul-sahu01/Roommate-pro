import React from 'react';

export function Toast({ message, type = 'info' }) {
  const icon = type === 'success' ? '✓' : type === 'error' ? '!' : 'i';

  return (
    <div className={`toast ${type}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
}
