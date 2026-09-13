import { api } from '../api';

export function searchProperties(filters) {
  const query = new URLSearchParams(filters);
  return api(`/properties?${query}`);
}

export function getProperty(id) {
  return api(`/properties/${id}`);
}

export function createProperty(payload) {
  return api('/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listOwnerProperties() {
  return api('/owner/properties');
}
