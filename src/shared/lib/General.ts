/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable */
import i18next from 'i18next';
import { Linking } from 'react-native';
import { ToastService } from 'services';

export type AnyType = any;

export const isDev = __DEV__;

export const noop = () => {};

export const withDelay = (ms: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};

export const openLink = async (link: string) => {
  try {
    await Linking.openURL(link);
  } catch {
    ToastService.onDanger({ title: i18next.t('errors.server-unable') });
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  ms: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, ms);
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
};
