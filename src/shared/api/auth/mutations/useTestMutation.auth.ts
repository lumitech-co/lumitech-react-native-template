import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { Test, CreateAccountResponse } from '../models';

export const testMutationMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.testMutation(params);

  return response;
};

const getMutationKey = () => queryKeys.testMutationAuthService();

export const useTestMutationMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: testMutationMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
