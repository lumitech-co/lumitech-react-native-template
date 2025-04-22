import axios, { AxiosError, AxiosInstance } from 'axios';
import { HTTPClient, Params } from './types';

export const createAxiosClient = ({
  baseURL,
  getToken,
  onUnauthorized,
  onError,
}: {
  baseURL: string;
  getToken?: () => string | null;
  onUnauthorized?: (error: AxiosError) => void;
  onError?: (error: AxiosError) => void;
}): HTTPClient => {
  const instance: AxiosInstance = axios.create({ baseURL });

  instance.interceptors.request.use(config => {
    const token = getToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const globalToast =
        error.config?.headers?.['x-disable-global-toast'] === 'true';

      const isBaseError = error.response?.status !== 401 && globalToast;

      if (error.response?.status === 401) {
        onUnauthorized?.(error);
      }

      if (isBaseError) {
        onError?.(error);
      }

      return Promise.reject(error);
    },
  );

  return {
    async request<TResponse, TBody>({
      method,
      url,
      data,
      headers,
      params,
      signal,
    }: {
      method: 'get' | 'post' | 'put' | 'patch' | 'delete';
      url: string;
      data?: TBody;
      headers?: Record<string, string>;
      params?: Params;
      signal?: AbortSignal;
    }): Promise<{ data: TResponse }> {
      const response = await instance.request<TResponse>({
        method,
        url,
        data,
        headers,
        params,
        signal,
      });

      return { data: response.data };
    },
  };
};
