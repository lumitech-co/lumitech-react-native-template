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
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >['getNextPageParam'];
  options?: UseInfiniteQueryWithOptionsParams<
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

export const getUsersPaginatedQueryFnAuthService = async <
  TPageParam extends PageParam,
>({
  params,
  pageParam,
  signal,
}: QueryFnParams<TPageParam>) => {
  const response = await AuthService.getUsersPaginated(
    { ...params, pageParam },
    { signal },
  );

  return response;
};

const getQueryKey = (params: Test) =>
  queryKeys.getUsersPaginatedAuthService(params);

export const getUsersPaginatedInfiniteQueryAuthService = <
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
      getUsersPaginatedQueryFnAuthService({ pageParam, params, signal }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    ...options,
  });
};

export const useGetUsersPaginatedInfiniteQueryAuthService = <
  TData = CreateAccountResponse[],
  TPageParam = PageParam,
>({
  options,
  initialPageParam,
  getNextPageParam,
  ...params
}: InfiniteHookParams<TData, TPageParam>) => {
  return useInfiniteQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType,
    TPageParam
  >({
    queryFn: ({ pageParam, signal }) =>
      getUsersPaginatedQueryFnAuthService({ pageParam, params, signal }),
    queryKey: getQueryKey(params),
    initialPageParam,
    getNextPageParam,
    options,
  });
};

export const invalidateGetUsersPaginatedInfiniteQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};

export const resetGetUsersPaginatedInfiniteQueryAuthService = async <
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
