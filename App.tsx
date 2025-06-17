import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { UnistylesRegistry, UnistylesProvider } from 'react-native-unistyles';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { ModalProvider } from 'react-native-modalfy';
import { queryClient } from 'api';
import { breakpoints, DarkTheme, LightTheme } from 'themes';
import { RootNavigator } from 'navigation';
import { EventEmitterProvider, LanguageProvider } from 'providers';
import { isDev } from 'lib';
import { useTheme, modalStack } from './src/modules';

if (isDev) {
  require('./ReactotronConfig');
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
  light: LightTheme,
  dark: DarkTheme,
});

export const App: React.FC = () => {
  useTheme();

  return (
    <LanguageProvider>
      <UnistylesProvider>
        <ReducedMotionConfig mode={ReduceMotion.Never} />
        <KeyboardProvider>
          <GestureHandlerRootView style={styles.layout}>
            <SafeAreaProvider>
              <QueryClientProvider client={queryClient}>
                <ModalProvider stack={modalStack}>
                  <EventEmitterProvider>
                    <StatusBar animated translucent />
                    <RootNavigator />
                  </EventEmitterProvider>
                </ModalProvider>
              </QueryClientProvider>
              <Toaster position="top-center" />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
      </UnistylesProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
