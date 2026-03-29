// Central API client replacing Firebase.
// Reads/writes access token from localStorage.
// Refresh token is stored in an httpOnly cookie by the backend automatically.

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Recursively maps _id → id on response objects so existing code using .id keeps working
function normalizeIds(data) {
  if (Array.isArray(data)) return data.map(normalizeIds);
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = normalizeIds(data[key]);
    }
    if (result._id !== undefined) result.id = String(result._id);
    return result;
  }
  return data;
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('accessToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include', // sends the httpOnly refresh token cookie
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  const json = await res.json();
  return normalizeIds(json);
}

const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem('currentUser');
  return raw ? JSON.parse(raw) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export default api;
