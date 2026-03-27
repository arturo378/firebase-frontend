// Mock Firebase v7 API for demo mode.
// Provides auth and firestore interfaces backed by static data from demoData.js.

import { DEMO_ASSETS, DEMO_ASSET_DATA, DEMO_USERS } from './demoData';

const DATA_MAP = {
  assets: DEMO_ASSETS,
  asset_data: DEMO_ASSET_DATA,
  users: DEMO_USERS,
};

function createSnapshot(items) {
  return {
    docs: items.map((item) => ({
      id: item.id,
      data: () => {
        const { id, ...rest } = item;
        return rest;
      },
    })),
  };
}

function applyFilter(items, field, op, value) {
  return items.filter((item) => {
    const itemVal = item[field];
    if (op === '==') return itemVal === value;
    if (op === 'in') return Array.isArray(value) && value.includes(itemVal);
    if (op === '>' || op === '<') {
      const a = itemVal && typeof itemVal.toDate === 'function'
        ? itemVal.toDate()
        : new Date(itemVal);
      const b = value instanceof Date ? value : new Date(value);
      return op === '>' ? a > b : a < b;
    }
    return true;
  });
}

function createCollection(name, filters) {
  const resolveItems = () => {
    let items = [...(DATA_MAP[name] || [])];
    for (const [field, op, val] of filters) {
      items = applyFilter(items, field, op, val);
    }
    return items;
  };

  return {
    where: (field, op, val) =>
      createCollection(name, [...filters, [field, op, val]]),
    onSnapshot: (callback) => {
      callback(createSnapshot(resolveItems()));
      return () => {}; // unsubscribe no-op
    },
    get: () => Promise.resolve(createSnapshot(resolveItems())),
    add: () => Promise.resolve({ id: 'demo-' + Date.now() }),
    doc: () => ({
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    }),
  };
}

// Auth state management
const authCallbacks = [];
let currentUser = null;

const mockAuth = {
  onAuthStateChanged: (callback) => {
    authCallbacks.push(callback);
    callback(currentUser);
    return () => {
      const idx = authCallbacks.indexOf(callback);
      if (idx !== -1) authCallbacks.splice(idx, 1);
    };
  },
  signInWithEmailAndPassword: (email) => {
    const user = { uid: 'demo-uid', email };
    currentUser = user;
    authCallbacks.forEach((cb) => cb(user));
    return Promise.resolve({ user });
  },
  signOut: () => {
    currentUser = null;
    authCallbacks.forEach((cb) => cb(null));
    return Promise.resolve();
  },
  createUserWithEmailAndPassword: (email) => {
    return Promise.resolve({ user: { uid: 'demo-' + Date.now(), email } });
  },
  sendPasswordResetEmail: () => {
    alert('Demo mode: password reset emails are disabled.');
    return Promise.resolve();
  },
};

const mockFire = {
  auth: () => mockAuth,
  firestore: () => ({
    collection: (name) => createCollection(name, []),
  }),
};

export default mockFire;
