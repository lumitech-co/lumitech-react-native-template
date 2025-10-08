/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { InputProps } from './types';
import { ErrorMessage } from '../ErrorMessage';
import {
  InputConstructorParams,
  constructPaddingLeft,
  constructPaddingRight,
} from './lib';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      multiline,
      onFocusReceive,
      LeftIcon,
      RightIcon,
      isLeftIconShown = false,
      isRightIconShown = false,
      onRightPress,
      onLeftPress,
      editable = true,
      isError,
      errorMessage,
      type = 'primary',
      ...rest
    },
    ref,
  ) => {
    const { theme, rt } = useUnistyles();

    const KEYBOARD_APPEARANCE = rt.themeName === 'dark' ? 'dark' : 'light';

    styles.useVariants({
      type,
    });

    const borderColor = useSharedValue(theme.colors.transparent);

    const animatedStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

    useEffect(() => {
      if (isError) {
        borderColor.value = withTiming(theme.colors.danger_500, {
          duration: 200,
        });
      } else {
        borderColor.value = withTiming(theme.colors.transparent, {
          duration: 200,
        });
      }
    }, [isError]);

    return (
      <View>
        <View style={styles.inputWrapper}>
          <AnimatedTextInput
            ref={ref}
            onFocus={event => {
              if (!isError) {
                borderColor.value = withTiming(theme.colors.tifanny_blue, {
                  duration: 200,
                });
              }

              rest?.onFocus?.(event);
              onFocusReceive?.();
            }}
            onBlur={event => {
              if (!isError) {
                borderColor.value = withTiming(theme.colors.transparent, {
                  duration: 200,
                });
              }

              rest?.onBlur?.(event);
            }}
            style={[
              styles.input({ isRightIconShown, isLeftIconShown }),
              animatedStyle,
            ]}
            placeholderTextColor={theme.colors.mens_night}
            editable={editable}
            multiline={multiline}
            keyboardAppearance={KEYBOARD_APPEARANCE}
            {...rest}
          />

          {!!isLeftIconShown && (
            <Pressable style={styles.leftIconBox} onPress={onLeftPress}>
              {LeftIcon}
            </Pressable>
          )}

          {!!isRightIconShown && (
            <Pressable style={styles.rightIconBox} onPress={onRightPress}>
              {RightIcon}
            </Pressable>
          )}
        </View>

        {isError && (
          <View style={styles.errorWrapper}>
            <ErrorMessage message={errorMessage} />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create(theme => ({
  inputWrapper: {
    justifyContent: 'center',
  },
  errorWrapper: {
    marginTop: 8,
  },
  input: ({ isLeftIconShown, isRightIconShown }: InputConstructorParams) => ({
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.basic_500,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: theme.fonts.Regular,
    color: theme.colors.mens_night,
    height: 48,
    paddingLeft: constructPaddingLeft({ isLeftIconShown }),
    paddingRight: constructPaddingRight({ isRightIconShown }),
    textAlignVertical: 'center',
    variants: {
      type: {
        primary: {},
        search: {
          backgroundColor: theme.colors.search_input_background,
          borderColor: theme.colors.primary_separator,
        },
      },
    },
  }),
  leftIconBox: {
    position: 'absolute',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    left: 14,
    zIndex: 999,
  },
  rightIconBox: {
    position: 'absolute',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    zIndex: 999,
  },
}));
