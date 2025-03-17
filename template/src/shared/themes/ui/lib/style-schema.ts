import { z } from 'zod';
import {
  flexStyleSchema,
  transformsStyleSchema,
  viewStyleSchema,
  textStyleSchema,
} from './stylesheet';

export const CommonStyleSchema = z.object({
  ...flexStyleSchema.shape,
  ...transformsStyleSchema.shape,
  ...viewStyleSchema.shape,
  ...textStyleSchema.shape,
});
