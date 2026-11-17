const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getErrorMessage(data) {
  const detail = data?.detail;

  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || String(item)).join(' ');
  }

  return null;
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {};

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data) || 'Não foi possível concluir a solicitação.');
  }

  return data;
}

export const authApi = {
  register: (email, password) =>
    apiRequest('/register', { method: 'POST', body: { email, password } }),
  login: (email, password) =>
    apiRequest('/login', { method: 'POST', body: { email, password } }),
  logout: (token) => apiRequest('/logout', { method: 'POST', token }),
  me: (token) => apiRequest('/me', { token }),
};

export const profileApi = {
  get: (token) => apiRequest('/me/profile', { token }),
  save: (profile, token) =>
    apiRequest('/me/profile', { method: 'PUT', body: profile, token }),
};
