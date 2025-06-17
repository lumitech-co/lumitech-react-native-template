import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Show } from '@legendapp/state/react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  ActivityIndicator,
  AnimatedButton,
  Icon,
  ReactiveInput,
  ReactiveSwitch,
} from 'ui';
import { useAuth } from '../features';
import { AuthFooter, AuthLogo, AuthMainInformation, AuthWrapper } from '../ui';

export const AuthCompose: React.FC = () => {
  const { t } = useTranslation();

  const { styles } = useStyles(stylesheet);

  const { onSubmit, isLoading$, authFormStore$ } = useAuth();

  return (
    <View style={styles.container}>
      <Show if={isLoading$}>{() => <ActivityIndicator isVisible />}</Show>

      <AuthWrapper>
        <View>
          <AuthLogo />

          <View style={styles.formWrapper}>
            <AuthMainInformation />

            <View style={styles.emailInputWrapper}>
              <ReactiveInput
                $value={authFormStore$.formFields.email}
                $isError={() =>
                  authFormStore$.didSubmit.get() &&
                  !!authFormStore$.errors.email.get()
                }
                $errorMessage={() =>
                  authFormStore$.didSubmit.get()
                    ? authFormStore$.errors.email.get()
                    : ''
                }
                autoCapitalize="none"
                autoComplete="off"
                keyboardType="email-address"
                autoCorrect={false}
                placeholder={t('placeholders.enter-your-email')}
              />
            </View>

            <View style={styles.inputSpacing}>
              <ReactiveInput
                $value={authFormStore$.formFields.password}
                $isError={() =>
                  authFormStore$.didSubmit.get() &&
                  !!authFormStore$.errors.password.get()
                }
                $errorMessage={() =>
                  authFormStore$.didSubmit.get()
                    ? authFormStore$.errors.password.get()
                    : ''
                }
                $secureTextEntry={authFormStore$.isSecureModeEnabled}
                $RightIcon={() =>
                  authFormStore$.isSecureModeEnabled.get() ? (
                    <Icon name="eye-off" size={16} />
                  ) : (
                    <Icon name="eye" size={19} />
                  )
                }
                autoCapitalize="none"
                placeholder={t('placeholders.enter-your-password')}
                onRightPress={() => authFormStore$.isSecureModeEnabled.toggle()}
                isRightIconShown
              />
            </View>

            <View style={styles.inputSpacing}>
              <View style={styles.rowBetween}>
                <View style={styles.rowAlign}>
                  <ReactiveSwitch
                    $value={authFormStore$.formFields.rememberMe}
                    onChange={() =>
                      authFormStore$.formFields.rememberMe.toggle()
                    }
                  />
                  <Pressable
                    onPress={() => {
                      authFormStore$.formFields.rememberMe.toggle();
                    }}>
                    <Text style={styles.switchLabel}>
                      {t('buttons.remember-me')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.buttonSpacing}>
              <AnimatedButton onPress={onSubmit} title={t('buttons.sign-in')} />
            </View>

            <AuthFooter />
          </View>
        </View>
      </AuthWrapper>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
  },
  formWrapper: {
    flex: 1,
    marginTop: 141,
    justifyContent: 'center',
    paddingHorizontal: 29,
  },
  emailInputWrapper: {
    marginTop: 31,
  },
  inputSpacing: {
    marginTop: 16,
  },
  buttonSpacing: {
    marginTop: 26,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchLabel: {
    marginLeft: 8,
    fontFamily: theme.fonts.Regular,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '400',
  },
}));
