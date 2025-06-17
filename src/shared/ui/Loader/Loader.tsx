import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';
import { useStyles, createStyleSheet } from 'react-native-unistyles';
import { ColorsType } from 'themes';

interface LoaderProps {
  color?: ColorsType;
  size?: ActivityIndicatorProps['size'];
}

export const Loader: React.FC<LoaderProps> = ({
  color = 'primary',
  size = 'small',
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size={size} animating color={theme.colors[color]} />
    </View>
  );
};

const stylesheet = createStyleSheet(() => ({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
