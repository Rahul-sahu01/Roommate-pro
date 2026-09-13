import React from 'react';
import { initials, money } from '../../utils/format';

export function MatchCard({ match, navigate }) {
  return (
    <article className="match-card">
      <div className="avatar large">{initials(match.name)}</div>

      <div className="match-main">
        <div className="match-name-row">
          <div>
            <h3>{match.name}</h3>
            <p>
              ⌖ {match.city || 'Flexible city'} · {money(match.budget)} budget
            </p>
          </div>

          <div className="match-score">
            <b>{match.score}%</b>
            <span>match</span>
          </div>
        </div>

        <div className="match-bars">
          <span
            style={{ width: `${match.breakdown?.budget || 0}%` }}
          />
          <span style={{ width: `${match.breakdown?.city || 0}%` }} />
          <span
            style={{ width: `${match.breakdown?.lifestyle || 0}%` }}
          />
        </div>

        <div className="match-reasons">
          {(match.reasons || []).slice(0, 3).map((reason) => (
            <span key={reason}>✓ {reason}</span>
          ))}
        </div>

        <button
          className="btn ghost small-btn"
          onClick={() => navigate('chat', String(match._id))}
        >
          💬 Start conversation
        </button>
      </div>
    </article>
  );
}
