import { InvalidateQueryFilters } from '@tanstack/react-query';
import { queryKeys } from 'api/models';
import { getQueryClient } from 'api/queryClient';

export const invalidateQueries = <
  T extends keyof typeof queryKeys,
  TQueryFnData = unknown,
>(
  key: T,
  params?: Parameters<(typeof queryKeys)[T]>[0],
  options?: Omit<InvalidateQueryFilters<TQueryFnData>, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  queryClient.invalidateQueries({
    queryKey: params ? queryKeys[key](params) : queryKeys[key],
    ...options,
  });
};
