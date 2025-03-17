import { AUTH_QUERY_KEYS } from '../auth/QueryKeys';

export const queryKeys = {
  ...AUTH_QUERY_KEYS,
};

export type QueryKeyType = ReturnType<
  (typeof queryKeys)[keyof typeof queryKeys]
>;
