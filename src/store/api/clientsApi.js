import { baseApi } from './baseApi';

const listTag = { type: 'Client', id: 'LIST' };

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: ({ page, limit = 100, status, q } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        if (status) params.set('status', status);
        if (q) params.set('q', q);
        return { url: `/api/clients?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((c) => ({ type: 'Client', id: c.id }))]
          : [listTag],
    }),
    getClient: builder.query({
      query: (id) => ({ url: `/api/clients/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    addClient: builder.mutation({
      query: (body) => ({ url: '/api/clients', method: 'POST', body }),
      invalidatesTags: [listTag],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/clients/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Client', id: arg.id },
        listTag,
      ],
    }),
    deactivateClient: builder.mutation({
      query: (id) => ({ url: `/api/clients/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Client', id }, listTag],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeactivateClientMutation,
} = clientsApi;
