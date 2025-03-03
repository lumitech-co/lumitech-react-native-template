import { RouteProp } from '@react-navigation/native';
import { Routes } from './Routes';

export type RouteType = keyof typeof Routes;

export type RootStackParamList = {
  [Routes.MAIN_NAVIGATOR]: undefined;

  [Routes.AUTH_NAVIGATOR]: undefined;

  [Routes.BOTTOM_TAB_BAR_NAVIGATOR]: undefined;

  [Routes.ALERTS_NAVIGATOR]: undefined;

  [Routes.PROFILE_NAVIGATOR]: undefined;

  [Routes.AUTH]: undefined;

  [Routes.PROFILE]: undefined;

  [Routes.ALERTS]: undefined;
};

export type SignInProp = RouteProp<RootStackParamList, 'PROFILE'>;
