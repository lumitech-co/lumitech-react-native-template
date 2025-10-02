import {
  InvalidateQueryFilters,
  FetchInfiniteQueryOptions,
  GetNextPageParamFunction,
  InfiniteData,
} from '@tanstack/react-query';
import { getQueryClient } from '../../queryClient';
import {
  QueryError,
  QueryKeyType,
  PrefetchInfiniteQueryFetchParams,
  queryKeys,
} from '../../models';
import { usePrefetchInfiniteQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

type PageParam = string | number | unknown;

interface InfiniteHookParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: GetNextPageParamFunction<
    TPageParam,
    CreateAccountResponse[]
  >;
  options?: Omit<
    FetchInfiniteQueryOptions<
      CreateAccountResponse[],
      QueryError,
      TData,
      QueryKeyType,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
}

interface InfiniteFetchParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: PrefetchInfiniteQueryFetchParams<
    CreateAccountResponse[],
    QueryError,
    InfiniteData<TData, TPageParam>,
    Test,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: PrefetchInfiniteQueryFetchParams<
    CreateAccountResponse[],
    QueryError,
    InfiniteData<TData, TPageParam>,
    Test,
    QueryKeyType,
    TPageParam
  >['fetchOptions'];
}

interface QueryFnParams<TPageParam> {
  params: Test;
  pageParam: TPageParam;
  signal: AbortSignal;
}

export const testPrefetchInfiniteQueryQueryFnAuthService = async <
  TPageParam extends PageParam,
>({
  params,
  pageParam,
  signal,
}: QueryFnParams<TPageParam>) => {
  const response = await AuthService.testPrefetchInfiniteQuery(
    { ...params, pageParam },
    { signal },
  );

  return response;
};

const getQueryKey = (params: Test) =>
  queryKeys.testPrefetchInfiniteQueryAuthService(params);

export const testPrefetchInfiniteQueryPrefetchInfiniteQueryAuthService = <
  TData = CreateAccountResponse[],
  TPageParam = PageParam,
>({
  initialPageParam,
  getNextPageParam,
  options,
  ...params
}: InfiniteFetchParams<TData, TPageParam>) => {
  const queryClient = getQueryClient();

  return queryClient.prefetchInfiniteQuery<
    CreateAccountResponse[],
    QueryError,
    InfiniteData<TData, TPageParam>,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      testPrefetchInfiniteQueryQueryFnAuthService({
        pageParam,
        params,
        signal,
      }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    ...options,
  });
};

export const useTestPrefetchInfiniteQueryPrefetchInfiniteQueryAuthService = <
  TData = CreateAccountResponse[],
  TPageParam = PageParam,
>({
  options,
  initialPageParam,
  getNextPageParam,
  ...params
}: InfiniteHookParams<TData, TPageParam>) => {
  return usePrefetchInfiniteQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      testPrefetchInfiniteQueryQueryFnAuthService({
        pageParam,
        params,
        signal,
      }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    options,
  });
};

export const invalidateTestPrefetchInfiniteQueryInfiniteQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};

export const resetTestPrefetchInfiniteQueryInfiniteQueryAuthService = async <
  TPageParam = PageParam,
>(
  params: Test,
): Promise<void> => {
  const queryClient = getQueryClient();
  const queryKey = getQueryKey(params);

  queryClient.setQueryData(
    queryKey,
    (oldData: InfiniteData<CreateAccountResponse[][], TPageParam>) => {
      if (!oldData) {
        return undefined;
      }

      return {
        pages: oldData.pages.slice(0, 1),
        pageParams: oldData.pageParams.slice(0, 1),
      };
    },
  );

  await queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
  });
};
