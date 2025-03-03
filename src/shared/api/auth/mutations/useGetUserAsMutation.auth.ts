import { useMutation } from '@tanstack/react-query';
import { QueryError } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const getUserAsMutationMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.getUserAsMutation(params);

  return response?.data;
};

export const useGetUserAsMutationMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: getUserAsMutationMutationFnAuthService,
  });
};
