import { createSlice } from '@reduxjs/toolkit';
import { subDays, startOfDay, endOfDay } from 'date-fns';

const DEFAULT_RANGE = {
  startDate: startOfDay(subDays(new Date(), 29)).toISOString(),
  endDate: endOfDay(new Date()).toISOString(),
};

const initialState = {
  dateRange: DEFAULT_RANGE,
  companyId: null,
  focusedCompany: { id: null, name: null },
};

const dashboardFiltersSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange(state, action) {
      const { startDate, endDate } = action.payload;
      state.dateRange = {
        startDate: startOfDay(new Date(startDate)).toISOString(),
        endDate: endOfDay(new Date(endDate)).toISOString(),
      };
    },
    setCompany(state, action) {
      state.companyId = action.payload || null;
      state.focusedCompany = { id: null, name: null };
    },
    setFocusedCompany(state, action) {
      const { id, name } = action.payload || {};
      const current = state.focusedCompany;
      if (!id) {
        state.focusedCompany = { id: null, name: null };
      } else if (current.id === id) {
        state.focusedCompany = { id: null, name: null };
      } else {
        state.focusedCompany = { id, name: name || null };
      }
    },
    clearFocusedCompany(state) {
      state.focusedCompany = { id: null, name: null };
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setDateRange,
  setCompany,
  setFocusedCompany,
  clearFocusedCompany,
  resetFilters,
} = dashboardFiltersSlice.actions;

export default dashboardFiltersSlice.reducer;

export const selectDateRangeIso = (state) => state.dashboard.dateRange;
export const selectDateRange = (state) => ({
  startDate: new Date(state.dashboard.dateRange.startDate),
  endDate: new Date(state.dashboard.dateRange.endDate),
});
export const selectCompanyId = (state) => state.dashboard.companyId;
export const selectFocusedCompany = (state) => state.dashboard.focusedCompany;
