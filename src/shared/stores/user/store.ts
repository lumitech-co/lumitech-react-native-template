import { syncObservable } from '@legendapp/state/sync';
import { observable, syncState } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { User, UserStore } from './types';
import { PersistStorageKeys } from '../models';

const initialUser: User = {
  id: '',
  lastName: '',
  firstName: '',
  email: '',
  displayName: '',
  username: '',
};

export const userStore$ = observable<UserStore>({
  user: initialUser,
});

syncObservable(userStore$, {
  persist: {
    name: PersistStorageKeys.USER,
    plugin: ObservablePersistMMKV,
  },
});

const userStoreSyncState$ = syncState(userStore$);

export const resetUserStorePersist = async () => {
  await userStoreSyncState$.resetPersistence();

  userStore$.set({
    user: {
      id: '',
      lastName: '',
      firstName: '',
      email: '',
      displayName: '',
      username: '',
    },
  });
};
