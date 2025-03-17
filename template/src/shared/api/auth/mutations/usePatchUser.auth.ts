import { useMutation } from '@tanstack/react-query';
import { QueryError } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const patchUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.patchUser(params);

  return response?.data;
};

export const usePatchUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: patchUserMutationFnAuthService,
  });
};
