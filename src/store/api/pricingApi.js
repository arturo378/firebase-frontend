import { baseApi } from './baseApi';

const listTag = { type: 'Pricing', id: 'LIST' };

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricing: builder.query({
      query: ({ page, limit = 100, company } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (company) params.set('company', company);
        return { url: `/api/pricing?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((p) => ({ type: 'Pricing', id: p.id }))]
          : [listTag],
    }),
    addPricing: builder.mutation({
      query: (body) => ({ url: '/api/pricing', method: 'POST', body }),
      invalidatesTags: [listTag],
    }),
    updatePricing: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/pricing/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Pricing', id: arg.id },
        listTag,
      ],
    }),
    deletePricing: builder.mutation({
      query: (id) => ({ url: `/api/pricing/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag],
    }),
  }),
});

export const {
  useGetPricingQuery,
  useAddPricingMutation,
  useUpdatePricingMutation,
  useDeletePricingMutation,
} = pricingApi;
