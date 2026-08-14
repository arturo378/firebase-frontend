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

function forceLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('currentUser');
  window.location.reload();
}

let refreshPromise = null;

async function refreshAccessToken() {
  // Deduplicate concurrent refresh attempts so multiple 401s don't race
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include', // sends the httpOnly refresh token cookie
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request(method, path, body, _isRetry = false) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('accessToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include', // sends the httpOnly refresh token cookie
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // On 401, attempt a token refresh once, then retry the original request.
  // Skip when there was no prior token — a 401 then is just bad credentials
  // (e.g. failed login), not an expired session, and should surface to the caller.
  if (res.status === 401 && !_isRetry && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request(method, path, body, true);
    }
    // Refresh failed — force user back to login
    forceLogout();
    return; // forceLogout reloads the page; this line is just a safeguard
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // express-validator rejections come back as { errors: [{ msg }] } with no
    // top-level message, so fall through to the first rule that failed.
    const validationMsg =
      Array.isArray(err.errors) && err.errors.length && err.errors[0].msg;
    throw new Error(err.message || validationMsg || res.statusText || 'Request failed');
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
