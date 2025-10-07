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

import { SpecialResponse } from '../models';

interface HookParams<TData> {
  options?: UseQueryWithOptionsParams<
    SpecialResponse,
    QueryError,
    TData,
    QueryKeyType
  >['options'];
}

interface ObservableHookParams<TData, TSelected = TData> {
  options?: Omit<
    QueryObserverOptions<
      SpecialResponse,
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
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

export const testSpecialRequestQueryFnAuthService = async ({
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testSpecialRequest(undefined, { signal });

  return response;
};

const getQueryKey = () => queryKeys.testSpecialRequestAuthService();

export const testSpecialRequestQueryAuthService = <
  TData = SpecialResponse,
  TError = QueryError,
>({
  fetchOptions,
}: QueryFetchParams<SpecialResponse, TError, TData, void>) => {
  const queryClient = getQueryClient();

  return queryClient.fetchQuery<SpecialResponse, TError, TData, QueryKeyType>({
    queryKey: getQueryKey(),
    queryFn: ({ signal }) => testSpecialRequestQueryFnAuthService({ signal }),
    ...fetchOptions,
  });
};

export const useTestSpecialRequestQueryAuthService = <TData = SpecialResponse>({
  options,
}: HookParams<TData>) => {
  return useQueryWithOptions<SpecialResponse, QueryError, TData, QueryKeyType>({
    queryFn: ({ signal }) => testSpecialRequestQueryFnAuthService({ signal }),
    queryKey: getQueryKey(),
    options,
  });
};

export const invalidateTestSpecialRequestQueryAuthService = (
  options?: Omit<InvalidateQueryFilters, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  return queryClient.invalidateQueries({
    queryKey: getQueryKey(),
    ...options,
  });
};

export const useTestSpecialRequestAuthServiceObservable = <
  TData = SpecialResponse,
  TSelected = TData,
>({
  options,
  observableOptions,
}: ObservableHookParams<TData, TSelected>) => {
  const queryClient = getQueryClient();

  const queryKey$ = useComputed(() => getQueryKey());

  return useObservable(
    syncedQuery<SpecialResponse, QueryError, TData, TSelected, QueryKeyType>({
      queryClient,
      queryFn: ({ signal }) => testSpecialRequestQueryFnAuthService({ signal }),
      queryKey: queryKey$.get(),
      options,
      observableOptions,
    }),
  );
};
