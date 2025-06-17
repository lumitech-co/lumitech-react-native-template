import React from 'react';
import { Auth } from '../modules';
import { Stack } from './lib';

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AUTH"
        component={Auth}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
