import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { getCurrentUser } from './api';
import { isAdminUser, isSuperAdminUser } from './permissions';
import { clearActiveClientId } from './clientContext';

const AuthContext = createContext({ user: null, isAdmin: false, isSuperAdmin: false, ready: false });

export function AuthProvider({ children }) {
  // Seed synchronously from the cached login response so the first paint
  // already knows the role — no flash of the wrong nav.
  const [user, setUser] = useState(getCurrentUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Revalidate against the server so a role change takes effect on reload
    // instead of requiring a logout. api.js force-logs-out on an
    // unrecoverable 401, so we only handle the success/transient-error cases.
    api.get('/api/auth/me')
      .then((res) => {
        if (cancelled || !res?.user) return;
        // A stale "acting as client X" override from a prior superadmin
        // session (or a role downgrade) would otherwise keep sending
        // X-Client-Id and get rejected with FORBIDDEN_CLIENT_HEADER.
        if (!isSuperAdminUser(res.user)) clearActiveClientId();
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        setUser(res.user);
      })
      .catch((err) => {
        // Network blip or 5xx — keep the cached user rather than locking an
        // admin out of their own pages.
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin: isAdminUser(user), isSuperAdmin: isSuperAdminUser(user), ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
