import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RouteService } from 'services';
import RNBootSplash from 'react-native-bootsplash';
import { useAuthStoreSelectors } from 'stores';
import { StatusBar } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Stack } from './lib';

export const RootNavigator: React.FC = () => {
  const { theme } = useStyles();

  const token = useAuthStoreSelectors.use.token();

  return (
    <NavigationContainer
      ref={RouteService.navigationRef}
      onReady={() => RNBootSplash.hide({ fade: true })}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.basic_100}
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
