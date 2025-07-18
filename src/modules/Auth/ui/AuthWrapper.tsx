import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface AuthWrapperProps {
  children: React.ReactNode;
  bottomOffset?: number;
}

const BOTTOM_OFFSET = 100;

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  bottomOffset = BOTTOM_OFFSET,
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.contentContainer}
      bottomOffset={bottomOffset}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive">
      <View style={styles.wrapper}>{children}</View>
    </KeyboardAwareScrollView>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.primary_background,
  },
  wrapper: {
    flex: 1,
    paddingTop: theme.inset(runtime.insets.top),
    justifyContent: 'space-between',
  },
}));
