import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';
import { useStyles, createStyleSheet } from 'react-native-unistyles';
import { Colors } from 'themes';

interface LoaderProps {
  color?: keyof typeof Colors;
  size?: ActivityIndicatorProps['size'];
}

export const Loader: React.FC<LoaderProps> = ({
  color = 'black',
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
