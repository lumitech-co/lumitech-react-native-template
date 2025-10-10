import { DefaultTheme, Theme } from '@react-navigation/native';
import { useEventEmitter } from 'providers';
import { useEffect } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import { resetAllStores, useCurrentTheme, useToken } from 'stores';

export const useRootNavigator = () => {
  const token = useToken();

  const currentTheme = useCurrentTheme();

  const eventEmitter = useEventEmitter();

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

  useEffect(() => {
    const listener = eventEmitter.addListener('LOGOUT', () => {
      resetAllStores();
    });

    return () => {
      listener.removeListener('LOGOUT');
    };
  }, []);

  return {
    currentTheme,
    token,
    navigationTheme,
  };
};
