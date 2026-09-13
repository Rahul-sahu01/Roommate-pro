import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { propertyTypes } from '../config/constants';
import { PropertyCard } from '../components/property';
import { EmptyState, SkeletonGrid } from '../components/ui';

const emptyFilters = {
  q: '',
  city: '',
  min: '',
  max: '',
  type: '',
  furnished: '',
  amenity: '',
  sort: 'newest',
};

export function Properties({ user, navigate, notify }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const loadProperties = () => {
    setLoading(true);

    const params = new URLSearchParams(filters);

    api(`/properties?${params}`)
      .then(setListings)
      .catch((error) => notify(error.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <section className="page">
      <div className="container">
        <div className="market-head">
          <div>
            <div className="eyebrow dark">
              <span /> RENTAL MARKETPLACE
            </div>
            <h1>Find your next home</h1>
            <p>
              {listings.length} verified or approved listings ready to explore.
            </p>
          </div>

          {user?.role === 'owner' && (
            <button
              className="btn primary"
              onClick={() => navigate('owner')}
            >
              + List a property
            </button>
          )}
        </div>

        <div className="filter-panel">
          <div className="search-wide">
            <span>⌕</span>
            <input
              value={filters.q}
              placeholder="Search by city, locality, title or keyword"
              onChange={(event) => updateFilter('q', event.target.value)}
            />
          </div>

          <select
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value)}
          >
            <option value="">All property types</option>
            {propertyTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min rent"
            value={filters.min}
            onChange={(event) => updateFilter('min', event.target.value)}
          />

          <input
            type="number"
            placeholder="Max rent"
            value={filters.max}
            onChange={(event) => updateFilter('max', event.target.value)}
          />

          <select
            value={filters.furnished}
            onChange={(event) =>
              updateFilter('furnished', event.target.value)
            }
          >
            <option value="">Furnishing</option>
            <option>Furnished</option>
            <option>Semi-furnished</option>
            <option>Unfurnished</option>
          </select>

          <select
            value={filters.sort}
            onChange={(event) => updateFilter('sort', event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="rentLow">Rent: low to high</option>
            <option value="rentHigh">Rent: high to low</option>
          </select>

          <button className="btn primary" onClick={loadProperties}>
            Apply filters
          </button>
        </div>

        <div className="market-toolbar">
          <strong>
            {loading ? 'Finding homes…' : `${listings.length} homes found`}
          </strong>

          <div className="toolbar-actions">
            <button
              className={view === 'grid' ? 'selected' : ''}
              onClick={() => setView('grid')}
            >
              ▦
            </button>
            <button
              className={view === 'list' ? 'selected' : ''}
              onClick={() => setView('list')}
            >
              ☷
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : listings.length ? (
          <div className={view === 'grid' ? 'property-grid' : 'property-list'}>
            {listings.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                user={user}
                navigate={navigate}
                notify={notify}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="⌂"
            title="No homes match those filters"
            text="Try a wider budget, a different city or reset a filter."
            action={() => setFilters(emptyFilters)}
          />
        )}
      </div>
    </section>
  );
}

export function Favorites({ user, navigate, notify }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api('/favorites')
      .then(setListings)
      .catch((error) => notify(error.message, 'error'));
  }, []);

  return (
    <section className="page">
      <div className="container">
        <div className="market-head">
          <div>
            <div className="eyebrow dark">
              <span /> YOUR SHORTLIST
            </div>
            <h1>Saved homes</h1>
            <p>Your private list of properties you want to revisit.</p>
          </div>
        </div>

        {listings.length ? (
          <div className="property-grid">
            {listings.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                user={user}
                navigate={navigate}
                notify={notify}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="♥"
            title="Your shortlist is empty"
            text="Save homes you like and compare them later."
            action={() => navigate('properties')}
          />
        )}
      </div>
    </section>
  );
}
