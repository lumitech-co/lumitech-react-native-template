import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  errorMessage: {
    color: theme.colors.danger_500,
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    fontFamily: theme.fonts.Regular,
  },
}));
