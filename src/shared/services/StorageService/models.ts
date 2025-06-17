export const StorageKeys = {
  AUTH_REMEMBER_ME_FIELDS: 'AUTH_REMEMBER_ME_FIELDS',
} as const;

export type StorageKey = keyof typeof StorageKeys | (string & {});
