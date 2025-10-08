import { InfiniteData, InvalidateQueryFilters } from '@tanstack/react-query';
import { getQueryClient } from '../../queryClient';
import {
  InfiniteQueryFetchParams,
  QueryError,
  QueryKeyType,
  UseSuspenseInfiniteQueryWithOptionsParams,
  queryKeys,
} from '../../models';
import { useSuspenseInfiniteQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

type PageParam = string | number | unknown;

interface InfiniteHookParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: UseSuspenseInfiniteQueryWithOptionsParams<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: UseSuspenseInfiniteQueryWithOptionsParams<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >['options'];
}

interface InfiniteFetchParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: InfiniteQueryFetchParams<
    CreateAccountResponse[],
    QueryError,
    InfiniteData<TData, TPageParam>,
    Test,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: InfiniteQueryFetchParams<
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

const testSuspenseInfiniteQueryQueryFnAuthService = async <
  TPageParam extends PageParam,
>({
  params,
  pageParam,
  signal,
}: QueryFnParams<TPageParam>) => {
  const response = await AuthService.testSuspenseInfiniteQuery(
    { ...params, pageParam },
    { signal },
  );

  return response;
};

const getQueryKey = (params: Test) =>
  queryKeys.testSuspenseInfiniteQueryAuthService(params);

export const testSuspenseInfiniteQuerySuspenseInfiniteQueryAuthService = <
  TData = CreateAccountResponse[],
  TPageParam = PageParam,
>({
  initialPageParam,
  getNextPageParam,
  options,
  ...params
}: InfiniteFetchParams<TData, TPageParam>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchInfiniteQuery<
    CreateAccountResponse[],
    QueryError,
    InfiniteData<TData, TPageParam>,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      testSuspenseInfiniteQueryQueryFnAuthService({
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

export const useTestSuspenseInfiniteQuerySuspenseInfiniteQueryAuthService = <
  TData = CreateAccountResponse[],
  TPageParam = PageParam,
>({
  options,
  initialPageParam,
  getNextPageParam,
  ...params
}: InfiniteHookParams<TData, TPageParam>) => {
  return useSuspenseInfiniteQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      testSuspenseInfiniteQueryQueryFnAuthService({
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

export const invalidateTestSuspenseInfiniteQuerySuspenseInfiniteQueryAuthService =
  (params: Test, options?: Omit<InvalidateQueryFilters, 'queryKey'>) => {
    const queryClient = getQueryClient();

    return queryClient.invalidateQueries({
      queryKey: getQueryKey(params),
      ...options,
    });
  };
