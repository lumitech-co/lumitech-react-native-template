import { useObservable } from '@legendapp/state/react';
import { withDelay } from 'lib';

interface Params {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const isLoading$ = useObservable(false);

  const onSignIn = async (_: Params) => {
    isLoading$.set(true);

    await withDelay(5000).then(() => {
      isLoading$.set(false);
    });
  };

  return { onSignIn, isLoading$ };
};
