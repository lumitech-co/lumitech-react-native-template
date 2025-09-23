export type Promisify<TRequest, TResponse> = (
  params: TRequest,
  extra?: { signal?: AbortSignal },
) => Promise<TResponse>;

type GenericApiBuilder<TClient> = {
  query<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  prefetch<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  mutation<TRequest = unknown, TResponse = any>(
    mutationFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  infiniteQuery<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  prefetchInfiniteQuery<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  suspenseQuery<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  suspenseInfiniteQuery<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;

  queries<TRequest = unknown, TResponse = any>(
    queryFn: (
      params: TRequest,
      context: {
        signal?: AbortSignal;
        client: TClient;
        disableGlobalErrorHandler?: boolean;
      },
    ) => Promise<TResponse>,
  ): (params: TRequest, extra?: { signal?: AbortSignal }) => Promise<TResponse>;
};

export const createApi =
  <TServiceInterface>() =>
  <TClient>(config: {
    baseQuery: TClient;
    endpoints: (builder: GenericApiBuilder<TClient>) => TServiceInterface;
  }): TServiceInterface => {
    const { baseQuery, endpoints } = config;
    const builder: GenericApiBuilder<TClient> = {
      query: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      prefetch: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      mutation: mutationFn => (params, extra) => {
        return mutationFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      infiniteQuery: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      prefetchInfiniteQuery: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      suspenseQuery: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      suspenseInfiniteQuery: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },

      queries: queryFn => (params, extra) => {
        return queryFn(params, {
          signal: extra?.signal,
          client: baseQuery,
          disableGlobalErrorHandler: false,
        });
      },
    };

    return endpoints(builder);
  };
