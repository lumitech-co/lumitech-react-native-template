import {
  QueryKeyType,
  UseQueriesWithOptionsParams,
  queryKeys,
} from '../../models';
import { useQueriesWithOptions } from '../../hooks';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

interface QueryFnParams {
  params: Test;
  meta?: Record<string, unknown> | undefined;
  queryKey?: QueryKeyType;
  signal?: AbortSignal;
}

export const testQueriesQueryFnAuthService = async ({
  params,
  signal,
}: QueryFnParams) => {
  const response = await AuthService.testQueries(params, { signal });

  return response;
};

const getQueryKey = (params: Test) => queryKeys.testQueriesAuthService(params);

interface HookParams {
  params: Test[];
  options?: UseQueriesWithOptionsParams<
    Array<{
      queryKey: QueryKeyType;
      queryFn: () => Promise<CreateAccountResponse[]>;
    }>
  >['options'];
}

export const useTestQueriesQueriesAuthService = ({
  params,
  options,
}: HookParams) => {
  const queries = params.map(param => ({
    queryKey: getQueryKey(param),
    queryFn: ({ signal }: { signal?: AbortSignal }) =>
      testQueriesQueryFnAuthService({ params: param, signal }),
  }));

  return useQueriesWithOptions({
    queries,
    options,
  });
};
