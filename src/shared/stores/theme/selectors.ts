import { use$ } from '@legendapp/state/react';
import { themeStore$ } from './store';

export const useThemeStore = () => {
  return themeStore$;
};

export const getThemeStoreInstance = () => {
  return themeStore$;
};

export const useCurrentTheme = () => {
  return use$(themeStore$.currentTheme);
};
