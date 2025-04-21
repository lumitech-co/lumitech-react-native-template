import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface AuthWrapperProps {
  children: React.ReactNode;
  bottomOffset?: number;
}

const BOTTOM_OFFSET = 25;

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  bottomOffset = BOTTOM_OFFSET,
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.contentContainerStyle}
      bottomOffset={bottomOffset}
      keyboardShouldPersistTaps="always">
      <View style={styles.container}>{children}</View>
    </KeyboardAwareScrollView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.black,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
}));
