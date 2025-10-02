/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  useSuspenseInfiniteQuery,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api';

interface UseSuspenseInfiniteQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
  TPageParam,
> {
  queryKey: TQueryKey;
  queryFn: UseSuspenseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >['queryFn'];
  initialPageParam: TPageParam;
  getNextPageParam: UseSuspenseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >['getNextPageParam'];
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
}

export function useSuspenseInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseSuspenseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): UseSuspenseInfiniteQueryResult<TData, TError>;

export function useSuspenseInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseSuspenseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): UseSuspenseInfiniteQueryResult<TData, TError> {
  const { queryKey, queryFn, initialPageParam, getNextPageParam, options } =
    params;

  return useSuspenseInfiniteQuery<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
    ...options,
  });
}
