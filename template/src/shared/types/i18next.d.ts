/* eslint-disable @typescript-eslint/no-unused-vars */
import en from 'translations/en.json';

const resources = {
  en,
} as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
