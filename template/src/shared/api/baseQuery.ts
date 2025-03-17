import Config from 'react-native-config';
import { ExceptionService, ToastService } from 'services';
import { resetAllStores, useAuthStore } from 'stores';
import { createAxiosClient } from './http-client';

export const baseQuery = createAxiosClient({
  baseURL: Config.API_URL || '',
  getToken: () => {
    const { token } = useAuthStore.getState();

    return token;
  },
  onError: error => {
    ToastService.onDanger({
      title: ExceptionService.errorResolver(error),
    });
  },
  onUnauthorized: error => {
    ToastService.onDanger({
      title: ExceptionService.errorResolver(error),
    });

    resetAllStores();
  },
});
