import { MMKV } from 'react-native-mmkv';
import { immer } from 'zustand/middleware/immer';
import { AuthStore, State } from './types';
import { PersistStorageKeys } from '../models';
import { createStore } from '../lib';

const persistStorage = new MMKV({
  id: PersistStorageKeys.AUTH,
});

const initialState: State = {
  token: '',
};

export const useAuthStore = createStore<AuthStore>(
  immer(set => ({
    ...initialState,
    setToken: (token: string) => {
      set(state => {
        state.token = token;
      });
    },
  })),
  'AUTH_STORAGE',
  persistStorage,
);
