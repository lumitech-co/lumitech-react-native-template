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

export const testQueryQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testQuery(params, { signal });

  return response;
};

const getQueryKey = (params: Test) => queryKeys.testQueryAuthService(params);

export const testQueryQueryAuthService = <
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
    queryFn: ({ signal }) => testQueryQueryFnAuthService({ params, signal }),
    ...fetchOptions,
  });
};

export const useTestQueryQueryAuthService = <TData = CreateAccountResponse[]>({
  options,
  ...params
}: HookParams<TData>) => {
  return useQueryWithOptions<
    CreateAccountResponse[],
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: ({ signal }) => testQueryQueryFnAuthService({ params, signal }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const invalidateTestQueryQueryAuthService = (
  params: Test,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};

export const useTestQueryAuthServiceObservable = <
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
        testQueryQueryFnAuthService({ params: params$, signal }),
      queryKey: queryKey$.get(),
      options,
      observableOptions,
    }),
  );
};
