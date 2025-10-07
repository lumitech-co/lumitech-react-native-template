import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { testEndpointMutation } from '../models';

export const testEndpointMutationMutationFnAuthService = async (
  params: testEndpointMutation,
) => {
  const response = await AuthService.testEndpointMutation(params);

  return response;
};

const getMutationKey = () => queryKeys.testEndpointMutationAuthService();

export const useTestEndpointMutationMutationAuthService = () => {
  return useMutation<testEndpointMutation, QueryError, testEndpointMutation>({
    mutationFn: testEndpointMutationMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
