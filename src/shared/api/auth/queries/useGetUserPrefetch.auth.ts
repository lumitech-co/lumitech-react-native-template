import { getQueryClient } from '../../queryClient';
import {
  QueryError,
  QueryKeyType,
  UsePrefetchQueryWithOptionsParams,
  QueryFetchParams,
  queryKeys,
} from '../../models';
import { usePrefetchQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

interface HookParams<TData> extends Test {
  options?: UsePrefetchQueryWithOptionsParams<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType
  >['options'];
}

interface QueryFnParams {
  params: Test;
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

export const getUserPrefetchQueryFnAuthService = async ({
  params,
}: QueryFnParams) => {
  const response = await AuthService.getUserPrefetch(params);

  return response?.data;
};

const getQueryKey = (params: Test) =>
  queryKeys.getUserPrefetchAuthService(params);

export const getUserPrefetchPrefetchQueryAuthService = <
  TData = CreateAccountResponse,
  TError = QueryError,
>({
  params,
  fetchOptions,
}: QueryFetchParams<CreateAccountResponse, TError, TData, Test>) => {
  const queryClient = getQueryClient();

  return queryClient.prefetchQuery<
    CreateAccountResponse,
    TError,
    TData,
    QueryKeyType
  >({
    queryKey: getQueryKey(params),
    queryFn: () => getUserPrefetchQueryFnAuthService({ params }),
    ...fetchOptions,
  });
};

export const useGetUserPrefetchPrefetchQueryAuthService = <
  TData = CreateAccountResponse,
>({
  options,
  ...params
}: HookParams<TData>) => {
  return usePrefetchQueryWithOptions<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: () => getUserPrefetchQueryFnAuthService({ params }),
    queryKey: getQueryKey(params),
    options,
  });
};
