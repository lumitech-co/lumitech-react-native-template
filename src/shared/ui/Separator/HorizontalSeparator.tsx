import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const HorizontalSeparator: React.FC = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create(theme => ({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.colors.primary_separator,
  },
}));
