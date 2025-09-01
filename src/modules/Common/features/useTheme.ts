import { useCurrentTheme } from 'stores';

export const useTheme = () => {
  const theme = useCurrentTheme();

  return theme;
};
