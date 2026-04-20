import { baseApi } from './baseApi';

const listTag = { type: 'ShippingPaper', id: 'LIST' };
const chemListTag = { type: 'ShippingChemical', id: 'LIST' };

export const shippingPapersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingPapers: builder.query({
      query: ({ page, limit = 500 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        return { url: `/api/shipping-papers?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((s) => ({ type: 'ShippingPaper', id: s.id }))]
          : [listTag],
    }),
    addShippingPaper: builder.mutation({
      query: (body) => ({ url: '/api/shipping-papers', method: 'POST', body }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),
    updateShippingPaper: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/shipping-papers/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ShippingPaper', id: arg.id },
        listTag,
        'Dashboard',
      ],
    }),
    deleteShippingPaper: builder.mutation({
      query: (id) => ({ url: `/api/shipping-papers/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),

    getShippingChemicals: builder.query({
      query: ({ page, limit = 100, shippingPaper } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (shippingPaper) params.set('shippingPaper', shippingPaper);
        return { url: `/api/shipping-chemicals?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [chemListTag, ...result.data.map((c) => ({ type: 'ShippingChemical', id: c.id }))]
          : [chemListTag],
    }),
    addShippingChemical: builder.mutation({
      query: (body) => ({ url: '/api/shipping-chemicals', method: 'POST', body }),
      invalidatesTags: [chemListTag, 'WarehouseChemical'],
    }),
    updateShippingChemical: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/shipping-chemicals/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ShippingChemical', id: arg.id },
        chemListTag,
        'WarehouseChemical',
      ],
    }),
    deleteShippingChemical: builder.mutation({
      query: (id) => ({ url: `/api/shipping-chemicals/${id}`, method: 'DELETE' }),
      invalidatesTags: [chemListTag, 'WarehouseChemical'],
    }),
  }),
});

export const {
  useGetShippingPapersQuery,
  useAddShippingPaperMutation,
  useUpdateShippingPaperMutation,
  useDeleteShippingPaperMutation,
  useGetShippingChemicalsQuery,
  useAddShippingChemicalMutation,
  useUpdateShippingChemicalMutation,
  useDeleteShippingChemicalMutation,
} = shippingPapersApi;
