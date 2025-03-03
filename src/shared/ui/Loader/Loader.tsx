import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { Box, Colors } from 'themes';

interface LoaderProps {
  color?: keyof typeof Colors;
  size?: ActivityIndicatorProps['size'];
}

export const Loader: React.FC<LoaderProps> = ({
  color = 'black',
  size = 'small',
}) => {
  const { theme } = useStyles();

  return (
    <Box justifyContent="center" alignItems="center">
      <ActivityIndicator size={size} animating color={theme.colors[color]} />
    </Box>
  );
};
