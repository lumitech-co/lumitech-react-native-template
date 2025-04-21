import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { AnimatedActivityIndicator } from 'ui';
import { AuthWrapper } from 'widgets';

export const Auth: React.FC = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <AuthWrapper>
      <View style={styles.container}>
        <AnimatedActivityIndicator />
      </View>
    </AuthWrapper>
  );
};

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
}));
