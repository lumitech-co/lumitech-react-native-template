import i18n from 'i18next';
import { z } from 'zod';

export const ErrorSchema = z.object({
  message: z.string(),
  successful: z.boolean(),
  status: z.string(),
  data: z.null(),
});

const errorResolver = (error: unknown) => {
  const parsedError = ErrorSchema.safeParse(error);

  if (parsedError.success) {
    return parsedError.data.message;
  }

  return i18n.t('errors.server-unable');
};

export const ExceptionService = {
  errorResolver,
};
