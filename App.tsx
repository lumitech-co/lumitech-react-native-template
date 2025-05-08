import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { UnistylesRegistry, UnistylesProvider } from 'react-native-unistyles';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import { ModalProvider } from 'react-native-modalfy';
import { queryClient } from 'api';
import { DefaultTheme, breakpoints } from 'themes';
import { modalStack } from 'widgets';
import { RootNavigator } from 'navigation';
import { EventEmitterProvider } from 'providers';
import { isDev } from 'lib';
import { LocalizationService } from 'services';

if (isDev) {
  require('./ReactotronConfig');
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
  defaultTheme: DefaultTheme,
});

export const App: React.FC = () => (
  <I18nextProvider i18n={LocalizationService.i18n}>
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
  </I18nextProvider>
);

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
