import React from 'react';
import { Stack } from './lib';
import { BottomTabBarNavigator } from './BottomTabBarNavigator';

export const MainNavigator: React.FC = () => {
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
