import React from 'react';
import { ActivityIndicator as BaseIndicator, View } from 'react-native';
import { Portal } from 'react-native-teleport';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import { AnimatedBackdrop } from '../AnimatedBackDrop';

interface ActivityIndicatorProps {
  isVisible: boolean;
}

const UniStyleActivityIndicator = withUnistyles(BaseIndicator);

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  isVisible,
}) => {
  return (
    <Portal hostName="overlay">
      <AnimatedBackdrop isVisible={isVisible} />

      {isVisible && (
        <View style={styles.container}>
          <UniStyleActivityIndicator
            size="large"
            uniProps={theme => ({ color: theme.colors.primary })}
          />
        </View>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create((_, runtime) => ({
  container: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 999,
    top: runtime.screen.height / 2,
  },
}));
