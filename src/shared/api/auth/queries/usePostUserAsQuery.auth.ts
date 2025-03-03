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

import { Test } from '../models';

interface HookParams<TData> extends Test {
  options?: UseQueryWithOptionsParams<
    Test,
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

export const postUserAsQueryQueryFnAuthService = async ({
  params,
}: QueryFnParams) => {
  const response = await AuthService.postUserAsQuery(params);

  return response?.data;
};

const getQueryKey = (params: Test) =>
  queryKeys.POST_USER_AS_QUERY_AUTH_SERVICE(params);

export const postUserAsQueryQueryAuthService = <
  TData = Test,
  TError = QueryError,
>({
  params,
  fetchOptions,
}: QueryFetchParams<Test, TError, TData, Test>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<Test, TError, TData, QueryKeyType>({
    queryKey: getQueryKey(params),
    queryFn: () => postUserAsQueryQueryFnAuthService({ params }),
    ...fetchOptions,
  });
};

export const usePostUserAsQueryQueryAuthService = <TData = Test>({
  options,
  ...params
}: HookParams<TData>) => {
  return useQueryWithOptions<Test, QueryError, TData, QueryKeyType>({
    queryFn: () => postUserAsQueryQueryFnAuthService({ params }),
    queryKey: getQueryKey(params),
    options,
  });
};
