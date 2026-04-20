import { baseApi } from './baseApi';

const listTag = { type: 'Delivery', id: 'LIST' };
const chemListTag = { type: 'DeliveryChemical', id: 'LIST' };

export const deliveriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveries: builder.query({
      query: ({ page, limit = 500, company, active } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (company) params.set('company', company);
        if (active !== undefined && active !== null) params.set('active', active);
        return { url: `/api/deliveries?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((d) => ({ type: 'Delivery', id: d.id }))]
          : [listTag],
    }),
    addDelivery: builder.mutation({
      query: (body) => ({ url: '/api/deliveries', method: 'POST', body }),
      invalidatesTags: [listTag, 'WarehouseChemical', 'Dashboard', 'Report'],
    }),
    updateDelivery: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/deliveries/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Delivery', id: arg.id },
        listTag,
        'WarehouseChemical',
        'Dashboard',
        'Report',
      ],
    }),
    deleteDelivery: builder.mutation({
      query: (id) => ({ url: `/api/deliveries/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'WarehouseChemical', 'Dashboard', 'Report'],
    }),

    getDeliveryChemicals: builder.query({
      query: ({ page, limit = 100, delivery } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (delivery) params.set('delivery', delivery);
        return { url: `/api/delivery-chemicals?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [chemListTag, ...result.data.map((c) => ({ type: 'DeliveryChemical', id: c.id }))]
          : [chemListTag],
    }),
    addDeliveryChemical: builder.mutation({
      query: (body) => ({ url: '/api/delivery-chemicals', method: 'POST', body }),
      invalidatesTags: [chemListTag, 'WarehouseChemical', 'Report'],
    }),
    updateDeliveryChemical: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/delivery-chemicals/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'DeliveryChemical', id: arg.id },
        chemListTag,
        'WarehouseChemical',
        'Report',
      ],
    }),
    deleteDeliveryChemical: builder.mutation({
      query: (id) => ({ url: `/api/delivery-chemicals/${id}`, method: 'DELETE' }),
      invalidatesTags: [chemListTag, 'WarehouseChemical', 'Report'],
    }),
  }),
});

export const {
  useGetDeliveriesQuery,
  useAddDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetDeliveryChemicalsQuery,
  useAddDeliveryChemicalMutation,
  useUpdateDeliveryChemicalMutation,
  useDeleteDeliveryChemicalMutation,
} = deliveriesApi;
