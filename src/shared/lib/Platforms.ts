import { Platform } from 'react-native';
import React from 'react';
import {
  hasNotch as hasTopOffset,
  getVersion,
  getBundleId,
  getBuildNumber,
} from 'react-native-device-info';
import { UnistylesRuntime } from 'react-native-unistyles';

export const hasNotch = hasTopOffset();

export const bundleId = getBundleId();

export const appVersion = getVersion();

export const appBuildNumber = getBuildNumber();

export const touchableConfig = {
  delayPressIn: 0,
  delayPressOut: 0,
  activeOpacity: 0.8,
};

export const isIOS = Platform.OS === 'ios';

type ReactComponent<Props = {}> = React.ComponentType<Props> & {
  defaultProps?: Partial<Props>;
};

export const setDefaultProps = <T extends ReactComponent>(
  Component: T,
  additionalProps: React.ComponentProps<T>,
) => {
  Component.defaultProps = {
    ...(Component.defaultProps || {}),
    ...additionalProps,
  };
};

export const platformOS = Platform.OS;

const DEFAULT_INSET = 16;

export const PLATFORM_INSETS = {
  TOP: Math.max(UnistylesRuntime.insets.top, DEFAULT_INSET),
  BOTTOM: Math.max(UnistylesRuntime.insets.bottom, DEFAULT_INSET),
  LEFT: Math.max(UnistylesRuntime.insets.left, DEFAULT_INSET),
  RIGHT: Math.max(UnistylesRuntime.insets.right, DEFAULT_INSET),
};
