import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action) {
      state.sidebarOpen = Boolean(action.payload);
    },
    showToast: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ message, severity = 'info', duration = 4000 } = {}) {
        return { payload: { id: nanoid(), message, severity, duration } };
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setSidebar, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectToasts = (state) => state.ui.toasts;
