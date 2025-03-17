import { z } from 'zod';
import { envSchema } from 'lib';

declare module 'react-native-config' {
  interface NativeConfig extends z.infer<typeof envSchema> {}
}
