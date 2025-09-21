import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { Test, CreateAccountResponse } from '../models';

export const createUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.createUser(params);

  return response;
};

const getMutationKey = () => queryKeys.createUserAuthService();

export const useCreateUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: createUserMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
