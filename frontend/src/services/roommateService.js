import { api } from '../api';

export function findRoommateMatches(preferences, save = true) {
  return api('/matches', {
    method: 'POST',
    body: JSON.stringify({ preferences, save }),
  });
}

export function getConversation(peerId) {
  return api(`/chat/${peerId}`);
}
