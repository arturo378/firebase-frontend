// The tenant a superadmin is "acting as", overriding their home client via the
// X-Client-Id header. Plain localStorage (not Redux) so config/api.js — which
// runs outside React — can read it synchronously on every request, the same
// way it already reads accessToken.

const KEY = 'activeClientId';

export const getActiveClientId = () => localStorage.getItem(KEY) || null;

export const setActiveClientId = (id) => {
  if (id) localStorage.setItem(KEY, id);
  else localStorage.removeItem(KEY);
};

export const clearActiveClientId = () => localStorage.removeItem(KEY);
