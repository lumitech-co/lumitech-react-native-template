import { DefaultTheme, Theme } from '@react-navigation/native';
import { useMemo } from 'react';
import { useStyles } from 'react-native-unistyles';
import { useCurrentTheme, useToken } from 'stores';

export const useRootNavigator = () => {
  const token = useToken();

  const currentTheme = useCurrentTheme();

  const { theme } = useStyles();

  const navigationTheme = useMemo<Theme>(() => {
    return {
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
    };
  }, [currentTheme]);

  return {
    currentTheme,
    token,
    navigationTheme,
  };
};
