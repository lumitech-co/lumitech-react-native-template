import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from 'translations/en.json';

const resources = {
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const changeLanguage = (newLanguage: string) => {
  i18n.changeLanguage(newLanguage);
};

export const i18nLocale = i18n;

export const LocalizationService = {
  changeLanguage,
  i18n,
};
