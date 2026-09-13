const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL.replace(/\/api\/?$/, '');

export function getToken() {
  return localStorage.getItem('rm_token');
}

export function saveSession(data) {
  localStorage.setItem('rm_token', data.token);
  localStorage.setItem('rm_user', JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem('rm_token');
  localStorage.removeItem('rm_user');
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('rm_user') || 'null');
  } catch {
    return null;
  }
}

function buildHeaders(options) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: text || 'Invalid server response',
    };
  }
}

export async function api(path, options = {}) {
  const headers = buildHeaders(options);
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Cannot reach server. Start the backend or check VITE_API_URL.'
    );
  }

  const data = await readResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    throw new Error(data.error || 'Request failed');
  }

  return data;
}
