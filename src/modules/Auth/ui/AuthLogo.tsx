import React from 'react';
import { View, Image } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const AuthLogo: React.FC = () => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  label: {
    marginLeft: 30,
    fontSize: 32,
    fontFamily: theme.fonts.Bold,
  },
}));
