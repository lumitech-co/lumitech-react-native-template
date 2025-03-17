// /* Use this d.ts file in development */
/* eslint-disable @typescript-eslint/no-unused-vars */

import en from 'translations/en.json';

const resources = {
  en,
} as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: typeof resources;
  }
}
