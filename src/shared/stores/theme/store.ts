import { syncObservable } from '@legendapp/state/sync';
import { observable, syncState } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { ThemeStore } from './types';
import { PersistStorageKeys } from '../models';

const initialState: ThemeStore = {
  currentTheme: 'light',
};

export const themeStore$ = observable<ThemeStore>(initialState);

syncObservable(themeStore$, {
  persist: {
    name: PersistStorageKeys.THEME,
    plugin: ObservablePersistMMKV,
  },
});

const themeStoreSyncState$ = syncState(themeStore$);

export const resetThemeStorePersist = async () => {
  await themeStoreSyncState$.resetPersistence();

  themeStore$.set({
    currentTheme: 'light',
  });
};
