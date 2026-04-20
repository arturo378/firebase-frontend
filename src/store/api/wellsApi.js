import { baseApi } from './baseApi';

const listTag = { type: 'Well', id: 'LIST' };

export const wellsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWells: builder.query({
      query: ({ page, limit = 100, lease, company, active } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (lease) params.set('lease', lease);
        if (company) params.set('company', company);
        if (active !== undefined) params.set('active', active);
        return { url: `/api/wells?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((w) => ({ type: 'Well', id: w.id }))]
          : [listTag],
    }),
    addWell: builder.mutation({
      query: (body) => ({ url: '/api/wells', method: 'POST', body }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),
    updateWell: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/wells/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Well', id: arg.id },
        listTag,
        'Dashboard',
      ],
    }),
    deleteWell: builder.mutation({
      query: (id) => ({ url: `/api/wells/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),
  }),
});

export const {
  useGetWellsQuery,
  useAddWellMutation,
  useUpdateWellMutation,
  useDeleteWellMutation,
} = wellsApi;
