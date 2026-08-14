// Single source of truth for role checks. Nothing else in the app should
// compare `user.role` against a string literal directly.
//
// Note: these checks are UX only — a user can edit localStorage. The backend
// enforces the same rules via `authorize('admin')` on every write route.

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const isAdminUser = (user) => user?.role === ROLES.ADMIN;
