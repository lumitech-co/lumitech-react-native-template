import React from 'react';
import {
  RefreshControl as RNRefreshControl,
  RefreshControlProps,
} from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { ColorsType } from 'themes';

interface RefreshProps extends Omit<RefreshControlProps, 'colors'> {
  color?: ColorsType;
}

export const RefreshControl: React.FC<RefreshProps> = ({
  color = 'primary',
  refreshing = false,
  onRefresh,
  ...props
}) => {
  const { theme } = useStyles();

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.colors[color]]}
      tintColor={theme.colors[color]}
      {...props}
    />
  );
};
