import { LightColors, DarkColors } from './Colors';
import { FontFamily } from './Fonts';

const DEFAULT_GAP = 8;
const DEFAULT_INSET = 16;

export const LightTheme = {
  colors: LightColors,
  fonts: FontFamily,
  borderRadius: {
    base: 0,
  },
  gap: (value: number) => value * DEFAULT_GAP,
  inset: (insetValue: number) => {
    return Math.max(insetValue, DEFAULT_INSET);
  },
  shadow: {
    base: {
      shadowColor: LightColors.black,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      elevation: 2,
    },
  },
} as const;

export const DarkTheme = {
  colors: DarkColors,
  fonts: FontFamily,
  borderRadius: {
    base: 0,
  },
  gap: (value: number) => value * DEFAULT_GAP,
  inset: (insetValue: number) => {
    return Math.max(insetValue, DEFAULT_INSET);
  },
  shadow: {
    base: {
      shadowColor: DarkColors.black,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      elevation: 2,
    },
  },
} as const;
