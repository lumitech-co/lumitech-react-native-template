import { useMutation } from '@tanstack/react-query';
import { QueryError } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const deleteUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.deleteUser(params);

  return response?.data;
};

export const useDeleteUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: deleteUserMutationFnAuthService,
  });
};
