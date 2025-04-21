import React from 'react';
import { Portal } from '@gorhom/portal';
import { View, ActivityIndicator as BaseIndicator } from 'react-native';
import { useStyles, createStyleSheet } from 'react-native-unistyles';
import { AnimatedBackdrop } from '../AnimatedBackDrop';

interface ActivityIndicatorProps {
  isVisible: boolean;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  isVisible,
}) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Portal>
      <AnimatedBackdrop isVisible={isVisible} />

      {isVisible && (
        <View style={styles.container}>
          <BaseIndicator size="large" color={theme.colors.success_300} />
        </View>
      )}
    </Portal>
  );
};

const stylesheet = createStyleSheet((_, runtime) => ({
  container: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 999,
    top: runtime.screen.height / 2,
  },
}));
