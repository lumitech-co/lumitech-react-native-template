import { useMutation } from '@tanstack/react-query';
import { QueryError } from '../../models';
import { AuthService } from '../AuthService';

import { Test } from '../models';

export const postUserMutationFnAuthService = async (params: Test) => {
  const response = await AuthService.postUser(params);

  return response?.data;
};

export const usePostUserMutationAuthService = () => {
  return useMutation<Test, QueryError, Test>({
    mutationFn: postUserMutationFnAuthService,
  });
};
