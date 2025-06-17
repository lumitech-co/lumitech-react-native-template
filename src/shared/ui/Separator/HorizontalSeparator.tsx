import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const HorizontalSeparator: React.FC = () => {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.separator} />;
};

const stylesheet = createStyleSheet(theme => ({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.primary_separator,
  },
}));
