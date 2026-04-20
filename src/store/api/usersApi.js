import { baseApi } from './baseApi';

const listTag = { type: 'User', id: 'LIST' };

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page, limit = 100 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        return { url: `/api/users/?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((u) => ({ type: 'User', id: u.id }))]
          : [listTag],
    }),
    addUser: builder.mutation({
      query: (body) => ({ url: '/api/users', method: 'POST', body }),
      invalidatesTags: [listTag],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: arg.id },
        listTag,
      ],
    }),
    resetUserPassword: builder.mutation({
      query: (id) => ({ url: `/api/users/${id}/reset-password`, method: 'POST' }),
    }),
    deactivateUser: builder.mutation({
      query: (id) => ({ url: `/api/users/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, listTag],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useDeactivateUserMutation,
} = usersApi;
