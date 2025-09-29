import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RouteService } from 'services';
import RNBootSplash from 'react-native-bootsplash';
import { withUnistyles } from 'react-native-unistyles';
import { StatusBar } from 'react-native';
import { useRootNavigator } from 'modules';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Stack } from './lib';

const UniStatusBar = withUnistyles(StatusBar);

export const RootNavigator: React.FC = () => {
  const { navigationTheme, token } = useRootNavigator();

  return (
    <NavigationContainer
      ref={RouteService.navigationRef}
      onReady={() => RNBootSplash.hide({ fade: true })}
      theme={navigationTheme}>
      <UniStatusBar
        uniProps={(theme, runtime) => ({
          barStyle:
            runtime.themeName === 'light' ? 'dark-content' : 'light-content',
          backgroundColor: theme.colors.transparent,
        })}
        animated
        translucent
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="MAIN_NAVIGATOR" component={MainNavigator} />
        ) : (
          <Stack.Screen name="AUTH_NAVIGATOR" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
