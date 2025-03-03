import { MMKV } from 'react-native-mmkv';
import { StorageKey } from './models';

export const storage = new MMKV();

export const StorageService = {
  setItem: (key: StorageKey, value: string | number | boolean | Uint8Array) => {
    storage.set(key, value);

    return Promise.resolve(true);
  },
  getItem: (key: StorageKey) => {
    const value = storage.getString(key);

    return Promise.resolve(value);
  },
  removeItem: (key: StorageKey) => {
    storage.delete(key);

    return Promise.resolve();
  },
  removeAllItems: () => {
    storage.clearAll();
  },
};
