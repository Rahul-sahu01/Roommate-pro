import React, { useState } from 'react';
import { api } from '../api';
import { lifestyleOptions } from '../config/constants';
import { initials } from '../utils/format';
import { Field, SelectField } from '../components/forms';

export function Profile({ user, onUser, notify }) {
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    city: user.preferences?.city || '',
    budget: user.preferences?.budget || 10000,
    smoking: user.preferences?.smoking || 'No',
    sleep: user.preferences?.sleep || 'Normal',
    food: user.preferences?.food || 'Any',
    bio: user.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      const data = await api('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          bio: form.bio,
          preferences: {
            city: form.city,
            budget: Number(form.budget),
            smoking: form.smoking,
            sleep: form.sleep,
            food: form.food,
          },
        }),
      });

      localStorage.setItem('rm_user', JSON.stringify(data.user));
      onUser(data.user);
      notify('Profile updated.', 'success');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page">
      <div className="container profile-wrap">
        <div className="profile-card">
          <div className="profile-cover">
            <div className="profile-avatar">{initials(user.name)}</div>
          </div>

          <div className="profile-content">
            <div className="profile-title">
              <div>
                <h1>{user.name}</h1>
                <p>
                  {user.email} · {user.role}
                </p>
              </div>

              <span className="pill accepted">Active account</span>
            </div>

            <div className="form-grid two">
              <Field
                label="Full name"
                value={form.name}
                onChange={(value) => updateField('name', value)}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField('phone', value)}
              />
              <Field
                label="Preferred city"
                value={form.city}
                onChange={(value) => updateField('city', value)}
              />
              <Field
                label="Budget"
                type="number"
                value={form.budget}
                onChange={(value) => updateField('budget', value)}
              />
              <SelectField
                label="Smoking"
                value={form.smoking}
                options={lifestyleOptions.smoking}
                onChange={(value) => updateField('smoking', value)}
              />
              <SelectField
                label="Sleep"
                value={form.sleep}
                options={lifestyleOptions.sleep}
                onChange={(value) => updateField('sleep', value)}
              />
              <SelectField
                label="Food"
                value={form.food}
                options={lifestyleOptions.food}
                onChange={(value) => updateField('food', value)}
              />
            </div>

            <Field
              label="About you"
              multiline
              value={form.bio}
              onChange={(value) => updateField('bio', value)}
              placeholder="Tell potential roommates a little about you."
            />

            <button
              className="btn primary"
              disabled={saving}
              onClick={saveProfile}
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
