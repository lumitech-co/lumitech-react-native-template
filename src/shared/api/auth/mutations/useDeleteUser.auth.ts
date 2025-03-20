import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { Test, CreateAccountResponse } from '../models';

export const deleteUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.deleteUser(params);

  return response?.data;
};

const getMutationKey = () => queryKeys.deleteUserAuthService();

export const useDeleteUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: deleteUserMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
