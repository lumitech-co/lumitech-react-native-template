export const PersistStorageKeys = {
  USER: 'USER_STORAGE',
} as const;

export type PersistStorageKey =
  (typeof PersistStorageKeys)[keyof typeof PersistStorageKeys];
