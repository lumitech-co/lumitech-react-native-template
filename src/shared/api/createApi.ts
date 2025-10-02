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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
    options?: {
      overrideBaseQuery?: boolean;
      baseQuery?: any;
    },
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
      query: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      prefetch: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      mutation: (mutationFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return mutationFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      infiniteQuery: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      prefetchInfiniteQuery: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      suspenseQuery: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      suspenseInfiniteQuery: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },

      queries: (queryFn, options) => (params, extra) => {
        const clientToUse =
          options?.overrideBaseQuery && options?.baseQuery
            ? options.baseQuery
            : baseQuery;

        return queryFn(params, {
          signal: extra?.signal,
          client: clientToUse as TClient,
          disableGlobalErrorHandler: false,
        });
      },
    };

    return endpoints(builder);
  };
