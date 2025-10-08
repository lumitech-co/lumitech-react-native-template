import { useObservable } from '@legendapp/state/react';
import { withDelay } from 'lib';
import { useTestQueryQueryAuthService } from 'api';

interface Params {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const isLoading$ = useObservable(false);

  useTestQueryQueryAuthService({
    pageParam: 'test12',
    token: 'test12',
    test: 'test12',
    options: {
      select: data => data[0].email,
    },
  });

  const onSignIn = async (_: Params) => {
    isLoading$.set(true);

    await withDelay(5000).then(() => {
      isLoading$.set(false);
    });
  };

  return { onSignIn, isLoading$ };
};
