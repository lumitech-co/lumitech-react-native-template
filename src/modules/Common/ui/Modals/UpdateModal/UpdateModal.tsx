import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

export const UpdateModal: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('update-modal.title')}</Text>

      <Text style={styles.description}>{t('update-modal.description')}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontFamily: theme.fonts.Regular,
    fontWeight: '500',
    color: theme.colors.black,
    fontSize: 16,
  },
  description: {
    marginTop: 16,
    textAlign: 'center',
    color: theme.colors.black,
    fontFamily: theme.fonts.Regular,
    fontSize: 14,
  },
}));
