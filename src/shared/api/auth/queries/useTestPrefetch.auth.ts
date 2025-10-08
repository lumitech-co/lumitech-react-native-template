import { InvalidateQueryFilters } from '@tanstack/react-query';
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

const testPrefetchQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testPrefetch(params, { signal });

  return response;
};

const getQueryKey = (params: Test) => queryKeys.testPrefetchAuthService(params);

export const testPrefetchPrefetchQueryAuthService = <
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
    queryFn: ({ signal }) => testPrefetchQueryFnAuthService({ params, signal }),
    ...fetchOptions,
  });
};

export const useTestPrefetchPrefetchQueryAuthService = <
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
    queryFn: ({ signal }) => testPrefetchQueryFnAuthService({ params, signal }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const invalidateTestPrefetchQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
