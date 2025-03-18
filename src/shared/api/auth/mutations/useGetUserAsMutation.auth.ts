import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const getUserAsMutationMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.getUserAsMutation(params);

  return response?.data;
};

const getMutationKey = () => queryKeys.GET_USER_AS_MUTATION_AUTH_SERVICE();

export const useGetUserAsMutationMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: getUserAsMutationMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
