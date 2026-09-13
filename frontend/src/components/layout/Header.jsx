import React from 'react';
import { navItems } from '../../config/constants';
import { initials } from '../../utils/format';

export function Header({ user, page, navigate, logout }) {
  return (
    <header className="topbar">
      <div className="nav-inner">
        <button className="brand" onClick={() => navigate('home')}>
          <span className="brand-icon">⌂</span>
          <span>
            RoomMate<span>Pro</span>
          </span>
        </button>

        <nav className="desktop-nav">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}

          {user?.role === 'owner' && (
            <button
              className={page === 'owner' ? 'active' : ''}
              onClick={() => navigate('owner')}
            >
              Owner Hub
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              className={page === 'admin' ? 'active' : ''}
              onClick={() => navigate('admin')}
            >
              Admin
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <button
                className="icon-btn"
                title="Profile"
                onClick={() => navigate('profile')}
              >
                {initials(user.name)}
              </button>
              <button className="header-cta ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                className="header-link"
                onClick={() => navigate('login')}
              >
                Log in
              </button>
              <button
                className="header-cta"
                onClick={() => navigate('register')}
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
