import { baseApi } from './baseApi';

const listTag = { type: 'Chemical', id: 'LIST' };

export const chemicalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChemicals: builder.query({
      query: ({ page, limit = 100 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        return { url: `/api/chemicals?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((c) => ({ type: 'Chemical', id: c.id }))]
          : [listTag],
    }),
    addChemical: builder.mutation({
      query: (body) => ({ url: '/api/chemicals', method: 'POST', body }),
      invalidatesTags: [listTag, 'Dashboard', 'Report'],
    }),
    updateChemical: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/chemicals/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Chemical', id: arg.id },
        listTag,
        'Dashboard',
        'Report',
      ],
    }),
    deleteChemical: builder.mutation({
      query: (id) => ({ url: `/api/chemicals/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Dashboard', 'Report'],
    }),
  }),
});

export const {
  useGetChemicalsQuery,
  useAddChemicalMutation,
  useUpdateChemicalMutation,
  useDeleteChemicalMutation,
} = chemicalsApi;
