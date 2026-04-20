import { baseApi } from './baseApi';

const listTag = { type: 'WarehouseChemical', id: 'LIST' };

export const warehouseChemicalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarehouseChemicals: builder.query({
      query: ({ page, limit = 100, warehouse } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (warehouse) params.set('warehouse', warehouse);
        return { url: `/api/warehouse-chemicals?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((wc) => ({ type: 'WarehouseChemical', id: wc.id }))]
          : [listTag],
    }),
    addWarehouseChemical: builder.mutation({
      query: (body) => ({ url: '/api/warehouse-chemicals', method: 'POST', body }),
      invalidatesTags: [listTag, 'Dashboard', 'Report'],
    }),
    updateWarehouseChemical: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/warehouse-chemicals/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'WarehouseChemical', id: arg.id },
        listTag,
        'Dashboard',
        'Report',
      ],
    }),
    deleteWarehouseChemical: builder.mutation({
      query: (id) => ({ url: `/api/warehouse-chemicals/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Dashboard', 'Report'],
    }),
  }),
});

export const {
  useGetWarehouseChemicalsQuery,
  useAddWarehouseChemicalMutation,
  useUpdateWarehouseChemicalMutation,
  useDeleteWarehouseChemicalMutation,
} = warehouseChemicalsApi;
