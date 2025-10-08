import { InvalidateQueryFilters } from '@tanstack/react-query';
import { getQueryClient } from '../../queryClient';
import {
  QueryError,
  QueryKeyType,
  UseSuspenseQueryWithOptionsParams,
  QueryFetchParams,
  queryKeys,
} from '../../models';
import { useSuspenseQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

interface HookParams<TData> extends Test {
  options?: UseSuspenseQueryWithOptionsParams<
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

const testSuspenseQueryQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testSuspenseQuery(params, { signal });

  return response;
};

const getQueryKey = (params: Test) =>
  queryKeys.testSuspenseQueryAuthService(params);

export const testSuspenseQuerySuspenseQueryAuthService = <
  TData = CreateAccountResponse,
  TError = QueryError,
>({
  params,
  fetchOptions,
}: QueryFetchParams<CreateAccountResponse, TError, TData, Test>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<
    CreateAccountResponse,
    TError,
    TData,
    QueryKeyType
  >({
    queryKey: getQueryKey(params),
    queryFn: ({ signal }) =>
      testSuspenseQueryQueryFnAuthService({ params, signal }),
    ...fetchOptions,
  });
};

export const useTestSuspenseQuerySuspenseQueryAuthService = <
  TData = CreateAccountResponse,
>({
  options,
  ...params
}: HookParams<TData>) => {
  return useSuspenseQueryWithOptions<
    CreateAccountResponse,
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: ({ signal }) =>
      testSuspenseQueryQueryFnAuthService({ params, signal }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const invalidateTestSuspenseQuerySuspenseQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
