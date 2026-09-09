import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardFiltersSlice';
import clientContextReducer from './slices/clientContextSlice';

import './api/chemicalsApi';
import './api/companiesApi';
import './api/warehousesApi';
import './api/usersApi';
import './api/wellsApi';
import './api/leasesApi';
import './api/deliveriesApi';
import './api/shippingPapersApi';
import './api/warehouseChemicalsApi';
import './api/pricingApi';
import './api/reportsApi';
import './api/clientsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    clientContext: clientContextReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
