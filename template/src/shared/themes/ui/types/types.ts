import { DefaultTheme } from 'themes';
import {
  ViewProps,
  ViewStyle,
  TextProps as BaseTextProps,
  TouchableOpacityProps as BaseTouchableOpacityProps,
  ColorValue,
  TextStyle,
} from 'react-native';

export type Theme = typeof DefaultTheme;

export type Colors = keyof (typeof DefaultTheme)['colors'];

export type ExtractColorProps<T> = {
  [K in keyof T as T[K] extends ColorValue | undefined
    ? K extends `${string}Color` | 'color'
      ? K
      : never
    : never]: T[K];
};

type PossibleColors = Colors;

type RemapToThemeColors<T> = {
  [K in keyof T]: PossibleColors | undefined;
};

interface ViewColorProperties
  extends RemapToThemeColors<ExtractColorProps<ViewStyle>> {}

interface TextColorProperties
  extends RemapToThemeColors<Omit<ExtractColorProps<TextStyle>, 'testID'>> {}

export type ViewStyleWithColors = Omit<ViewStyle, keyof ViewColorProperties> &
  ViewColorProperties;

export type TextStyleWithColors = Omit<
  TextStyle,
  Exclude<'testID', keyof TextColorProperties>
> &
  TextColorProperties;

export interface BoxProps extends ViewProps, ViewStyleWithColors {}

export interface TextProps
  extends BaseTextProps,
    Omit<TextStyleWithColors, 'fontFamily'> {
  fontFamily?: keyof Theme['fonts'];
}

export interface TouchableOpacityProps
  extends BaseTouchableOpacityProps,
    ViewStyleWithColors {}
