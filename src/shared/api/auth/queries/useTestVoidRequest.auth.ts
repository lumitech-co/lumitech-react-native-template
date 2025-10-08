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

interface HookParams<TData> {
  options?: UseQueryWithOptionsParams<
    void,
    QueryError,
    TData,
    QueryKeyType
  >['options'];
}

interface ObservableHookParams<TData, TSelected = TData> {
  options?: Omit<
    QueryObserverOptions<void, QueryError, TData, TSelected, QueryKeyType>,
    'queryFn' | 'queryKey'
  >;
  observableOptions?: Omit<
    SyncedOptions<QueryObserverResult<TData, QueryError>>,
    'get' | 'set' | 'retry'
  >;
}

interface QueryFnParams {
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

const testVoidRequestQueryFnAuthService = async ({ signal }: QueryFnParams) => {
  await AuthService.testVoidRequest(undefined, { signal });
};

const getQueryKey = () => queryKeys.testVoidRequestAuthService();

export const testVoidRequestQueryAuthService = <
  TData = void,
  TError = QueryError,
>({
  fetchOptions,
}: QueryFetchParams<void, TError, TData, void>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<void, TError, TData, QueryKeyType>({
    queryKey: getQueryKey(),
    queryFn: ({ signal }) => testVoidRequestQueryFnAuthService({ signal }),
    ...fetchOptions,
  });
};

export const useTestVoidRequestQueryAuthService = <TData = void>({
  options,
}: HookParams<TData>) => {
  return useQueryWithOptions<void, QueryError, TData, QueryKeyType>({
    queryFn: ({ signal }) => testVoidRequestQueryFnAuthService({ signal }),
    queryKey: getQueryKey(),
    options,
  });
};

export const useTestVoidRequestAuthServiceObservable = <
  TData = void,
  TSelected = TData,
>({
  options,
  observableOptions,
}: ObservableHookParams<TData, TSelected>) => {
  const queryClient = getQueryClient();

  const queryKey$ = useComputed(() => getQueryKey());

  return useObservable(
    syncedQuery<void, QueryError, TData, TSelected, QueryKeyType>({
      queryClient,
      queryFn: ({ signal }) => testVoidRequestQueryFnAuthService({ signal }),
      queryKey: queryKey$.get(),
      options,
      observableOptions,
    }),
  );
};

export const invalidateTestVoidRequestQueryAuthService = (
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(),
    ...options,
  });
};
