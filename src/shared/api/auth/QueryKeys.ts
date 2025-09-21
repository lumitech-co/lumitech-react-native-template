import { Test } from './models';

const QUERY_KEYS = {
  GET_USER_AUTH_SERVICE: 'GET_USER_AUTH_SERVICE',
  GET_USERS_PAGINATED_AUTH_SERVICE: 'GET_USERS_PAGINATED_AUTH_SERVICE',
  CREATE_USER_AUTH_SERVICE: 'CREATE_USER_AUTH_SERVICE',
} as const;

export const AUTH_QUERY_KEYS = {
  getUserAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USER_AUTH_SERVICE, params] as const,
  getUsersPaginatedAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USERS_PAGINATED_AUTH_SERVICE, params] as const,
  createUserAuthService: () => [QUERY_KEYS.CREATE_USER_AUTH_SERVICE] as const,
};
