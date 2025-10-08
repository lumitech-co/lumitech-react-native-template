import {
  InvalidateQueryFilters,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { useComputed, useObservable } from '@legendapp/state/react';
import { SyncedOptions } from '@legendapp/state/sync';
import { getQueryClient } from '../../queryClient';
import {
  QueryError,
  QueryKeyType,
  UseQueryWithOptionsParams,
  QueryFetchParams,
  queryKeys,
} from '../../models';
import { useQueryWithOptions, syncedQuery } from '../../hooks';
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

interface ObservableHookParams<TData, TSelected = TData> {
  params$: Test;
  options?: Omit<
    QueryObserverOptions<
      CreateAccountResponse[],
      QueryError,
      TData,
      TSelected,
      QueryKeyType
    >,
    'queryFn' | 'queryKey'
  >;
  observableOptions?: Omit<
    SyncedOptions<QueryObserverResult<TData, QueryError>>,
    'get' | 'set' | 'retry'
  >;
}

interface QueryFnParams {
  params: Test;
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

const testQueryWithCustomClientQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testQueryWithCustomClient(params, {
    signal,
  });

  return response;
};

const getQueryKey = (params: Test) =>
  queryKeys.testQueryWithCustomClientAuthService(params);

export const testQueryWithCustomClientQueryAuthService = <
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
    queryFn: ({ signal }) =>
      testQueryWithCustomClientQueryFnAuthService({ params, signal }),
    ...fetchOptions,
  });
};

export const useTestQueryWithCustomClientQueryAuthService = <
  TData = CreateAccountResponse[],
>({
  options,
  ...params
}: HookParams<TData>) => {
  return useQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: ({ signal }) =>
      testQueryWithCustomClientQueryFnAuthService({ params, signal }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const useTestQueryWithCustomClientAuthServiceObservable = <
  TData = CreateAccountResponse[],
  TSelected = TData,
>({
  params$,
  options,
  observableOptions,
}: ObservableHookParams<TData, TSelected>) => {
  const queryClient = getQueryClient();

  const queryKey$ = useComputed(() => getQueryKey(params$));

  return useObservable(
    syncedQuery<
      CreateAccountResponse[],
      QueryError,
      TData,
      TSelected,
      QueryKeyType
    >({
      queryClient,
      queryFn: ({ signal }) =>
        testQueryWithCustomClientQueryFnAuthService({
          params: params$,
          signal,
        }),
      queryKey: queryKey$.get(),
      options,
      observableOptions,
    }),
  );
};

export const invalidateTestQueryWithCustomClientQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
