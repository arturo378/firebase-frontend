import { baseApi } from './baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeeklyEarnings: builder.query({
      query: ({ startDate, endDate, company } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        if (company) params.set('company', company);
        return { url: `/api/reports/weekly-earnings?${params.toString()}` };
      },
      providesTags: ['Report'],
    }),
    getWarehouseInventoryReport: builder.query({
      query: ({ warehouse } = {}) => {
        const params = new URLSearchParams();
        if (warehouse) params.set('warehouse', warehouse);
        return { url: `/api/reports/warehouse-inventory?${params.toString()}` };
      },
      providesTags: ['Report'],
    }),
    getUserActivity: builder.query({
      query: ({ startDate, endDate, userId } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        if (userId) params.set('userId', userId);
        return { url: `/api/reports/user-activity?${params.toString()}` };
      },
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetWeeklyEarningsQuery,
  useGetWarehouseInventoryReportQuery,
  useGetUserActivityQuery,
} = reportsApi;
