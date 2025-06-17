import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from 'translations/en.json';

export type Language = 'en';

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

const changeLanguage = async (newLanguage: Language) => {
  await i18n.changeLanguage(newLanguage);
};

const getCurrentLanguage = (): Language => {
  return i18n.language as Language;
};

const getAvailableLanguages = (): Language[] => {
  return ['en'];
};

export const i18nLocale = i18n;

export const LocalizationService = {
  changeLanguage,
  getCurrentLanguage,
  getAvailableLanguages,
  i18n,
};
