import { baseApi } from './baseApi';

const listTag = { type: 'Lease', id: 'LIST' };

export const leasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeases: builder.query({
      query: ({ page, limit = 100, company } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (company) params.set('company', company);
        return { url: `/api/leases?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((l) => ({ type: 'Lease', id: l.id }))]
          : [listTag],
    }),
    addLease: builder.mutation({
      query: (body) => ({ url: '/api/leases', method: 'POST', body }),
      invalidatesTags: [listTag, 'Well'],
    }),
    updateLease: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/leases/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Lease', id: arg.id },
        listTag,
        'Well',
      ],
    }),
    deleteLease: builder.mutation({
      query: (id) => ({ url: `/api/leases/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Well'],
    }),
  }),
});

export const {
  useGetLeasesQuery,
  useAddLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
} = leasesApi;
