import React, { useState } from 'react';
import { api } from '../../api';
import { money } from '../../utils/format';

const fallbackImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

export function PropertyCard({ property, user, navigate, notify }) {
  const [saved, setSaved] = useState(Boolean(property.saved));

  const toggleSaved = async (event) => {
    event.stopPropagation();

    if (!user) {
      notify?.('Log in to save properties.', 'error');
      navigate('login');
      return;
    }

    try {
      const method = saved ? 'DELETE' : 'POST';
      const result = await api(`/favorites/${property._id}`, { method });

      setSaved(result.saved);
      notify?.(
        result.saved ? 'Saved to your list.' : 'Removed from saved.',
        'success'
      );
    } catch (error) {
      notify?.(error.message, 'error');
    }
  };

  const image = property.images?.[0] || fallbackImage;

  return (
    <article
      className="property-card"
      onClick={() => navigate('property', property._id)}
    >
      <div
        className="property-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="image-shade" />

        <span className="verified-badge">
          ✓ {property.verified ? 'Verified' : 'Approved'}
        </span>

        <button
          className={`heart ${saved ? 'saved' : ''}`}
          onClick={toggleSaved}
        >
          ♥
        </button>

        <div className="image-bottom">
          <span>{property.type}</span>
          <span>{property.furnished || 'Unfurnished'}</span>
        </div>
      </div>

      <div className="property-body">
        <div className="property-title-row">
          <h3>{property.title}</h3>
          <b>
            {money(property.rent)}
            <small>/mo</small>
          </b>
        </div>

        <p className="location">⌖ {property.locality || property.city}</p>

        <div className="meta">
          <span>{property.bedrooms || '—'} bed</span>
          <span>{property.bathrooms || '—'} bath</span>
          <span>
            {property.area ? `${property.area} sq.ft` : 'Flexible area'}
          </span>
        </div>

        <div className="tags">
          {(property.amenities || []).slice(0, 3).map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
