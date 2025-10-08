/* eslint-disable no-console */
import Config from 'react-native-config';
import { z } from 'zod';
import { isDev } from './General';

export const envSchema = z.object({
  API_URL: z.string(),
  LICENSE_KEY: z.string().optional(),
});

export const parseEnv = () => {
  if (!isDev) {
    return;
  }

  try {
    envSchema.parse(Config);
  } catch (error) {
    console.warn(error);
  }
};
