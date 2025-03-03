/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  usePrefetchInfiniteQuery,
  FetchInfiniteQueryOptions,
  GetNextPageParamFunction,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api';

interface UsePrefetchInfiniteQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
  TPageParam,
> {
  queryKey: TQueryKey;
  queryFn: FetchInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >['queryFn'];
  initialPageParam: TPageParam;
  getNextPageParam: GetNextPageParamFunction<TPageParam, TQueryFnData>;
  options?: Omit<
    FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
}

export function usePrefetchInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UsePrefetchInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): void;

export function usePrefetchInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UsePrefetchInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): void;

export function usePrefetchInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UsePrefetchInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): void {
  const { queryKey, queryFn, initialPageParam, getNextPageParam, ...options } =
    params;

  usePrefetchInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
    ...options,
  });
}
