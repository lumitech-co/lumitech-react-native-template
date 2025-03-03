/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  useQuery,
  UseQueryOptions,
  QueryFunction,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api';
import type {
  DefinedUseQueryResult,
  UseQueryResult,
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query';

interface UseQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
}

export function useQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseQueryWithOptionsParams<TQueryFnData, TError, TData, TQueryKey> & {
    options: Omit<
      DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
      'queryFn' | 'queryKey'
    >;
  },
): DefinedUseQueryResult<TData, TError>;

export function useQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseQueryWithOptionsParams<TQueryFnData, TError, TData, TQueryKey> & {
    options: Omit<
      UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
      'queryFn' | 'queryKey'
    >;
  },
): UseQueryResult<TData, TError>;

export function useQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseQueryWithOptionsParams<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError>;

export function useQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UseQueryWithOptionsParams<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const { queryKey, queryFn, options } = params;

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}
