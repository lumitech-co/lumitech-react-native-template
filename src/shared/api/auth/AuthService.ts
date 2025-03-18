import { createApi } from 'api/createApi';
import { baseQuery } from '../baseQuery';
import { CreateAccountResponse, Test } from './models';

export const AuthService = createApi({
  baseQuery,
  endpoints: builder => ({
    getUser: builder.get<CreateAccountResponse[], Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    getUserPrefetch: builder.getAsPrefetch<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    getUserPaginate: builder.paginate<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    getUserPrefetchPaginate: builder.paginateAsPrefetch<
      CreateAccountResponse,
      Test
    >({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    getUserAsMutation: builder.getAsMutation<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    deleteUser: builder.delete<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    patchUser: builder.patch<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    putUser: builder.put<CreateAccountResponse, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    postUser: builder.post<Test, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
    postUserAsQuery: builder.postAsQuery<Test, Test>({
      query: ({ token }) => ({
        url: `/v2/customer/`,
        params: {
          test: 'test12',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      disableGlobalErrorHandler: true,
    }),
  }),
});
