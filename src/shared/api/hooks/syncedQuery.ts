import { isFunction } from '@legendapp/state';
import {
  Synced,
  SyncedOptions,
  SyncedSubscribeParams,
  synced,
} from '@legendapp/state/sync';
import {
  InitialDataFunction,
  QueryClient,
  QueryFunction,
  QueryObserver,
  QueryObserverOptions,
  notifyManager,
} from '@tanstack/react-query';
import { QueryKeyType } from 'api/models';

export interface SyncedQueryParams<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKeyType,
> extends Omit<SyncedOptions<TData>, 'get' | 'set' | 'retry'> {
  queryClient: QueryClient;
  queryKey: TQueryKey;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  options?: Omit<
    QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
  observableOptions?: Omit<SyncedOptions<TData>, 'get' | 'set' | 'retry'>;
}

export const isInitialDataFunction = <T>(
  obj: unknown,
): obj is InitialDataFunction<T> => {
  return typeof obj === 'function';
};

export const isTQueryKey = <T>(obj: unknown): obj is T => {
  return obj !== null && obj !== undefined;
};

export const syncedQuery = <
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKeyType = QueryKeyType,
>(
  params: SyncedQueryParams<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
): Synced<TData> => {
  const {
    queryClient,
    queryKey,
    queryFn,
    options,
    initial: initialParam,
    observableOptions,
  } = params;

  const initial = isFunction(initialParam) ? initialParam() : initialParam;

  if (initial !== undefined && initial !== null) {
    if (isInitialDataFunction<TQueryData>(initial)) {
      if (options) {
        options.initialData = initial;
      }
    }
  }

  const defaultedOptions = queryClient.defaultQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >({
    queryFn,
    queryKey,
    ...options,
  });

  const observer = new QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >(queryClient, defaultedOptions);

  let isFirstRun = true;

  let resolveInitialPromise: ((value: TData) => void) | null = null;

  const get = async (): Promise<TData> => {
    if (isFirstRun) {
      isFirstRun = false;
      const result = observer.getOptimisticResult(defaultedOptions);

      if (result.isLoading) {
        await new Promise(resolve => {
          resolveInitialPromise = resolve;
        });
      }

      return result.data ?? (initial as TData);
    }

    observer.refetch();

    return observer.getCurrentResult().data ?? (initial as TData);
  };

  const subscribe = ({ update }: SyncedSubscribeParams<TData>) => {
    const unsubscribe = observer.subscribe(
      notifyManager.batchCalls(result => {
        if (result.status === 'success') {
          if (resolveInitialPromise) {
            resolveInitialPromise(result.data);
            resolveInitialPromise = null;
          }

          update({ value: result.data });
        }
      }),
    );

    observer.updateResult();

    return unsubscribe;
  };

  return synced({
    get,
    subscribe,
    initial,
    ...observableOptions,
  });
};
