import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const AuthFooter: React.FC = () => {
  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.wrapper}>
      <Pressable>
        <Text style={styles.linkText}>
          {t('auth.forgot-your-username-and-password')}
        </Text>
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    marginTop: 16,
  },
  linkText: {
    textAlign: 'center',
    fontFamily: theme.fonts.Regular,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    textDecorationLine: 'underline',
  },
}));
