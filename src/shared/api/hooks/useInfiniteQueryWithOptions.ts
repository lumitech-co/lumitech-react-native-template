/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  DefinedUseInfiniteQueryResult,
  UseInfiniteQueryResult,
  DefinedInitialDataInfiniteOptions,
  UndefinedInitialDataInfiniteOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api';

interface UseInfiniteQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
  TPageParam,
> {
  queryKey: TQueryKey;
  queryFn: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >['queryFn'];
  initialPageParam: TPageParam;
  getNextPageParam: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >['getNextPageParam'];
  options?: Omit<
    UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
}

export function useInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  > & {
    options: Omit<
      DefinedInitialDataInfiniteOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        TPageParam
      >,
      'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
    >;
  },
): DefinedUseInfiniteQueryResult<TData, TError>;

export function useInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  > & {
    options: Omit<
      UndefinedInitialDataInfiniteOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        TPageParam
      >,
      'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
    >;
  },
): UseInfiniteQueryResult<TData, TError>;

export function useInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): UseInfiniteQueryResult<TData, TError>;

export function useInfiniteQueryWithOptions<
  TQueryFnData,
  TError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
>(
  params: UseInfiniteQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): UseInfiniteQueryResult<TData, TError> {
  const { queryKey, queryFn, initialPageParam, getNextPageParam, options } =
    params;

  return useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
    queryKey,
    queryFn,
    initialPageParam,
    getNextPageParam,
    ...options,
  });
}
