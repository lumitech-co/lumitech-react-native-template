import i18next from 'i18next';
import { z } from 'zod';

export const LoginInSchema = z.object({
  email: z
    .string({ required_error: i18next.t('validations.email-required') })
    .email({ message: i18next.t('validations.email-invalid') }),
  password: z.string().nonempty({
    message: i18next.t('validations.please-provide-password'),
  }),
  rememberMe: z.boolean(),
  isFaceIdEnabled: z.boolean(),
});

export type LoginValues = z.infer<typeof LoginInSchema>;
