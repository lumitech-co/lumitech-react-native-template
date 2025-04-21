import { use$ } from '@legendapp/state/react';
import { userStore$ } from './store';

export const useUserStore = () => {
  return userStore$;
};

export const getUserStoreInstance = () => {
  return userStore$;
};

export const useUserId = () => {
  return use$(userStore$.user.id);
};
