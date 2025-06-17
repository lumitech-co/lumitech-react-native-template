import { syncObservable } from '@legendapp/state/sync';
import { observable, syncState } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { LanguageStore } from './types';
import { PersistStorageKeys } from '../models';

const initialState: LanguageStore = {
  currentLanguage: 'en',
};

export const languageStore$ = observable<LanguageStore>(initialState);

syncObservable(languageStore$, {
  persist: {
    name: PersistStorageKeys.LANGUAGE,
    plugin: ObservablePersistMMKV,
  },
});

const languageStoreSyncState$ = syncState(languageStore$);

export const resetLanguageStorePersist = async () => {
  await languageStoreSyncState$.resetPersistence();

  languageStore$.set({
    currentLanguage: 'en',
  });
};
