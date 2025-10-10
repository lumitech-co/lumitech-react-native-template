import React from 'react';
import { Text } from 'react-native';
import { IconName } from '@react-native-vector-icons/icomoon';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Icon } from 'ui';
import { RouteService, RouteType, Routes } from 'services';
import { useTranslation } from 'react-i18next';
import { Tab } from './lib';
import { AlertsNavigator, ProfileNavigator } from './tabs';

const tabIcons: Record<string, IconName> = {
  [Routes.ALERTS_NAVIGATOR]: 'alerts',
  [Routes.PROFILE_NAVIGATOR]: 'account',
};

export const BottomTabBarNavigator: React.FC = () => {
  const { theme } = useUnistyles();

  const { t } = useTranslation();

  const titles: Record<string, string> = {
    [Routes.ALERTS_NAVIGATOR]: t('screens.alerts'),
    [Routes.PROFILE_NAVIGATOR]: t('screens.account'),
  };

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
          <Text style={styles.text}>{titles[route.name]}</Text>
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

const styles = StyleSheet.create(theme => ({
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
  text: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    fontFamily: theme.fonts.Medium,
    color: theme.colors.black,
  },
}));
