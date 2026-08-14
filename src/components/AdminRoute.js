import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../config/AuthContext';

// Admin-only route. Hiding a nav item is not enforcement — this covers the
// deep-link case where a non-admin types the URL directly.
//
// Must stay a DIRECT child of <Switch> with its `path`/`exact` props intact:
// React Router v5's Switch reads `child.props.path` off the element, so the
// props have to be forwarded through `...rest`.
export default function AdminRoute({ children, ...rest }) {
  const { isAdmin, ready } = useAuth();

  return (
    <Route {...rest}>
      {!ready ? null : isAdmin ? children : <Redirect to="/" />}
    </Route>
  );
}
