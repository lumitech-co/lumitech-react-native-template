import {
  CommonActions,
  createNavigationContainerRef,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';
import { RootStackParamList, RouteType } from './models';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const navigate = <T extends RouteType>(
  name: T,
  params?: RootStackParamList[T],
) => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(CommonActions.navigate({ name, params }));
  }
};

const openDrawer = () => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
  }
};

const closeDrawer = () => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(DrawerActions.closeDrawer());
  }
};

const goBack = () => {
  if (navigationRef?.current && navigationRef.current?.canGoBack()) {
    navigationRef.current?.dispatch(CommonActions.goBack());
  }
};

const pop = (screenCount?: number) => {
  if (navigationRef?.current && navigationRef.current?.canGoBack()) {
    navigationRef.current?.dispatch(StackActions.pop(screenCount));
  }
};

const popToTop = () => {
  if (navigationRef?.current && navigationRef.current?.canGoBack()) {
    navigationRef.current?.dispatch(StackActions.popToTop());
  }
};

const push = <T extends RouteType>(name: T, params?: RootStackParamList[T]) => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
  }
};

const setParams = (params: object) => {
  navigationRef.current?.dispatch(CommonActions.setParams(params));
};

const replace = <T extends RouteType>(
  name: T,
  params?: RootStackParamList[T],
) => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
  }
};

const reset = <T extends RouteType>(
  name: T,
  params?: RootStackParamList[T],
) => {
  if (navigationRef?.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    );
  }
};

const navigateToNestedNavigatorScreen = <
  N extends RouteType,
  S extends RouteType,
>(
  navigator: N,
  screen: S,
  params?: RootStackParamList[S],
) => {
  if (navigationRef?.current) {
    navigationRef.current?.dispatch(
      CommonActions.navigate(navigator, { screen, params }),
    );
  }
};

export const RouteService = {
  navigationRef,
  navigate,
  goBack,
  pop,
  popToTop,
  push,
  reset,
  replace,
  openDrawer,
  closeDrawer,
  setParams,
  navigateToNestedNavigatorScreen,
};
