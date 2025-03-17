import { useMutation } from '@tanstack/react-query';
import { QueryError } from '../../models';
import { AuthService } from '../AuthService';

import { CreateAccountResponse, Test } from '../models';

export const putUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.putUser(params);

  return response?.data;
};

export const usePutUserMutationAuthService = () => {
  return useMutation<CreateAccountResponse, QueryError, Test>({
    mutationFn: putUserMutationFnAuthService,
  });
};
