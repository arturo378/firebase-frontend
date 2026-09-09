// Single source of truth for role checks. Nothing else in the app should
// compare `user.role` against a string literal directly.
//
// Note: these checks are UX only — a user can edit localStorage. The backend
// enforces the same rules (including rank, via `authorize('admin')` and the
// FORBIDDEN_ROLE_ESCALATION guard) on every write route.

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const ROLE_RANK = {
  [ROLES.USER]: 0,
  [ROLES.ADMIN]: 1,
  [ROLES.SUPERADMIN]: 2,
};

const rank = (role) => ROLE_RANK[role] ?? -1;

export const isAdminUser = (user) => rank(user?.role) >= ROLE_RANK[ROLES.ADMIN];
export const isSuperAdminUser = (user) => rank(user?.role) >= ROLE_RANK[ROLES.SUPERADMIN];

// Roles an acting user is allowed to grant to someone else — mirrors the
// backend's FORBIDDEN_ROLE_ESCALATION guard so the UI never offers a choice
// that would be rejected server-side.
export const assignableRoles = (actingRole) =>
  Object.values(ROLES).filter((r) => rank(r) <= rank(actingRole));
