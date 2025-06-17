import { useObservable } from '@legendapp/state/react';

interface Params {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const isLoading$ = useObservable(false);

  const onSignIn = (_: Params) => {};

  return { onSignIn, isLoading$ };
};
