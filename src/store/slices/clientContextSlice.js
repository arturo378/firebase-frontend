import { createSlice } from '@reduxjs/toolkit';
import { getActiveClientId, setActiveClientId as persistActiveClientId, clearActiveClientId } from '../../config/clientContext';

const initialState = {
  activeClientId: getActiveClientId(),
  activeClientName: null,
};

const clientContextSlice = createSlice({
  name: 'clientContext',
  initialState,
  reducers: {
    setActiveClient(state, action) {
      const { id, name } = action.payload || {};
      state.activeClientId = id || null;
      state.activeClientName = id ? (name || null) : null;
      persistActiveClientId(id || null);
    },
    clearActiveClient(state) {
      state.activeClientId = null;
      state.activeClientName = null;
      clearActiveClientId();
    },
  },
});

export const { setActiveClient, clearActiveClient } = clientContextSlice.actions;
export default clientContextSlice.reducer;

export const selectActiveClientId = (state) => state.clientContext.activeClientId;
export const selectActiveClientName = (state) => state.clientContext.activeClientName;
