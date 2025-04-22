import { Endpoints } from './endpoints';

export type Params = Record<PropertyKey, string | number | boolean | undefined>;

export type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HTTPClient {
  request<TResponse, TBody = unknown>(options: {
    method: HTTPMethod;
    url: string;
    data?: TBody;
    headers?: Record<string, string>;
    params?: Params;
    signal?: AbortSignal;
  }): Promise<{ data: TResponse }>;
}

export type QueryOptions<D = unknown, M = HTTPMethod> = M extends
  | 'get'
  | 'delete'
  ? { params?: Params; signal?: AbortSignal }
  : {
      data: D;
      params?: Params;
      headers?: Record<string, string>;
      signal?: AbortSignal;
    };

export type QueryReturnType<D = unknown, M = HTTPMethod> = M extends
  | 'get'
  | 'delete'
  ? {
      url: Endpoints;
      params?: Params;
      headers?: Record<string, string>;
    }
  : {
      url: Endpoints;
      data?: D;
      params?: Params;
      headers?: Record<string, string>;
    };

export interface ApiBuilder {
  get: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config: P,
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'get'>,
      ) => QueryReturnType<unknown, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config?: {
        params?: Params;
        headers?: Record<string, string>;
      },
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;
  };

  getAsMutation: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (config: P) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'get'>,
      ) => QueryReturnType<unknown, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (config?: {
      params?: Params;
      headers?: Record<string, string>;
    }) => Promise<{ data: TResponse }>;
  };

  getAsPrefetch: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config: P,
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'get'>,
      ) => QueryReturnType<unknown, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config?: {
        params?: Params;
        headers?: Record<string, string>;
      },
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;
  };

  paginate: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config: P,
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'get'>,
      ) => QueryReturnType<unknown, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config?: {
        params?: Params;
        headers?: Record<string, string>;
      },
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;
  };

  paginateAsPrefetch: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config: P,
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'get'>,
      ) => QueryReturnType<unknown, 'get'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      config?: {
        params?: Params;
        headers?: Record<string, string>;
      },
      extra?: { signal?: AbortSignal },
    ) => Promise<{ data: TResponse }>;
  };

  delete: {
    <TResponse, P = unknown>(args: {
      query: (options: P) => QueryReturnType<P, 'delete'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (config: P) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'delete'>,
      ) => QueryReturnType<unknown, 'delete'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (config?: {
      params?: Params;
      headers?: Record<string, string>;
    }) => Promise<{ data: TResponse }>;
  };

  post: {
    <TResponse, TBody = unknown>(args: {
      query: (options: TBody) => QueryReturnType<TBody, 'post'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: TBody,
      config?: { headers?: Record<string, string>; params?: Params },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'post'>,
      ) => QueryReturnType<unknown, 'post'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: unknown,
      headers?: Record<string, string>,
      params?: Params,
    ) => Promise<{ data: TResponse }>;
  };

  postAsQuery: {
    <TResponse, TBody = unknown>(args: {
      query: (options: TBody) => QueryReturnType<TBody, 'post'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: TBody,
      config?: {
        headers?: Record<string, string>;
        params?: Params;
        signal?: AbortSignal;
      },
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'post'>,
      ) => QueryReturnType<unknown, 'post'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: unknown,
      headers?: Record<string, string>,
      params?: Params,
      signal?: AbortSignal,
    ) => Promise<{ data: TResponse }>;
  };

  put: {
    <TResponse, TBody = unknown>(args: {
      query: (options: TBody) => QueryReturnType<TBody, 'put'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: TBody,
      headers?: Record<string, string>,
      params?: Params,
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'put'>,
      ) => QueryReturnType<unknown, 'put'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: unknown,
      headers?: Record<string, string>,
      params?: Params,
    ) => Promise<{ data: TResponse }>;
  };

  patch: {
    <TResponse, TBody = unknown>(args: {
      query: (options: TBody) => QueryReturnType<TBody, 'patch'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: TBody,
      headers?: Record<string, string>,
      params?: Params,
    ) => Promise<{ data: TResponse }>;

    <TResponse = unknown>(args: {
      query: (
        options?: QueryOptions<unknown, 'patch'>,
      ) => QueryReturnType<unknown, 'patch'>;
      overrideBaseQuery?: boolean;
      disableGlobalErrorHandler?: boolean;
      baseQuery?: HTTPClient;
    }): (
      data: unknown,
      headers?: Record<string, string>,
      params?: Params,
    ) => Promise<{ data: TResponse }>;
  };
}
