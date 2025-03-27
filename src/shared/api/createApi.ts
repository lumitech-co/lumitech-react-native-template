import { ApiBuilder, HTTPClient, QueryReturnType } from './types';

export const createApi = <TEndpoints>({
  baseQuery,
  endpoints,
}: {
  baseQuery: HTTPClient;
  endpoints: (builder: ApiBuilder) => TEndpoints;
}): TEndpoints => {
  const builder: ApiBuilder = {
    get:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'get'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, params, headers } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'get',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    getAsPrefetch:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'get'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, params, headers } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'get',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    getAsMutation:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'get'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, headers, params } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'get',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    paginate:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'get'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, params, headers } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'get',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    paginateAsPrefetch:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'get'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, params, headers } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'get',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    delete:
      <TResponse, P = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: P) => QueryReturnType<P, 'delete'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: P): Promise<{ data: TResponse }> => {
        const { url, params, headers } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'delete',
          url,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    post:
      <TResponse, TBody = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: TBody) => QueryReturnType<TBody, 'post'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: TBody): Promise<{ data: TResponse }> => {
        const { url, data, headers, params } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'post',
          url,
          data,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    postAsQuery:
      <TResponse, TBody = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: TBody) => QueryReturnType<TBody, 'post'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: TBody): Promise<{ data: TResponse }> => {
        const { url, data, headers, params } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'post',
          url,
          data,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    put:
      <TResponse, TBody = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (options: TBody) => QueryReturnType<TBody, 'put'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: TBody): Promise<{ data: TResponse }> => {
        const { url, data, headers, params } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'put',
          url,
          data,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },

    patch:
      <TResponse, TBody = unknown>({
        query,
        overrideBaseQuery,
        disableGlobalErrorHandler,
        baseQuery: customBaseQuery,
      }: {
        query: (requestOptions: TBody) => QueryReturnType<TBody, 'patch'>;
        overrideBaseQuery?: boolean;
        disableGlobalErrorHandler?: boolean;
        baseQuery?: HTTPClient;
      }) =>
      async (requestOptions: TBody): Promise<{ data: TResponse }> => {
        const { data, params, headers, url } = query(requestOptions);

        const queryInstance =
          overrideBaseQuery && customBaseQuery ? customBaseQuery : baseQuery;

        const response = await queryInstance.request<TResponse>({
          method: 'patch',
          url,
          data,
          params,
          headers: {
            ...headers,
            'x-disable-global-toast': disableGlobalErrorHandler
              ? 'false'
              : 'true',
          },
        });

        return response;
      },
  };

  return endpoints(builder);
};
