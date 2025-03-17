export const PersistStorageKeys = {
  AUTH: 'AUTH_STORAGE',
  USER: 'USER_STORAGE',
} as const;

export type PersistStorageKey =
  (typeof PersistStorageKeys)[keyof typeof PersistStorageKeys];
