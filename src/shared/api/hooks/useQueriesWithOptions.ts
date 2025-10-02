/* eslint-disable no-redeclare */
/* eslint-disable func-style */

import {
  useQueries,
  QueriesOptions,
  QueriesResults,
} from '@tanstack/react-query';

interface UseQueriesWithOptionsParams<T extends Array<any>> {
  queries: readonly [...QueriesOptions<T>];
  options?: {
    combine?: (result: QueriesResults<T>) => any;
    subscribed?: boolean;
  };
}

export function useQueriesWithOptions<
  T extends Array<any>,
  TCombinedResult = QueriesResults<T>,
>(
  params: UseQueriesWithOptionsParams<T> & {
    options: {
      combine: (result: QueriesResults<T>) => TCombinedResult;
      subscribed?: boolean;
    };
  },
): TCombinedResult;

export function useQueriesWithOptions<T extends Array<any>>(
  params: UseQueriesWithOptionsParams<T>,
): QueriesResults<T>;

export function useQueriesWithOptions<T extends Array<any>>(
  params: UseQueriesWithOptionsParams<T>,
): QueriesResults<T> | any {
  const { queries, options } = params;

  return useQueries<T>({
    queries,
    ...options,
  });
}
