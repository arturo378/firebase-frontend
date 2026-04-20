import { baseApi } from './baseApi';

const listTag = { type: 'Warehouse', id: 'LIST' };

export const warehousesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarehouses: builder.query({
      query: ({ page, limit = 100 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        return { url: `/api/warehouses?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((w) => ({ type: 'Warehouse', id: w.id }))]
          : [listTag],
    }),
    addWarehouse: builder.mutation({
      query: (body) => ({ url: '/api/warehouses', method: 'POST', body }),
      invalidatesTags: [listTag],
    }),
    updateWarehouse: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/warehouses/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Warehouse', id: arg.id },
        listTag,
        'WarehouseChemical',
      ],
    }),
    deleteWarehouse: builder.mutation({
      query: (id) => ({ url: `/api/warehouses/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'WarehouseChemical'],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehousesApi;
