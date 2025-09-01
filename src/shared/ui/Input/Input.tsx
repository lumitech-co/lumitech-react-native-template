/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { motify, useAnimationState } from 'moti';
import { InputProps } from './types';
import { ErrorMessage } from '../ErrorMessage';
import {
  InputConstructorParams,
  constructPaddingLeft,
  constructPaddingRight,
} from './lib';

const MotiInput = motify(TextInput)();

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

    const animatedState = useAnimationState({
      focused: {
        borderColor: theme.colors.tifanny_blue,
      },
      unfocused: {
        borderColor: theme.colors.transparent,
      },
      error: {
        borderColor: theme.colors.danger_500,
      },
    });

    useEffect(() => {
      if (isError) {
        animatedState.transitionTo('error');
      } else {
        animatedState.transitionTo('unfocused');
      }
    }, [isError]);

    return (
      <View>
        <View style={styles.inputWrapper}>
          <MotiInput
            state={animatedState}
            ref={ref}
            onFocus={event => {
              if (!isError) {
                animatedState.transitionTo('focused');
              }

              rest?.onFocus?.(event);
              onFocusReceive?.();
            }}
            onBlur={event => {
              if (!isError) {
                animatedState.transitionTo('unfocused');
              }

              rest?.onBlur?.(event);
            }}
            style={styles.input({ isRightIconShown, isLeftIconShown })}
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
