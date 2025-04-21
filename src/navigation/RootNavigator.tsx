import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RouteService } from 'services';
import RNBootSplash from 'react-native-bootsplash';
import { useUserId } from 'stores';
import { StatusBar } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Stack, navigationTheme } from './lib';

export const RootNavigator: React.FC = () => {
  const { theme } = useStyles();

  const userId = useUserId();

  return (
    <NavigationContainer
      ref={RouteService.navigationRef}
      theme={navigationTheme}
      onReady={() => RNBootSplash.hide({ fade: true })}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.basic_100}
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userId ? (
          <Stack.Screen name="MAIN_NAVIGATOR" component={MainNavigator} />
        ) : (
          <Stack.Screen name="AUTH_NAVIGATOR" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
