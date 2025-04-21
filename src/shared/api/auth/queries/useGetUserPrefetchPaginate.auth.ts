import { InvalidateQueryFilters, InfiniteData } from '@tanstack/react-query';
import { getQueryClient } from '../../queryClient';
import {
  InfiniteQueryFetchParams,
  QueryError,
  QueryKeyType,
  UseInfiniteQueryWithOptionsParams,
  queryKeys,
} from '../../models';
import { useInfiniteQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

type PageParam = string | number | unknown;

interface InfiniteHookParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: UseInfiniteQueryWithOptionsParams<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: UseInfiniteQueryWithOptionsParams<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >['options'];
}

interface InfiniteFetchParams<TData, TPageParam = PageParam> extends Test {
  initialPageParam: TPageParam;
  getNextPageParam: InfiniteQueryFetchParams<
    CreateAccountResponse,
    QueryError,
    InfiniteData<TData, TPageParam>,
    Test,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: InfiniteQueryFetchParams<
    CreateAccountResponse,
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

export const getUserPrefetchPaginateQueryFnAuthService = async <
  TPageParam extends PageParam,
>({
  params,
  pageParam,
  signal,
}: QueryFnParams<TPageParam>) => {
  const response = await AuthService.getUserPrefetchPaginate(
    { ...params, pageParam },
    { signal },
  );

  return response?.data;
};

const getQueryKey = (params: Test) =>
  queryKeys.getUserPrefetchPaginateAuthService(params);

export const getUserPrefetchPaginateInfiniteQueryAuthService = <
  TData = CreateAccountResponse,
  TPageParam = PageParam,
>({
  initialPageParam,
  getNextPageParam,
  options,
  ...params
}: InfiniteFetchParams<TData, TPageParam>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchInfiniteQuery<
    CreateAccountResponse,
    QueryError,
    InfiniteData<TData, TPageParam>,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      getUserPrefetchPaginateQueryFnAuthService({ pageParam, params, signal }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    ...options,
  });
};

export const useGetUserPrefetchPaginateInfiniteQueryAuthService = <
  TData = CreateAccountResponse,
  TPageParam = PageParam,
>({
  options,
  initialPageParam,
  getNextPageParam,
  ...params
}: InfiniteHookParams<TData, TPageParam>) => {
  return useInfiniteQueryWithOptions<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      getUserPrefetchPaginateQueryFnAuthService({ pageParam, params, signal }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    options,
  });
};

export const invalidateGetUserPrefetchPaginateInfiniteQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
