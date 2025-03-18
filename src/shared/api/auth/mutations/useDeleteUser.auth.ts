import { useMutation } from '@tanstack/react-query';
import { QueryError, queryKeys } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const deleteUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.deleteUser(params);

  return response?.data;
};

const getMutationKey = () => queryKeys.DELETE_USER_AUTH_SERVICE();

export const useDeleteUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: deleteUserMutationFnAuthService,
    mutationKey: getMutationKey(),
  });
};
