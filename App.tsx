import React from 'react';
import { StyleSheet as RnStylesheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { ModalProvider } from 'react-native-modalfy';
import { queryClient } from 'api';
import { breakpoints, DarkTheme, LightTheme } from 'themes';
import { RootNavigator } from 'navigation';
import { EventEmitterProvider, LanguageProvider } from 'providers';
import { themeStore$ } from 'stores';
import { useDebug } from 'hooks';
import { modalStack } from './src/modules';

StyleSheet.configure({
  themes: {
    light: LightTheme,
    dark: DarkTheme,
  },
  breakpoints,
  settings: {
    initialTheme: () => {
      return themeStore$.currentTheme.get();
    },
  },
});

export const App: React.FC = () => {
  useDebug();

  return (
    <LanguageProvider>
      <ReducedMotionConfig mode={ReduceMotion.Never} />
      <KeyboardProvider>
        <GestureHandlerRootView style={styles.layout}>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <ModalProvider stack={modalStack}>
                <EventEmitterProvider>
                  <RootNavigator />
                </EventEmitterProvider>
              </ModalProvider>
            </QueryClientProvider>
            <Toaster position="top-center" />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </LanguageProvider>
  );
};

const styles = RnStylesheet.create({
  layout: {
    flex: 1,
  },
});
