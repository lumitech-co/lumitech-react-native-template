import { use$ } from '@legendapp/state/react';
import { languageStore$ } from './store';

export const useLanguageStore = () => {
  return languageStore$;
};

export const getLanguageStoreInstance = () => {
  return languageStore$;
};

export const useCurrentLanguage = () => {
  return use$(languageStore$.currentLanguage);
};
