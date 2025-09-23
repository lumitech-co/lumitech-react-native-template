/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
  QueryFunction,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api';

interface UseSuspenseQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: Omit<
    UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
}

export function useSuspenseQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseSuspenseQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
): UseSuspenseQueryResult<TData, TError>;

export function useSuspenseQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseSuspenseQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
): UseSuspenseQueryResult<TData, TError> {
  const { queryKey, queryFn, options } = params;

  return useSuspenseQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}
