import { MMKV } from 'react-native-mmkv';
import { immer } from 'zustand/middleware/immer';
import { UserStore, State, User } from './types';
import { PersistStorageKeys } from '../models';
import { createStore } from '../lib';

const persistStorage = new MMKV({
  id: PersistStorageKeys.USER,
});

const initialState: State = {
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  userId: 0,
};

export const useUserStore = createStore<UserStore>(
  immer(set => ({
    ...initialState,
    setUser: (user: User) =>
      set(state => {
        state.email = user.email;
        state.firstName = user.firstName;
        state.lastName = user.lastName;
        state.phoneNumber = user.phoneNumber;
        state.userId = user.userId;
      }),
  })),
  'USER_STORAGE',
  persistStorage,
);
