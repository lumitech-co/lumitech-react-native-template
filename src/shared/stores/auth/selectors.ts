import { use$ } from '@legendapp/state/react';
import { authStore$ } from './store';

export const useAuthStore = () => {
  return authStore$;
};

export const getAuthStoreInstance = () => {
  return authStore$;
};

export const useToken = () => {
  return use$(authStore$.token);
};
