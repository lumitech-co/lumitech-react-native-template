import { Test } from './models';

const QUERY_KEYS = {
  GET_USER_AUTH_SERVICE: 'GET_USER_AUTH_SERVICE',
  GET_USER_PREFETCH_AUTH_SERVICE: 'GET_USER_PREFETCH_AUTH_SERVICE',
  GET_USER_PAGINATE_AUTH_SERVICE: 'GET_USER_PAGINATE_AUTH_SERVICE',
  GET_USER_PREFETCH_PAGINATE_AUTH_SERVICE:
    'GET_USER_PREFETCH_PAGINATE_AUTH_SERVICE',
  GET_USER_AS_MUTATION_AUTH_SERVICE: 'GET_USER_AS_MUTATION_AUTH_SERVICE',
  DELETE_USER_AUTH_SERVICE: 'DELETE_USER_AUTH_SERVICE',
} as const;

export const AUTH_QUERY_KEYS = {
  getUserAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USER_AUTH_SERVICE, params] as const,
  getUserPrefetchAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USER_PREFETCH_AUTH_SERVICE, params] as const,
  getUserPaginateAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USER_PAGINATE_AUTH_SERVICE, params] as const,
  getUserPrefetchPaginateAuthService: (params: Test) =>
    [QUERY_KEYS.GET_USER_PREFETCH_PAGINATE_AUTH_SERVICE, params] as const,
  getUserAsMutationAuthService: () =>
    [QUERY_KEYS.GET_USER_AS_MUTATION_AUTH_SERVICE] as const,
  deleteUserAuthService: () => [QUERY_KEYS.DELETE_USER_AUTH_SERVICE] as const,
};
