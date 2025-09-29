import React from 'react';
import { StyleSheet as RNStylesheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StyleSheet } from 'react-native-unistyles';
import {
  PortalProvider as TeleportProvider,
  PortalHost,
} from 'react-native-teleport';
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
                <TeleportProvider>
                  <EventEmitterProvider>
                    <View style={styles.overlay} pointerEvents="box-none">
                      <PortalHost name="overlay" />
                    </View>
                    <RootNavigator />
                  </EventEmitterProvider>
                </TeleportProvider>
              </ModalProvider>
            </QueryClientProvider>
            <Toaster position="top-center" visibleToasts={1} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </LanguageProvider>
  );
};

const styles = RNStylesheet.create({
  layout: {
    flex: 1,
  },
  overlay: {
    ...RNStylesheet.absoluteFillObject,
    zIndex: 9999,
  },
});
