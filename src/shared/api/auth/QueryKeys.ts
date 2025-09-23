import { Test } from './models';

const QUERY_KEYS = {
  TEST_QUERY_AUTH_SERVICE: 'TEST_QUERY_AUTH_SERVICE',
  TEST_INFINITE_QUERY_AUTH_SERVICE: 'TEST_INFINITE_QUERY_AUTH_SERVICE',
  TEST_SUSPENSE_QUERY_AUTH_SERVICE: 'TEST_SUSPENSE_QUERY_AUTH_SERVICE',
  TEST_SUSPENSE_INFINITE_QUERY_AUTH_SERVICE:
    'TEST_SUSPENSE_INFINITE_QUERY_AUTH_SERVICE',
  TEST_QUERIES_AUTH_SERVICE: 'TEST_QUERIES_AUTH_SERVICE',
  TEST_PREFETCH_AUTH_SERVICE: 'TEST_PREFETCH_AUTH_SERVICE',
  TEST_PREFETCH_INFINITE_QUERY_AUTH_SERVICE:
    'TEST_PREFETCH_INFINITE_QUERY_AUTH_SERVICE',
  TEST_MUTATION_AUTH_SERVICE: 'TEST_MUTATION_AUTH_SERVICE',
} as const;

export const AUTH_QUERY_KEYS = {
  testQueryAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_QUERY_AUTH_SERVICE, params] as const,
  testInfiniteQueryAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_INFINITE_QUERY_AUTH_SERVICE, params] as const,
  testSuspenseQueryAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_SUSPENSE_QUERY_AUTH_SERVICE, params] as const,
  testSuspenseInfiniteQueryAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_SUSPENSE_INFINITE_QUERY_AUTH_SERVICE, params] as const,
  testQueriesAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_QUERIES_AUTH_SERVICE, params] as const,
  testPrefetchAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_PREFETCH_AUTH_SERVICE, params] as const,
  testPrefetchInfiniteQueryAuthService: (params: Test) =>
    [QUERY_KEYS.TEST_PREFETCH_INFINITE_QUERY_AUTH_SERVICE, params] as const,
  testMutationAuthService: () =>
    [QUERY_KEYS.TEST_MUTATION_AUTH_SERVICE] as const,
};
