import { DefaultTheme, Theme } from '@react-navigation/native';
import { useUnistyles } from 'react-native-unistyles';
import { useCurrentTheme, useToken } from 'stores';

export const useRootNavigator = () => {
  const token = useToken();

  const currentTheme = useCurrentTheme();

  const { theme } = useUnistyles();

  const navigationTheme = {
    dark: currentTheme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.primary_background,
      border: 'transparent',
      primary: theme.colors.primary,
      card: theme.colors.primary_background,
      text: theme.colors.secondary,
      notification: theme.colors.primary,
    },
    fonts: {
      ...DefaultTheme.fonts,
      ...theme.fonts,
    },
  } satisfies Theme;

  return {
    currentTheme,
    token,
    navigationTheme,
  };
};
