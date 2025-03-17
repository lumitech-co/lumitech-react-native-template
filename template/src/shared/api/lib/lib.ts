import { queryKeys, queryClient, QueryKeyType } from 'api';

export const refetchQueryWithParam = (queryKeyWithParam: QueryKeyType) => {
  queryClient.refetchQueries({ queryKey: queryKeyWithParam });
};

export const invalidateQueries = (...keys: (keyof typeof queryKeys)[]) => {
  keys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: queryKeys[key] });
  });
};
