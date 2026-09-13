import { api } from '../api';

export function getCurrentUser() {
  return api('/auth/me');
}

export function updateCurrentUser(payload) {
  return api('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
