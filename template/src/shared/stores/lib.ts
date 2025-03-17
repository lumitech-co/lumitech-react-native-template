/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
import { StoreApi, UseBoundStore, create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';
import { PersistStorageKey } from './models';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;

  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
};

export const createMMKVStorage = (mmkvInstance: MMKV): StateStorage => ({
  setItem: (name, value) => {
    return mmkvInstance.set(name, value);
  },
  getItem: name => {
    const value = mmkvInstance.getString(name);

    return value ?? null;
  },
  removeItem: name => {
    return mmkvInstance.delete(name);
  },
});

export type Store<T extends unknown> = UseBoundStore<StoreApi<T>>;

export const storeResetFns = new Set<() => void>();

export const resetAllStores = () => {
  storeResetFns.forEach(resetFn => {
    resetFn();
  });
};

export const createStore = <T>(
  fn: (
    set: StoreApi<T>['setState'],
    get: StoreApi<T>['getState'],
    api: StoreApi<T>,
  ) => T,
  name: PersistStorageKey,
  storage: MMKV,
): Store<T> => {
  const store = create(
    persist<T>(
      (set, get, api) => {
        const state = fn(set, get, api);

        storeResetFns.add(() => set(() => state, true));

        return state;
      },
      {
        name,
        storage: createJSONStorage(() => createMMKVStorage(storage)),
      },
    ),
  );

  return store;
};
