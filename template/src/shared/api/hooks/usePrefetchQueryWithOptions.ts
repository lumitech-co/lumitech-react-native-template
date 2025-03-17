/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import { usePrefetchQuery } from '@tanstack/react-query';
import type {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query';
import { QueryKeyType, UsePrefetchQueryWithOptionsParams } from '../models';

export function usePrefetchQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UsePrefetchQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > & {
    options: Omit<
      DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
      'queryFn' | 'queryKey'
    >;
  },
): void;

export function usePrefetchQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UsePrefetchQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > & {
    options: Omit<
      UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
      'queryFn' | 'queryKey'
    >;
  },
): void;

export function usePrefetchQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UsePrefetchQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
): void;

export function usePrefetchQueryWithOptions<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: UsePrefetchQueryWithOptionsParams<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
): void {
  const { queryKey, queryFn, options } = params;

  usePrefetchQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}
