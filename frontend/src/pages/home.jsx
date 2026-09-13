import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { PropertyCard } from '../components/property';
import { Benefit } from '../components/ui';

export function Home({ user, navigate }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api('/properties?limit=6')
      .then(setFeatured)
      .catch(() => setFeatured([]));
  }, []);

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      navigate('properties');
    }
  };

  return (
    <div>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> INDIA'S RENTAL & ROOMMATE MARKETPLACE
            </div>

            <h1>
              Find a home.
              <br />
              <em>Find your people.</em>
            </h1>

            <p>
              Discover verified rentals, compatible roommates and a smoother
              move-in journey—all from one beautifully simple place.
            </p>

            <div className="hero-search">
              <input
                placeholder="Search city, locality, PG, 2BHK..."
                onKeyDown={handleSearch}
              />
              <button
                className="btn primary"
                onClick={() => navigate('properties')}
              >
                Search homes
              </button>
            </div>

            <div className="trust-row">
              <span>✓ Verified listings</span>
              <span>✓ Smart roommate matching</span>
              <span>✓ Secure applications</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-a">
              <b>97%</b>
              <span>match score</span>
            </div>

            <div className="mock-room">
              <div className="mock-top">
                <span>Premium 2BHK</span>
                <i>♡</i>
              </div>

              <div className="room-image">
                <div className="room-window" />
                <div className="room-sofa" />
                <div className="room-table" />
              </div>

              <div className="mock-info">
                <strong>Modern home in Noida</strong>
                <small>
                  ₹18,500 / month · Fully furnished
                </small>
                <div className="mini-tags">
                  <span>WiFi</span>
                  <span>Parking</span>
                  <span>Power backup</span>
                </div>
              </div>
            </div>

            <div className="floating-card card-b">
              <span className="mini-avatar">A</span>
              <div>
                <b>Aman</b>
                <small>Looking for a roommate</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow dark">
                <span /> WHY ROOMMATE PRO
              </div>
              <h2>Everything you need to rent smarter.</h2>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate('properties')}
            >
              Explore homes →
            </button>
          </div>

          <div className="benefit-grid">
            <Benefit
              icon="⌕"
              title="Search like a marketplace"
              text="Powerful city, budget, type, furnishing and amenity filters."
            />
            <Benefit
              icon="◌"
              title="Match with people"
              text="Compatibility scores based on budget and lifestyle preferences."
            />
            <Benefit
              icon="✓"
              title="Apply with confidence"
              text="Track applications and property responses from one place."
            />
            <Benefit
              icon="◫"
              title="Manage your rental journey"
              text="Owners get listings, applications and conversations in one hub."
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow dark">
                <span /> HANDPICKED FOR YOU
              </div>
              <h2>Popular homes</h2>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate('properties')}
            >
              View all →
            </button>
          </div>

          {featured.length ? (
            <div className="property-grid">
              {featured.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  user={user}
                  navigate={navigate}
                />
              ))}
            </div>
          ) : (
            <div className="soft-empty">
              No featured listings yet. Add your first property from the Owner
              Hub.
            </div>
          )}
        </div>
      </section>

      <section className="section dark-section">
        <div className="container split-cta">
          <div>
            <div className="eyebrow">
              <span /> BUILD YOUR NEXT MOVE
            </div>
            <h2>Better matches. Better homes. Less hassle.</h2>
            <p>
              Set your preferences and let RoomMate Pro do the first round of
              searching for you.
            </p>
          </div>

          <button
            className="btn white"
            onClick={() => navigate(user ? 'matches' : 'register')}
          >
            {user ? 'Find my matches' : 'Create free account'} →
          </button>
        </div>
      </section>
    </div>
  );
}
