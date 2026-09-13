import React from 'react';
import { money, dateFmt } from '../../utils/format';

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70';

export function ApplicationRow({ application, onAction }) {
  const image = application.property?.images?.[0] || fallbackImage;

  return (
    <div className="application-row">
      <div className="application-home">
        <div
          className="tiny-thumb"
          style={{ backgroundImage: `url(${image})` }}
        />

        <div>
          <b>{application.property?.title || 'Property'}</b>
          <small>
            {application.property?.city} · {money(application.property?.rent)}
          </small>
        </div>
      </div>

      <span className={`pill ${application.status}`}>
        {application.status}
      </span>

      <small>{dateFmt(application.createdAt)}</small>

      {onAction && onAction}
    </div>
  );
}
