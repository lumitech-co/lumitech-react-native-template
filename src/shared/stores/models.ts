export const PersistStorageKeys = {
  USER: 'USER_STORAGE',
  AUTH: 'AUTH_STORAGE',
  LANGUAGE: 'LANGUAGE_STORAGE',
  THEME: 'THEME_STORAGE',
} as const;

export type PersistStorageKey =
  (typeof PersistStorageKeys)[keyof typeof PersistStorageKeys];
