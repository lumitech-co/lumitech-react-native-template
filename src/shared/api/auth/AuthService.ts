import { createApi, Promisify } from '../createApi';
import { axiosBaseQuery } from '../baseQuery';
import { CreateAccountResponse, Test } from './models';

interface AuthServiceAPI {
  testQuery: Promisify<Test, CreateAccountResponse[]>;
  testMutation: Promisify<Test, CreateAccountResponse>;
  testInfiniteQuery: Promisify<Test, CreateAccountResponse[]>;
  testSuspenseQuery: Promisify<Test, CreateAccountResponse>;
  testSuspenseInfiniteQuery: Promisify<Test, CreateAccountResponse[]>;
  testQueries: Promisify<Test, CreateAccountResponse[]>;
  testPrefetch: Promisify<Test, CreateAccountResponse>;
  testPrefetchInfiniteQuery: Promisify<Test, CreateAccountResponse[]>;
}

export const AuthService = createApi<AuthServiceAPI>()({
  baseQuery: axiosBaseQuery,
  endpoints: builder => ({
    testQuery: builder.query(({ token }, { signal, client }) => {
      return client.get(`/v2/customer/`, {
        params: { test: 'test12' },
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
    }),

    testMutation: builder.mutation(async ({ token }, { client }) => {
      const query = await client.post(
        `/v2/customer/`,
        { token },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return query.data;
    }),

    testInfiniteQuery: builder.infiniteQuery(
      ({ token }, { signal, client }) => {
        return client.get(`/v2/customer/paginated`, {
          params: { token },
          signal,
        });
      },
    ),

    testSuspenseQuery: builder.suspenseQuery(
      ({ token }, { signal, client }) => {
        return client.get(`/v2/customer/suspense`, {
          params: { test: 'suspense-test' },
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
      },
    ),

    testSuspenseInfiniteQuery: builder.suspenseInfiniteQuery(
      ({ token }, { signal, client }) => {
        return client.get(`/v2/customer/suspense-infinite`, {
          params: { token },
          signal,
        });
      },
    ),

    testQueries: builder.queries(({ token }, { signal, client }) => {
      return client.get(`/v2/customer/queries`, {
        params: { test: 'queries-test' },
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
    }),

    testPrefetch: builder.prefetch(({ token }, { signal, client }) => {
      return client.get(`/v2/customer/prefetch`, {
        params: { test: 'prefetch-test' },
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
    }),

    testPrefetchInfiniteQuery: builder.prefetchInfiniteQuery(
      ({ token }, { signal, client }) => {
        return client.get(`/v2/customer/prefetch-infinite`, {
          params: { token },
          signal,
        });
      },
    ),
  }),
});
