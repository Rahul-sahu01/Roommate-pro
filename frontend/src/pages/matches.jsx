import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { lifestyleOptions } from '../config/constants';
import { Field, SelectField } from '../components/forms';
import { MatchCard } from '../components/roommate';

export function Matches({ user, navigate, notify }) {
  const [preferences, setPreferences] = useState({
    budget: user?.preferences?.budget || 12000,
    city: user?.preferences?.city || 'Delhi',
    smoking: user?.preferences?.smoking || 'No',
    sleep: user?.preferences?.sleep || 'Normal',
    food: user?.preferences?.food || 'Any',
  });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const updatePreference = (name, value) => {
    setPreferences((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const findMatches = async (save = true) => {
    if (!user) {
      navigate('login');
      return;
    }

    setLoading(true);

    try {
      const data = await api('/matches', {
        method: 'POST',
        body: JSON.stringify({
          preferences,
          save,
        }),
      });

      setMatches(data.matches);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'tenant') {
      findMatches(false);
    }
  }, []);

  return (
    <section className="page">
      <div className="container">
        <div className="match-hero">
          <div>
            <div className="eyebrow">
              <span /> SMART ROOMMATE MATCHING
            </div>
            <h1>Your next roommate, ranked by compatibility.</h1>
            <p>
              Tell us how you live. We compare budget, city and lifestyle
              preferences to surface stronger matches first.
            </p>
          </div>

          <div className="match-ring">
            <strong>{matches[0]?.score || '—'}%</strong>
            <span>best match</span>
          </div>
        </div>

        <div className="match-grid">
          <div className="match-form">
            <h3>Your living preferences</h3>

            <div className="form-grid">
              <Field
                label="Monthly budget"
                type="number"
                value={preferences.budget}
                onChange={(value) =>
                  updatePreference('budget', Number(value))
                }
              />

              <Field
                label="Preferred city"
                value={preferences.city}
                onChange={(value) => updatePreference('city', value)}
              />

              <SelectField
                label="Smoking"
                value={preferences.smoking}
                options={lifestyleOptions.smoking}
                onChange={(value) => updatePreference('smoking', value)}
              />

              <SelectField
                label="Sleep schedule"
                value={preferences.sleep}
                options={lifestyleOptions.sleep}
                onChange={(value) => updatePreference('sleep', value)}
              />

              <SelectField
                label="Food"
                value={preferences.food}
                options={lifestyleOptions.food}
                onChange={(value) => updatePreference('food', value)}
              />
            </div>

            <button
              className="btn primary"
              disabled={loading || !user}
              onClick={() => findMatches(true)}
            >
              {loading ? 'Finding matches…' : 'Find my best matches →'}
            </button>

            {!user && <small>Log in to use personalized matching.</small>}
          </div>

          <div className="match-results">
            <div className="section-heading compact">
              <div>
                <h3>Top compatible people</h3>
                <p>
                  {matches.length
                    ? 'Ranked by our compatibility score.'
                    : 'Run the matcher to see profiles.'}
                </p>
              </div>
            </div>

            {matches.length ? (
              matches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="soft-empty">
                No matches yet. Complete your preferences and run the matcher.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
