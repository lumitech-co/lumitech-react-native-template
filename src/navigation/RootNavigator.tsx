import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RouteService } from 'services';
import RNBootSplash from 'react-native-bootsplash';
import { StatusBar } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { useRootNavigator } from 'modules';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Stack } from './lib';

export const RootNavigator: React.FC = () => {
  const { theme } = useStyles();

  const { navigationTheme, currentTheme, token } = useRootNavigator();

  return (
    <NavigationContainer
      ref={RouteService.navigationRef}
      onReady={() => RNBootSplash.hide({ fade: true })}
      theme={navigationTheme}>
      <StatusBar
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.colors.primary_background}
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
