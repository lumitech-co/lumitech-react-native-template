import React from 'react';
import {
  RefreshControl as RNRefreshControl,
  RefreshControlProps,
} from 'react-native';
import { withUnistyles } from 'react-native-unistyles';
import { ColorsType } from 'themes';

interface RefreshProps extends Omit<RefreshControlProps, 'colors'> {
  color?: ColorsType;
}

const UniStyleRefreshControl = withUnistyles(RNRefreshControl);

export const RefreshControl: React.FC<RefreshProps> = ({
  color = 'primary',
  refreshing = false,
  onRefresh,
  ...props
}) => {
  return (
    <UniStyleRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      uniProps={theme => ({
        colors: [theme.colors[color]],
        tintColor: theme.colors[color],
      })}
      {...props}
    />
  );
};
