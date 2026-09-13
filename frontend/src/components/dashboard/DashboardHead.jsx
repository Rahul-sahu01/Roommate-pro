import React from 'react';

export function DashboardHead({ user, navigate }) {
  const firstName = user.name.split(' ')[0];

  return (
    <div className="dashboard-head">
      <div>
        <div className="eyebrow dark">
          <span /> YOUR SPACE
        </div>
        <h1>Welcome back, {firstName}.</h1>
        <p>
          Keep your profile updated to get stronger matches and faster
          responses.
        </p>
      </div>

      <button className="btn ghost" onClick={() => navigate('profile')}>
        Edit profile
      </button>
    </div>
  );
}
