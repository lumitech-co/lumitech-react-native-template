import { createApi, Promisify } from '../createApi';
import { axiosBaseQuery } from '../baseQuery';
import { CreateAccountResponse, Test } from './models';

interface AuthServiceAPI {
  getUser: Promisify<Test, CreateAccountResponse[]>;
  createUser: Promisify<Test, CreateAccountResponse>;
  getUsersPaginated: Promisify<Test, CreateAccountResponse[]>;
}

export const AuthService = createApi<AuthServiceAPI>()({
  baseQuery: axiosBaseQuery,
  endpoints: builder => ({
    getUser: builder.query(({ token }, { signal, client }) => {
      return client.get(`/v2/customer/`, {
        params: { test: 'test12' },
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
    }),

    createUser: builder.mutation(async ({ token }, { client }) => {
      const query = await client.post(
        `/v2/customer/`,
        { token },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return query.data;
    }),

    getUsersPaginated: builder.infiniteQuery(
      ({ token }, { signal, client }) => {
        return client.get(`/v2/customer/paginated`, {
          params: { token },
          signal,
        });
      },
    ),
  }),
});
