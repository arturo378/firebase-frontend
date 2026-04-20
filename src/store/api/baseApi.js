import { createApi } from '@reduxjs/toolkit/query/react';
import api from '../../config/api';

const apiBaseQuery = async ({ url, method = 'GET', body }) => {
  try {
    let data;
    switch (method) {
      case 'GET':    data = await api.get(url); break;
      case 'DELETE': data = await api.delete(url); break;
      case 'POST':   data = await api.post(url, body); break;
      case 'PUT':    data = await api.put(url, body); break;
      case 'PATCH':  data = await api.patch(url, body); break;
      default:       data = await api.get(url);
    }
    return { data };
  } catch (error) {
    return {
      error: {
        status: error?.status ?? 'CUSTOM_ERROR',
        message: error?.message || 'Request failed',
        data: error?.data,
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: apiBaseQuery,
  tagTypes: [
    'Chemical',
    'Company',
    'Warehouse',
    'User',
    'Well',
    'Lease',
    'Delivery',
    'DeliveryChemical',
    'ShippingPaper',
    'ShippingChemical',
    'WarehouseChemical',
    'Pricing',
    'Dashboard',
    'Report',
  ],
  endpoints: () => ({}),
});
