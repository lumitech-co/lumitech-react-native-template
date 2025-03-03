import { BoxProps, TextProps, Theme, TouchableOpacityProps } from '../types';
import { CommonStyleSchema } from './style-schema';

type CommonProps = BoxProps | TouchableOpacityProps | TextProps;

const transformStyle = (styles: CommonProps, theme: Theme) => {
  const finalStyles = new Map<string, string>();

  Object.entries(styles).forEach(([key, value]) => {
    if (key in CommonStyleSchema.shape && key !== 'testID') {
      if ((value && key.endsWith('Color')) || key === 'color') {
        const color = theme.colors[value as keyof Theme['colors']] ?? 'black';

        finalStyles.set(key, color ?? 'transparent');
      } else if (key === 'fontFamily' && typeof value === 'string') {
        finalStyles.set(key, theme.fonts[value as keyof Theme['fonts']]);
      } else {
        finalStyles.set(key, value as string);
      }
    }
  });

  return Object.fromEntries(finalStyles);
};

export const transformComponentStyle = (props: CommonProps, theme: Theme) => {
  return transformStyle(props, theme);
};

export const separateProps = <T extends object, U extends object>(
  props: T,
  commonSchema: Record<string, any>,
) => {
  const styleProps = new Map<keyof T, T[keyof T]>();
  const otherProps = new Map<keyof U, U[keyof U]>();

  const keys = Object.keys(props) as Array<keyof T>;

  keys.forEach(key => {
    if (key in commonSchema) {
      styleProps.set(key, props[key]);
    } else {
      otherProps.set(
        key as unknown as keyof U,
        props[key] as unknown as U[keyof U],
      );
    }
  });

  return {
    styleProps: Object.fromEntries(styleProps),
    otherProps: Object.fromEntries(otherProps),
  };
};
