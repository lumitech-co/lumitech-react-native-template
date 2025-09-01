import { isFunction, observe } from '@legendapp/state';
import {
  Synced,
  SyncedOptions,
  SyncedSubscribeParams,
  synced,
} from '@legendapp/state/sync';
import {
  DefaultError,
  DefaultedQueryObserverOptions,
  QueryClient,
  QueryFunction,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
  notifyManager,
} from '@tanstack/react-query';

export interface ObservableQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TSelected,
  TQueryKey extends QueryKey,
> extends Omit<
    QueryObserverOptions<TQueryFnData, TError, TData, TSelected, TQueryKey>,
    'queryKey'
  > {
  queryKey?: TQueryKey | (() => TQueryKey);
}

export interface SyncedQueryParams<
  TQueryFnData,
  TError,
  TData,
  TSelected,
  TQueryKey extends QueryKey,
> extends Omit<
    SyncedOptions<QueryObserverResult<TData, TError>>,
    'get' | 'set' | 'retry'
  > {
  queryClient: QueryClient;
  queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  queryKey: TQueryKey | (() => TQueryKey);
  options?: Omit<
    QueryObserverOptions<TQueryFnData, TError, TData, TSelected, TQueryKey>,
    'queryFn' | 'queryKey'
  >;
  observableOptions?: Omit<
    SyncedOptions<QueryObserverResult<TData, TError>>,
    'get' | 'set' | 'retry'
  >;
}

export const syncedQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TSelected = TData,
  TQueryKey extends QueryKey = QueryKey,
>(
  params: SyncedQueryParams<TQueryFnData, TError, TData, TSelected, TQueryKey>,
): Synced<QueryObserverResult<TData, TError>> => {
  const {
    queryFn,
    queryKey,
    options = {},
    queryClient,
    initial: initialParam,
    observableOptions,
  } = params;

  const queryOptions = {
    queryFn,
    queryKey,
    ...options,
  };

  if (initialParam !== undefined) {
    const initialValue = isFunction(initialParam)
      ? initialParam()
      : initialParam;

    queryOptions.initialData = initialValue as any;
  }

  const initial = queryOptions.initialData as
    | QueryObserverResult<TData, TError>
    | undefined;

  const defaultedOptions = queryClient.defaultQueryOptions(
    queryOptions as QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TSelected,
      TQueryKey
    >,
  );

  let observer:
    | QueryObserver<TQueryFnData, TError, TData, TSelected, TQueryKey>
    | undefined;

  let latestOptions = defaultedOptions;

  let queryKeyFromFn: TQueryKey;

  let resolveInitialPromise:
    | undefined
    | ((value: QueryObserverResult<TData, TError>) => void);

  const origQueryKey = queryKey;

  const isKeyFunction = isFunction(origQueryKey);

  const updateQueryOptions = (
    obj: DefaultedQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TSelected,
      TQueryKey
    >,
  ) => {
    const options = { ...obj };

    if (isKeyFunction) {
      options.queryKey = queryKeyFromFn;
    }

    latestOptions = options;

    if (observer) {
      observer.setOptions(options);
    }
  };

  if (isKeyFunction) {
    observe(() => {
      queryKeyFromFn = origQueryKey();
      updateQueryOptions(latestOptions);
    });
  }

  observer = new QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TSelected,
    TQueryKey
  >(queryClient, latestOptions);

  let isFirstRun = true;

  const get = (async () => {
    if (isFirstRun) {
      isFirstRun = false;

      if (!observer) {
        return undefined;
      }

      const result = observer.getOptimisticResult(latestOptions);

      if (result.isLoading) {
        await new Promise(resolve => {
          resolveInitialPromise = resolve;
        });
      }

      return result;
    }
    if (!observer) {
      return undefined;
    }

    const result = await observer.refetch();

    return result;
  }) as () => Promise<QueryObserverResult<TData, TError>>;

  const subscribe = ({
    update,
  }: SyncedSubscribeParams<QueryObserverResult<TData, TError>>) => {
    if (!observer) {
      return () => {};
    }

    const unsubscribe = observer.subscribe(
      notifyManager.batchCalls(result => {
        if (resolveInitialPromise) {
          resolveInitialPromise(result);
          resolveInitialPromise = undefined;
        }
        update({ value: result });
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
