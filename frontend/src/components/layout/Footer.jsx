import React from 'react';

export function Footer({ navigate }) {
  return (
    <footer>
      <div>
        <button className="brand footer-brand" onClick={() => navigate('home')}>
          <span className="brand-icon">⌂</span>
          <span>
            RoomMate<span>Pro</span>
          </span>
        </button>

        <p>One place to discover homes, roommates and rental life.</p>
      </div>

      <div className="footer-links">
        <button onClick={() => navigate('properties')}>Homes</button>
        <button onClick={() => navigate('matches')}>Roommates</button>
        <button onClick={() => navigate('register')}>Join RoomMate Pro</button>
      </div>

      <small>© 2026 RoomMate Pro</small>
    </footer>
  );
}
