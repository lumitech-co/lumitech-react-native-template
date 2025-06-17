import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { LocalizationService } from '../../services';
import { useLanguageStore } from '../../stores';

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const languageStore = useLanguageStore();

  useEffect(() => {
    const initializeLanguage = () => {
      const currentLanguage = languageStore.currentLanguage.get();

      LocalizationService.changeLanguage(currentLanguage);
    };

    initializeLanguage();
  }, []);

  return (
    <I18nextProvider i18n={LocalizationService.i18n}>
      {children}
    </I18nextProvider>
  );
};
