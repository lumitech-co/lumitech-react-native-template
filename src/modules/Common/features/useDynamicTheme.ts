import { UnistylesRuntime } from 'react-native-unistyles';
import { RouteService } from 'services';
import { useCurrentTheme, useThemeStore } from 'stores';

export const useDynamicTheme = () => {
  const theme = useCurrentTheme();

  const themeStore$ = useThemeStore();

  const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    UnistylesRuntime.setTheme(newTheme);

    themeStore$.currentTheme.set(newTheme);
  };

  const onBackPress = () => {
    RouteService.goBack();
  };

  return {
    switchTheme,
    onBackPress,
    theme,
  };
};
