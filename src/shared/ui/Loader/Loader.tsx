import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import { ColorsType } from 'themes';

interface LoaderProps {
  color?: ColorsType;
  size?: ActivityIndicatorProps['size'];
}

const UniStyleActivityIndicator = withUnistyles(ActivityIndicator);

export const Loader: React.FC<LoaderProps> = ({
  color = 'primary',
  size = 'small',
}) => {
  return (
    <View style={styles.wrapper}>
      <UniStyleActivityIndicator
        size={size}
        animating
        uniProps={theme => ({ color: theme.colors[color] })}
      />
    </View>
  );
};

const styles = StyleSheet.create(() => ({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
