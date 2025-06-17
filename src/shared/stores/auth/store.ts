import { syncObservable } from '@legendapp/state/sync';
import { observable, syncState } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { AuthStore } from './types';
import { PersistStorageKeys } from '../models';

const initialState: AuthStore = {
  refreshToken: '',
  token: '',
};

export const authStore$ = observable<AuthStore>(initialState);

syncObservable(authStore$, {
  persist: {
    name: PersistStorageKeys.AUTH,
    plugin: ObservablePersistMMKV,
  },
});

const authStoreSyncState$ = syncState(authStore$);

export const resetAuthStorePersist = async () => {
  await authStoreSyncState$.resetPersistence();

  authStore$.set({
    refreshToken: '',
    token: '',
  });
};
