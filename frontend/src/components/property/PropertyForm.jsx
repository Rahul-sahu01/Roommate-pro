import React, { useState } from 'react';
import { api } from '../../api';
import { amenityOptions, propertyTypes } from '../../config/constants';
import { Field, SelectField } from '../forms';

export function PropertyForm({ close, notify, onDone }) {
  const [form, setForm] = useState({
    title: '',
    city: 'Delhi',
    locality: '',
    rent: '',
    deposit: '',
    type: '2BHK',
    furnished: 'Furnished',
    bedrooms: 2,
    bathrooms: 2,
    area: '',
    availableFrom: '',
    description: '',
    image: '',
    amenities: ['WiFi', 'Power Backup'],
  });
  const [saving, setSaving] = useState(false);

  const setField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((current) => {
      const alreadySelected = current.amenities.includes(amenity);

      return {
        ...current,
        amenities: alreadySelected
          ? current.amenities.filter((item) => item !== amenity)
          : [...current.amenities, amenity],
      };
    });
  };

  const submit = async () => {
    if (!form.title || !form.city || !form.rent) {
      notify('Title, city and rent are required.', 'error');
      return;
    }

    setSaving(true);

    try {
      await api('/properties', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          rent: Number(form.rent),
          deposit: Number(form.deposit || 0),
          bedrooms: Number(form.bedrooms || 0),
          bathrooms: Number(form.bathrooms || 0),
          area: Number(form.area || 0),
          images: form.image ? [form.image] : [],
        }),
      });

      notify('Listing sent for approval.', 'success');
      close();
      onDone?.();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <div className="eyebrow dark">
              <span /> NEW LISTING
            </div>
            <h2>List a property</h2>
          </div>

          <button className="modal-close" onClick={close}>
            ×
          </button>
        </div>

        <div className="form-grid two">
          <Field
            label="Property title"
            value={form.title}
            onChange={(value) => setField('title', value)}
            placeholder="Sunlit 2BHK near metro"
          />
          <Field
            label="City"
            value={form.city}
            onChange={(value) => setField('city', value)}
          />
          <Field
            label="Locality"
            value={form.locality}
            onChange={(value) => setField('locality', value)}
          />
          <Field
            label="Monthly rent"
            type="number"
            value={form.rent}
            onChange={(value) => setField('rent', value)}
          />
          <Field
            label="Security deposit"
            type="number"
            value={form.deposit}
            onChange={(value) => setField('deposit', value)}
          />
          <SelectField
            label="Type"
            value={form.type}
            options={propertyTypes}
            onChange={(value) => setField('type', value)}
          />
          <SelectField
            label="Furnishing"
            value={form.furnished}
            options={['Furnished', 'Semi-furnished', 'Unfurnished']}
            onChange={(value) => setField('furnished', value)}
          />
          <Field
            label="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={(value) => setField('bedrooms', value)}
          />
          <Field
            label="Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={(value) => setField('bathrooms', value)}
          />
          <Field
            label="Area (sq.ft)"
            type="number"
            value={form.area}
            onChange={(value) => setField('area', value)}
          />
          <Field
            label="Available from"
            type="date"
            value={form.availableFrom}
            onChange={(value) => setField('availableFrom', value)}
          />
          <Field
            label="Image URL"
            value={form.image}
            onChange={(value) => setField('image', value)}
            placeholder="https://..."
          />
        </div>

        <Field
          label="Description"
          multiline
          value={form.description}
          onChange={(value) => setField('description', value)}
        />

        <div className="field-block">
          <label>Amenities</label>
          <div className="choice-grid">
            {amenityOptions.map((amenity) => {
              const selected = form.amenities.includes(amenity);

              return (
                <button
                  key={amenity}
                  type="button"
                  className={selected ? 'choice selected' : 'choice'}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {selected ? '✓' : '+'} {amenity}
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={close}>
            Cancel
          </button>
          <button
            className="btn primary"
            disabled={saving}
            onClick={submit}
          >
            {saving ? 'Publishing…' : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>
  );
}
