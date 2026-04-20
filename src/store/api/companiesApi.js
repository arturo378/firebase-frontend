import { baseApi } from './baseApi';

const listTag = { type: 'Company', id: 'LIST' };

export const companiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query({
      query: ({ page, limit = 100 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.set('page', page);
        params.set('limit', limit);
        return { url: `/api/companies?${params.toString()}` };
      },
      providesTags: (result) =>
        result?.data
          ? [listTag, ...result.data.map((c) => ({ type: 'Company', id: c.id }))]
          : [listTag],
    }),
    addCompany: builder.mutation({
      query: (body) => ({ url: '/api/companies', method: 'POST', body }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/companies/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Company', id: arg.id },
        listTag,
        'Dashboard',
      ],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({ url: `/api/companies/${id}`, method: 'DELETE' }),
      invalidatesTags: [listTag, 'Dashboard'],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;
