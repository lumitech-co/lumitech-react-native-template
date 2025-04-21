import { Colors } from './Colors';
import { FontFamily } from './Fonts';

const DEFAULT_GAP = 8;
const DEFAULT_INSET = 16;

export const DefaultTheme = {
  colors: Colors,
  fonts: FontFamily,
  gap: (value: number) => value * DEFAULT_GAP,
  inset: (insetValue: number) => Math.max(insetValue, DEFAULT_INSET),
} as const;
