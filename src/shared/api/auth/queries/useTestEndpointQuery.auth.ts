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

import { testEndpointQuery } from '../models';

interface HookParams<TData> extends testEndpointQuery {
  options?: UseQueryWithOptionsParams<
    testEndpointQuery,
    QueryError,
    TData,
    QueryKeyType
  >['options'];
}

interface ObservableHookParams<TData, TSelected = TData> {
  params$: testEndpointQuery;
  options?: Omit<
    QueryObserverOptions<
      testEndpointQuery,
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
  params: testEndpointQuery;
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

const testEndpointQueryQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testEndpointQuery(params, { signal });

  return response;
};

const getQueryKey = (params: testEndpointQuery) =>
  queryKeys.testEndpointQueryAuthService(params);

export const testEndpointQueryQueryAuthService = <
  TData = testEndpointQuery,
  TError = QueryError,
>({
  params,
  fetchOptions,
}: QueryFetchParams<testEndpointQuery, TError, TData, testEndpointQuery>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<testEndpointQuery, TError, TData, QueryKeyType>(
    {
      queryKey: getQueryKey(params),
      queryFn: ({ signal }) =>
        testEndpointQueryQueryFnAuthService({ params, signal }),
      ...fetchOptions,
    },
  );
};

export const useTestEndpointQueryQueryAuthService = <
  TData = testEndpointQuery,
>({
  options,
  ...params
}: HookParams<TData>) => {
  return useQueryWithOptions<
    testEndpointQuery,
    QueryError,
    TData,
    QueryKeyType
  >({
    queryFn: ({ signal }) =>
      testEndpointQueryQueryFnAuthService({ params, signal }),
    queryKey: getQueryKey(params),
    options,
  });
};

export const useTestEndpointQueryAuthServiceObservable = <
  TData = testEndpointQuery,
  TSelected = TData,
>({
  params$,
  options,
  observableOptions,
}: ObservableHookParams<TData, TSelected>) => {
  const queryClient = getQueryClient();

  const queryKey$ = useComputed(() => getQueryKey(params$));

  return useObservable(
    syncedQuery<testEndpointQuery, QueryError, TData, TSelected, QueryKeyType>({
      queryClient,
      queryFn: ({ signal }) =>
        testEndpointQueryQueryFnAuthService({ params: params$, signal }),
      queryKey: queryKey$.get(),
      options,
      observableOptions,
    }),
  );
};

export const invalidateTestEndpointQueryQueryAuthService = (
  params: testEndpointQuery,
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(params),
    ...options,
  });
};
