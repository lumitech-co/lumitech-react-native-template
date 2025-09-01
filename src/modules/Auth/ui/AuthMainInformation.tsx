import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

export const AuthMainInformation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.line}>{t('auth.sign-in-with-your')}</Text>
      <Text style={styles.line}>{t('auth.manulife-id')}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  line: {
    fontFamily: theme.fonts.Regular,
    fontSize: 32,
    color: theme.colors.puissant_purple,
    fontWeight: '400',
    letterSpacing: 1,
  },
}));
