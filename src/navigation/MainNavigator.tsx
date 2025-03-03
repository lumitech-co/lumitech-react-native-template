import React from 'react';
import { useStatusBar } from 'hooks';
import { Stack } from './lib';
import { BottomTabBarNavigator } from './BottomTabBarNavigator';

export const MainNavigator: React.FC = () => {
  useStatusBar({});

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BOTTOM_TAB_BAR_NAVIGATOR"
        component={BottomTabBarNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
