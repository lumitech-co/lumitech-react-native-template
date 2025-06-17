import { useInitialTheme } from 'react-native-unistyles';
import { useCurrentTheme } from 'stores';

export const useTheme = () => {
  const theme = useCurrentTheme();

  useInitialTheme(theme);
};
