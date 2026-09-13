import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { dateFmt, initials, money } from '../../utils/format';
import { SkeletonDetail } from '../ui/Skeletons';

const fallbackImage =
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85';

export function PropertyDetail({ id, user, navigate, notify }) {
  const [property, setProperty] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(
    'Hi, I am interested in this property. Is it still available?'
  );

  useEffect(() => {
    api(`/properties/${id}`)
      .then(setProperty)
      .catch((error) => notify(error.message, 'error'));
  }, [id, notify]);

  if (!property) {
    return (
      <section className="page">
        <div className="container">
          <SkeletonDetail />
        </div>
      </section>
    );
  }

  const applyForProperty = async () => {
    if (!user) {
      navigate('login');
      return;
    }

    if (user.role !== 'tenant') {
      notify('Only tenant accounts can apply.', 'error');
      return;
    }

    setApplying(true);

    try {
      await api('/applications', {
        method: 'POST',
        body: JSON.stringify({
          property: id,
          message,
        }),
      });

      notify('Application sent successfully.', 'success');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <section className="page">
      <div className="container detail-wrap">
        <button className="back-btn" onClick={() => navigate('properties')}>
          ← Back to homes
        </button>

        <div className="detail-gallery">
          <div
            className="detail-main-image"
            style={{
              backgroundImage: `url(${property.images?.[0] || fallbackImage})`,
            }}
          />

          <div className="detail-mini-row">
            {(property.images?.slice(1, 4) || []).map((image, index) => (
              <div
                key={index}
                className="mini-detail"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </div>

        <div className="detail-grid">
          <div>
            <div className="eyebrow dark">
              <span /> PROPERTY DETAILS
            </div>

            <h1>{property.title}</h1>
            <p className="detail-location">
              ⌖ {property.locality}, {property.city}
            </p>

            <div className="price-line">
              <strong>{money(property.rent)}</strong>
              <span>/ month</span>
              {property.deposit && (
                <span> · Deposit {money(property.deposit)}</span>
              )}
            </div>

            <div className="detail-stats">
              <span>
                <b>{property.bedrooms || '—'}</b> Bedrooms
              </span>
              <span>
                <b>{property.bathrooms || '—'}</b> Bathrooms
              </span>
              <span>
                <b>{property.area || '—'}</b> sq.ft
              </span>
              <span>
                <b>{property.furnished || '—'}</b>
              </span>
            </div>

            <div className="detail-section">
              <h3>About this home</h3>
              <p>
                {property.description ||
                  'A thoughtfully maintained rental home with convenient access to everyday essentials.'}
              </p>
            </div>

            <div className="detail-section">
              <h3>Amenities</h3>
              <div className="amenity-grid">
                {(property.amenities || []).map((amenity) => (
                  <span key={amenity}>✓ {amenity}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Availability</h3>
              <p>
                Available from <b>{dateFmt(property.availableFrom)}</b>. Listed{' '}
                {dateFmt(property.createdAt)}.
              </p>
            </div>
          </div>

          <aside className="contact-card">
            <div className="owner-row">
              <div className="avatar">{initials(property.owner?.name)}</div>
              <div>
                <small>Listed by</small>
                <b>{property.owner?.name || 'Property owner'}</b>
                <span>Verified owner</span>
              </div>
            </div>

            <div className="divider" />

            <label>Your message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <button
              className="btn primary full"
              disabled={applying}
              onClick={applyForProperty}
            >
              {applying
                ? 'Sending…'
                : user?.role === 'tenant'
                  ? 'Apply for this home'
                  : 'Sign in to apply'}
            </button>

            {user && property.owner?._id && (
              <button
                className="btn ghost full"
                onClick={() => navigate('chat', String(property.owner._id))}
              >
                💬 Message owner
              </button>
            )}

            <small className="safe-note">
              Never transfer money before a verified visit and agreement.
            </small>
          </aside>
        </div>
      </div>
    </section>
  );
}
