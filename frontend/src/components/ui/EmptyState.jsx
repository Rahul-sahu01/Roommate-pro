import React from 'react';

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>

      {action && (
        <button className="btn ghost" onClick={action}>
          Reset filters
        </button>
      )}
    </div>
  );
}
