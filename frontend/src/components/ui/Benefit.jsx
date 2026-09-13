import React from 'react';

export function Benefit({ icon, title, text }) {
  return (
    <article className="benefit">
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
