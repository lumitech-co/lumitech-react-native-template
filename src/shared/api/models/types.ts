// This file is auto-generated. Do not modify manually.
import { AxiosError } from 'axios';
import {
  InfiniteData,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseSuspenseQueryOptions,
  UseSuspenseInfiniteQueryOptions,
  FetchQueryOptions,
  FetchInfiniteQueryOptions,
  GetNextPageParamFunction,
  QueryFunction,
  QueriesOptions,
  QueriesResults,
} from '@tanstack/react-query';
import { QueryKeyType } from './QueryKeys';

export type QueryError = AxiosError;

export type UseQueryWithOptionsParams<
  TQueryFnData,
  TError = QueryError,
  TData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
> = {
  queryKey: TQueryKey;
  queryFn: () => Promise<TQueryFnData>;
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
};

export interface UsePrefetchQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
> {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: Omit<
    FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
}

export type UseInfiniteQueryWithOptionsParams<
  TQueryFnData,
  TError = QueryError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
> = {
  queryKey: TQueryKey;
  queryFn: (context: { pageParam: TPageParam }) => Promise<TQueryFnData>;
  initialPageParam: TPageParam;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => TPageParam | undefined;
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
};

export interface UsePrefetchInfiniteQueryWithOptionsParams<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType,
  TPageParam,
> extends Omit<
    FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
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
}

export interface InfiniteQueryFetchParams<
  TQueryFnData,
  TError = QueryError,
  TData = InfiniteData<TQueryFnData>,
  TParams = unknown,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
> {
  params: TParams;
  fetchOptions?: Omit<
    FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
    'queryFn' | 'queryKey' | 'initialPageParam' | 'getNextPageParam'
  >;
  initialPageParam: TPageParam;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => TPageParam | undefined;
}

export interface PrefetchInfiniteQueryFetchParams<
  TQueryFnData,
  TError = QueryError,
  TData = InfiniteData<TQueryFnData>,
  TParams = unknown,
  TQueryKey extends QueryKeyType = QueryKeyType,
  TPageParam = unknown,
> {
  params: TParams;
  fetchOptions?: Omit<
    FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
    | 'queryFn'
    | 'queryKey'
    | 'initialPageParam'
    | 'getNextPageParam'
    | 'staleTime'
  >;
  initialPageParam: TPageParam;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => TPageParam | undefined;
}

export type FetchQueryOptionsWithoutKeyFn<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKeyType = QueryKeyType,
> = Omit<
  FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export interface QueryFetchParams<TQueryFnData, TError, TData, TParams> {
  params: TParams;
  fetchOptions?: FetchQueryOptionsWithoutKeyFn<
    TQueryFnData,
    TError,
    TData,
    QueryKeyType
  >;
}

export interface UseSuspenseQueryWithOptionsParams<
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

export interface UseSuspenseInfiniteQueryWithOptionsParams<
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

export interface UseQueriesWithOptionsParams<T extends Array<any>> {
  queries: readonly [...QueriesOptions<T>];
  options?: {
    combine?: (result: QueriesResults<T>) => any;
    subscribed?: boolean;
  };
}
