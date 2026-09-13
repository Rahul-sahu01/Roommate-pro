import React from 'react';

export function AuthGate({ onLogin }) {
  return (
    <div className="guard">
      <div className="empty-icon">🔐</div>
      <h2>Sign in to continue</h2>
      <p>Your dashboard and personal actions are protected.</p>
      <button className="btn primary" onClick={onLogin}>
        Go to login
      </button>
    </div>
  );
}
