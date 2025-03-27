/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Box } from 'themes';
import { TextInput, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
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
      ...rest
    },
    ref,
  ) => {
    const { styles, theme } = useStyles(stylesheet);

    const animatedState = useAnimationState({
      focused: {
        borderColor: theme.colors.success_400,
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
      <Box>
        <Box justifyContent="center">
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
            placeholderTextColor={theme.colors.black}
            editable={editable}
            multiline={multiline}
            {...rest}
          />

          {!!isLeftIconShown && (
            <TouchableOpacity style={styles.leftIconBox} onPress={onLeftPress}>
              {LeftIcon}
            </TouchableOpacity>
          )}

          {!!isRightIconShown && (
            <TouchableOpacity
              style={styles.rightIconBox}
              onPress={onRightPress}>
              {RightIcon}
            </TouchableOpacity>
          )}
        </Box>

        {isError && (
          <Box marginTop={8}>
            <ErrorMessage message={errorMessage} />
          </Box>
        )}
      </Box>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  input: ({ isLeftIconShown, isRightIconShown }: InputConstructorParams) => ({
    backgroundColor: theme.colors.basic_100,
    borderColor: theme.colors.basic_500,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: theme.fonts.Regular,
    color: theme.colors.black,
    height: 48,
    paddingLeft: constructPaddingLeft({ isLeftIconShown }),
    paddingRight: constructPaddingRight({ isRightIconShown }),
    textAlignVertical: 'center',
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
