import React from 'react';
import { Alerts } from '../../modules';
import { Stack } from '../lib';

export const AlertsNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ALERTS"
      component={Alerts}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
