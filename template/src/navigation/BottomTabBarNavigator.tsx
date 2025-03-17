import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from 'themes';
import i18next from 'i18next';
import { IconName } from 'react-native-vector-icons';
import { Icon } from 'ui';
import { RouteService, RouteType, Routes } from 'services';
import { Tab } from './lib';
import { AlertsNavigator, ProfileNavigator } from './tabs';

const titles: Record<string, string> = {
  [Routes.ALERTS_NAVIGATOR]: i18next.t('screens.alerts'),
  [Routes.PROFILE_NAVIGATOR]: i18next.t('screens.account'),
};

const tabIcons: Record<string, IconName> = {
  [Routes.ALERTS_NAVIGATOR]: 'alerts',
  [Routes.PROFILE_NAVIGATOR]: 'account',
};

export const BottomTabBarNavigator: React.FC = () => {
  const { theme, styles } = useStyles(stylesheet);

  const handleLongPress = (routeName: RouteType) => {
    RouteService.navigate(routeName);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.basic_1000,
        tabBarInactiveTintColor: theme.colors.black,
        headerShown: false,
        tabBarItemStyle: styles.tabBarItemStyle,
        lazy: true,
        tabBarLabel: () => (
          <Text
            fontSize={10}
            lineHeight={12}
            fontWeight="500"
            fontFamily="Medium"
            color="black">
            {titles[route.name]}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          const iconColor = focused ? 'basic_400' : 'basic_300';

          return (
            <Icon name={tabIcons[route.name]} size={22} color={iconColor} />
          );
        },
      })}
      backBehavior="history"
      screenListeners={({ route }) => ({
        tabLongPress: () => handleLongPress(route.name),
      })}>
      <Tab.Screen
        name="ALERTS_NAVIGATOR"
        component={AlertsNavigator}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="PROFILE_NAVIGATOR"
        component={ProfileNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const stylesheet = createStyleSheet(() => ({
  tabBarItemStyle: {
    height: 42,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  tabBarBadgeStyle: {
    top: -8,
    fontSize: 10,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 14,
    width: 16,
    height: 16,
    borderRadius: 8,
    minWidth: 0,
  },
}));
