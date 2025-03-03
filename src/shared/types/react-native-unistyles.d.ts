import { DefaultTheme, breakpoints } from 'themes';

interface AppThemes {
  defaultTheme: typeof DefaultTheme;
}

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}
