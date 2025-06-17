import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Theme } from '@react-navigation/native';
import { LightColors } from 'themes';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from 'services';

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const Tab = createBottomTabNavigator<RootStackParamList>();

export const navigationTheme: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: LightColors.basic_100,
    border: 'transparent',
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};
