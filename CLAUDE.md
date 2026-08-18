# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chemical Management System (CMS) frontend — a Create React App project using React 16, Material-UI v4, and React Router v5. It communicates with a Node.js REST API backend (replacing a legacy Firebase backend).

## Commands

- `npm start` — Dev server on port 3000
- `npm test` — Jest test runner (watch mode)
- `npm run build` — Production build to `/build`

## Environment

- Requires Node >= 23
- `REACT_APP_API_URL` — Backend API base URL (defaults to `http://localhost:3001`)
- `.env` file at project root sets defaults; CRA `.env.local` overrides are gitignored

## Architecture

### Entry Flow
`index.js` → `App.js` (checks `isAuthenticated()`) → renders `Login.js` or `Home.js`. `Home.js` contains the full layout (sidebar nav + React Router v5 `Switch` for all pages).

### API Layer
`src/config/api.js` is the centralized REST client. All requests use `fetch` with Bearer token from `localStorage('accessToken')` and `credentials: 'include'` for httpOnly refresh cookies. It normalizes Firebase `_id` → `id` for backward compatibility. Helper exports: `api.get/post/put/patch/delete`, `getCurrentUser()`, `isAuthenticated()`.

### Authentication
Login POSTs to `/api/auth/login`, stores `accessToken` and `currentUser` in localStorage. Logout POSTs to `/api/auth/logout` and clears storage. Auth gating is a single check in `App.js`.

### Authorization
Two roles: `admin` and `user` (backend `User.role`). `src/config/permissions.js` is the only place that compares role strings — use `isAdminUser()`, never `user.role === 'admin'`.

`src/config/AuthContext.js` (`AuthProvider` / `useAuth()`) seeds the role from cached localStorage for an instant first paint, then revalidates against `GET /api/auth/me` so a role change applies on reload without a re-login. On a network failure it keeps the cached user rather than locking an admin out.

Enforcement has three layers:
- **Nav** — sections in `Dashboard/listItems.js` marked `adminOnly: true` are filtered out for non-admins.
- **Routes** — `components/AdminRoute.js` wraps the eight admin routes in `Home.js` and redirects non-admins to `/`. It must stay a direct child of `<Switch>` with `path`/`exact` forwarded, since React Router v5 reads `child.props.path` off the element.
- **Tables** — Work Orders pages gate the `editable` prop on `isAdmin`, which is what renders material-table's add/edit/delete controls. Non-admins keep read access, the map modal, and the "Manage Chemicals" drill-down.

These are UX only; the backend enforces the same rules with `authorize('admin')` on every write route.

### State Management
Redux Toolkit (`src/store/`) holds shared client state: `authSlice` (login/logout thunks, token, cached user), `uiSlice` (sidebar, toasts), and `dashboardFiltersSlice`. Server data goes through RTK Query — `store/api/baseApi.js` plus one endpoint file per resource, all registered in `store/index.js`. Pages call the generated hooks (`useGetDeliveriesQuery`, `useAddDeliveryMutation`, …); RTK Query handles caching and tag invalidation, so there is no manual refetch after a mutation.

React Context remains for the role check only: `AuthContext` layers `isAdmin` and `GET /api/auth/me` revalidation on top of the auth state. Purely local UI state stays in `useState`.

### Feature Folders
- `src/Dashboard/` — Home dashboard, charts (Recharts), active wells map, sidebar nav (`listItems.js`)
- `src/Admin/` — CRUD pages for users, locations, leases, wells, warehouses, chemicals, pricing
- `src/WorkOrders/` — Shipping papers, shipping chemicals, delivery tracking with maps
- `src/Reports/` — Weekly earnings (with XLSX export), warehouse inventory, user reports
- `src/config/` — API client, app constants, demo/mock data (legacy)

### UI Patterns
Admin and report components follow a consistent pattern: `MaterialTable` with inline editable rows (`onRowAdd`/`onRowUpdate`/`onRowDelete`), modal popups for detail views, and `makeStyles` for component-scoped CSS.

### Key Libraries
- `material-table` for data grids
- `recharts` for charts
- `react-leaflet` + `leaflet` for maps (OpenStreetMap tiles)
- `xlsx` for Excel export
- `react-date-range` / `moment` / `date-fns` for date handling

### Legacy/Demo Mode
`src/config/fireMock.js` and `src/config/demoData.js` provide a mock Firebase API with static data. `src/config/fire.js` (real Firebase config) is gitignored.

### Known Quirk
The location management route is `/locationmanagment` (misspelled) — maintain this for backward compatibility.
