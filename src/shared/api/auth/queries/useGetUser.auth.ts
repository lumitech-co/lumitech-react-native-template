import { InvalidateQueryFilters } from '@tanstack/react-query';
import { getQueryClient } from '../../queryClient';
import {
  QueryError,
  QueryKeyType,
  UseQueryWithOptionsParams,
  QueryFetchParams,
  queryKeys,
} from '../../models';
import { useQueryWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

interface HookParams<TData> extends Test {
  options?: UseQueryWithOptionsParams<
    CreateAccountResponse[],
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

export const getUserQueryFnAuthService = async ({ params }: QueryFnParams) => {
  const response = await AuthService.getUser(params);

  return response?.data;
};

const getQueryKey = (params: Test) => queryKeys.getUserAuthService(params);

export const getUserQueryAuthService = <
  TData = CreateAccountResponse[],
  TError = QueryError,
>({
  params,
  fetchOptions,
}: QueryFetchParams<CreateAccountResponse[], TError, TData, Test>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<
    CreateAccountResponse[],
    TError,
    TData,
    QueryKeyType
  >({
    queryKey: getQueryKey(params),
    queryFn: () => getUserQueryFnAuthService({ params }),
    ...fetchOptions,
  });
};

export const useGetUserQueryAuthService = <TData = CreateAccountResponse[]>({
  options,
  ...params
}: HookParams<TData>) => {
  return useQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: () => getUserQueryFnAuthService({ params }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const invalidateGetUserQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
