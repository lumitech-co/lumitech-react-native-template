import { useStatusBar } from 'hooks';
import React from 'react';
import {
  StatusBar as BaseBar,
  StatusBarProps as BaseProps,
} from 'react-native';

interface StatusBarProps extends BaseProps {}

export const StatusBar: React.FC<StatusBarProps> = ({
  barStyle = 'dark-content',
  ...rest
}) => {
  useStatusBar({});

  return <BaseBar barStyle={barStyle} {...rest} />;
};
