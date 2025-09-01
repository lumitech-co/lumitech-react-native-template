import { useObserve } from '@legendapp/state/react';
import { KeyboardService } from 'services';
import { LoginInSchema } from './config';
import { useAuthFormStore } from './auth-observable';
import { useSignIn } from './useSignIn';

export const useAuth = () => {
  const authFormStore$ = useAuthFormStore();

  const { onSignIn, isLoading$ } = useSignIn();

  useObserve(() => {
    if (!authFormStore$.didSubmit.get()) {
      return;
    }

    const result = LoginInSchema.safeParse(authFormStore$.formFields.get());

    if (result.success) {
      authFormStore$.errors.set({ email: '', password: '' });

      return;
    }

    const { fieldErrors } = result.error.flatten();

    authFormStore$.errors.set({
      email: fieldErrors.email?.[0] ?? '',
      password: fieldErrors.password?.[0] ?? '',
    });
  });

  const onSubmit = () => {
    KeyboardService.dismiss();

    authFormStore$.didSubmit.set(true);

    const formData = authFormStore$.formFields.get();

    const result = LoginInSchema.safeParse(formData);

    if (!result.success) {
      return;
    }

    const { email, password } = formData;

    onSignIn({ email, password });
  };

  return {
    onSubmit,
    isLoading$,
    authFormStore$,
  };
};
