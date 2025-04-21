import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { UnistylesRegistry, UnistylesProvider } from 'react-native-unistyles';
import { QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { ModalProvider } from 'react-native-modalfy';
import { queryClient } from 'api';
import { DefaultTheme, breakpoints } from 'themes';
import { modalStack } from 'widgets';
import { RootNavigator } from 'navigation';
import { EventEmitterProvider } from 'providers';
import { isDev } from 'lib';

if (isDev) {
  require('./ReactotronConfig');
}

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
  defaultTheme: DefaultTheme,
});

export const App: React.FC = () => (
  <UnistylesProvider>
    <ReducedMotionConfig mode={ReduceMotion.Never} />
    <KeyboardProvider>
      <GestureHandlerRootView style={styles.layout}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <ModalProvider stack={modalStack}>
              <BottomSheetModalProvider>
                <EventEmitterProvider>
                  <StatusBar animated translucent />
                  <RootNavigator />
                </EventEmitterProvider>
              </BottomSheetModalProvider>
            </ModalProvider>
          </QueryClientProvider>
          <Toaster position="top-center" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  </UnistylesProvider>
);

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
