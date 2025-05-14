import { isFunction } from '@legendapp/state';
import {
  Synced,
  SyncedOptions,
  SyncedSetParams,
  synced,
} from '@legendapp/state/sync';
import {
  MutationObserver,
  MutationObserverOptions,
  QueryClient,
} from '@tanstack/react-query';

export interface SyncedMutationParams<TData, TError, TVariables>
  extends Omit<SyncedOptions<TData>, 'get' | 'set' | 'retry'> {
  queryClient: QueryClient;
  mutationOptions: MutationObserverOptions<TData, TError, TVariables>;
}

export const syncedMutation = <TData, TError, TVariables>(
  params: SyncedMutationParams<TData, TError, TVariables>,
): Synced<TData> => {
  const {
    queryClient,
    mutationOptions,
    initial: initialParam,
    ...rest
  } = params;

  const initial = isFunction(initialParam) ? initialParam() : initialParam;

  const mutator = new MutationObserver(queryClient, mutationOptions);

  const set: SyncedOptions<TData>['set'] = (params: SyncedSetParams<TData>) => {
    const mutationCache = queryClient.getMutationCache();

    mutationCache
      .findAll({ mutationKey: mutationOptions.mutationKey })
      .forEach(mutation => {
        mutationCache.remove(mutation);
      });

    return mutator.mutate(params.value as TVariables) as Promise<TData>;
  };

  return synced({
    set,
    initial,
    ...rest,
  });
};
