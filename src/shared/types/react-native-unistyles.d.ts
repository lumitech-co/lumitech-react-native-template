import { LightTheme, DarkTheme, breakpoints } from 'themes';

interface AppThemes {
  light: typeof LightTheme;
  dark: typeof DarkTheme;
}

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}
