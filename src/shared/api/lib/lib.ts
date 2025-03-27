import {
  InvalidateQueryFilters,
  RefetchQueryFilters,
} from '@tanstack/react-query';
import { queryKeys } from 'api/models';
import { getQueryClient } from 'api/queryClient';
// eslint-disable-next-line boundaries/element-types
import { AnyType } from 'lib';

export const refetchQueries = <
  T extends keyof typeof queryKeys,
  TQueryFnData = unknown,
>(
  key: T,
  params?: Parameters<(typeof queryKeys)[T]> extends [infer P] ? P : never,
  options?: Omit<RefetchQueryFilters<TQueryFnData>, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  queryClient.refetchQueries({
    queryKey: params ? (queryKeys[key] as AnyType)(params) : queryKeys[key],
    ...options,
  });
};

export const invalidateQueries = async <
  T extends keyof typeof queryKeys,
  TQueryFnData = unknown,
>(
  key: T,
  params?: Parameters<(typeof queryKeys)[T]> extends [infer P] ? P : never,
  options?: Omit<InvalidateQueryFilters<TQueryFnData>, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  await queryClient.invalidateQueries({
    queryKey: (queryKeys[key] as AnyType)(params || {}),
    ...options,
  });
};

export const removeQueries = <
  T extends keyof typeof queryKeys,
  TQueryFnData = unknown,
>(
  key: T,
  params?: Parameters<(typeof queryKeys)[T]> extends [infer P] ? P : never,
  options?: Omit<InvalidateQueryFilters<TQueryFnData>, 'queryKey'>,
) => {
  const queryClient = getQueryClient();

  queryClient.removeQueries({
    queryKey: (queryKeys[key] as AnyType)(params || {}),
    ...options,
  });
};
