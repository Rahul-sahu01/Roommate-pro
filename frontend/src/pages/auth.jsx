import React, { useState } from 'react';
import { api, saveSession } from '../api';
import { Field } from '../components/forms';

export function Auth({ mode, onDone, onSwitch, notify }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  });
  const [busy, setBusy] = useState(false);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (mode === 'register' && !form.name.trim()) {
      notify('Please enter your name.', 'error');
      return;
    }

    setBusy(true);

    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const data = await api(`/auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(form),
      });

      saveSession(data);
      onDone(data.user);

      notify(
        mode === 'login'
          ? 'Welcome back.'
          : 'Account created successfully.',
        'success'
      );
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-art">
        <div className="auth-copy">
          <div className="eyebrow">
            <span /> ROOMMATE PRO
          </div>

          <h1>A better way to find where you belong.</h1>
          <p>
            One account for homes, roommates, applications and conversations.
          </p>

          <div className="auth-points">
            <span>✓ Verified marketplace</span>
            <span>✓ Real compatibility scoring</span>
            <span>✓ Secure account sessions</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <button
          className="brand auth-brand"
          onClick={() => (window.location.hash = '')}
        >
          <span className="brand-icon">⌂</span>
          <span>
            RoomMate<span>Pro</span>
          </span>
        </button>

        <div className="auth-card">
          <div className="eyebrow dark">
            <span /> {mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}
          </div>

          <h2>
            {mode === 'login'
              ? 'Log in to your account'
              : 'Create your free account'}
          </h2>

          <p>
            {mode === 'login'
              ? 'Continue where you left off.'
              : 'Join renters and owners using RoomMate Pro.'}
          </p>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <Field
                label="Full name"
                value={form.name}
                onChange={(value) => updateField('name', value)}
                required
              />
            )}

            <Field
              label="Email address"
              type="email"
              value={form.email}
              onChange={(value) => updateField('email', value)}
              required
            />

            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(value) => updateField('password', value)}
              required
            />

            <div className="password-help">
              Use at least 6 characters.
            </div>

            {mode === 'register' && (
              <div className="role-choice">
                <button
                  type="button"
                  className={form.role === 'tenant' ? 'selected' : ''}
                  onClick={() => updateField('role', 'tenant')}
                >
                  <b>🏠 Tenant</b>
                  <small>Find a home or roommate</small>
                </button>

                <button
                  type="button"
                  className={form.role === 'owner' ? 'selected' : ''}
                  onClick={() => updateField('role', 'owner')}
                >
                  <b>🏢 Owner</b>
                  <small>List and manage rentals</small>
                </button>
              </div>
            )}

            <button className="btn primary full auth-submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Log in'
                  : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New here? <button onClick={onSwitch}>Create account</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={onSwitch}>Log in</button>
              </>
            )}
          </div>

          {mode === 'login' && (
            <div className="demo-box">
              <b>Demo admin</b>
              <span>admin@roommate.local</span>
              <span>Admin@12345</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
