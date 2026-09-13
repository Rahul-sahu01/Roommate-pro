import React from 'react';

export function QuickActions({ navigate }) {
  return (
    <aside className="panel quick">
      <h3>Shortcuts</h3>

      <button onClick={() => navigate('properties')}>
        ⌂ Browse homes <span>→</span>
      </button>
      <button onClick={() => navigate('matches')}>
        ◌ Find roommates <span>→</span>
      </button>
      <button onClick={() => navigate('favorites')}>
        ♥ View saved homes <span>→</span>
      </button>
      <button onClick={() => navigate('profile')}>
        ◎ Update preferences <span>→</span>
      </button>
    </aside>
  );
}
