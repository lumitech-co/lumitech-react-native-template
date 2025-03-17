import { useLayoutEffect } from 'react';
import {
  UnistylesRuntime,
  UnistylesThemes,
  useStyles,
} from 'react-native-unistyles';

interface StatusBarParams {
  statusBarColor: keyof UnistylesThemes['defaultTheme']['colors'];
  navigationBarColor: keyof UnistylesThemes['defaultTheme']['colors'];
}

export const useStatusBar = ({
  navigationBarColor = 'basic_100',
  statusBarColor = 'basic_100',
}: Partial<StatusBarParams>) => {
  const { theme } = useStyles();

  useLayoutEffect(() => {
    UnistylesRuntime.statusBar.setColor(theme.colors[statusBarColor]);

    UnistylesRuntime.navigationBar.setColor(theme.colors[navigationBarColor]);

    return () => {
      UnistylesRuntime.statusBar.setColor(theme.colors.basic_100);

      UnistylesRuntime.navigationBar.setColor(theme.colors.basic_100);
    };
  }, []);
};
