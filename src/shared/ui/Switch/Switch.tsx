/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-magic-numbers */
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
  WithSpringConfig,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Box, Colors } from 'themes';
import { Control, useController } from 'react-hook-form';

import { Text } from 'react-native';
import {
  constructSwitchBackgroundColor,
  constructSwitchBorderColor,
  constructSwitchCircleColor,
} from './lib';

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet';

  return Math.min(Math.max(lowerBound, value), upperBound);
};

const SWITCH_CONTAINER_WIDTH = 50;
const SWITCH_CONTAINER_HEIGHT = 32;
const CIRCLE_WIDTH = 28;
const BORDER = 1;

const TRACK_CIRCLE_WIDTH = SWITCH_CONTAINER_WIDTH - CIRCLE_WIDTH - BORDER * 4;

const config: WithSpringConfig = {
  overshootClamping: true,
};

export interface SwitchComponentRefProps {
  outsideAnimationStart: (value: boolean) => void;
}

interface SwitchComponentProps {
  name: string;
  control: Control;
  label?: string;
}

export const Switch = React.forwardRef<
  SwitchComponentRefProps,
  SwitchComponentProps
>(({ name, control, label = '' }, ref) => {
  const {
    field: { value, onChange, disabled },
  } = useController({ control, name, disabled: false, defaultValue: false });

  const panRef = useRef<PanGestureHandler>(null);

  const { styles } = useStyles(stylesheet);

  const translateX = useSharedValue(value ? TRACK_CIRCLE_WIDTH : 0);

  const outsideAnimationStart = useCallback((newValue: boolean) => {
    onChange(newValue);
    translateX.value = withSpring(newValue ? TRACK_CIRCLE_WIDTH : 0, config);
  }, []);

  useAnimatedReaction(
    () => value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        translateX.value = withSpring(
          currentValue ? TRACK_CIRCLE_WIDTH : 0,
          config,
        );
      }
    },
    [value],
  );

  useImperativeHandle(
    ref,
    () => ({
      outsideAnimationStart,
    }),
    [],
  );

  const onPress = ({
    nativeEvent: { state },
  }: TapGestureHandlerStateChangeEvent) => {
    if (state !== State.ACTIVE) {
      return;
    }

    onChange(!value);

    translateX.value = withSpring(value ? 0 : TRACK_CIRCLE_WIDTH, config);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: interpolate(
      translateX.value,
      [0, TRACK_CIRCLE_WIDTH / 3, TRACK_CIRCLE_WIDTH],
      [CIRCLE_WIDTH, (CIRCLE_WIDTH / 2) * 2.5, CIRCLE_WIDTH],
    ),
  }));

  const switchBackgroundColor =
    Colors[constructSwitchBackgroundColor(value, !!disabled)];

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, TRACK_CIRCLE_WIDTH],
        [switchBackgroundColor, switchBackgroundColor],
      ),
    };
  });

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_e, ctx) => {
      ctx.x = translateX.value;
    },
    onActive: ({ translationX }, ctx) => {
      translateX.value = clamp?.(translationX + ctx.x, 0, TRACK_CIRCLE_WIDTH);
    },
    onEnd: ({ velocityX }) => {
      const endPosition = translateX.value + 0.2 * velocityX;

      const isCloserToEnd =
        Math.abs(TRACK_CIRCLE_WIDTH - endPosition) < Math.abs(endPosition);

      const selectedSnapPoint = isCloserToEnd ? TRACK_CIRCLE_WIDTH : 0;

      translateX.value = withSpring(selectedSnapPoint, config);

      runOnJS(onChange)(selectedSnapPoint !== 0);
    },
  });

  return (
    <TapGestureHandler
      waitFor={panRef}
      onHandlerStateChange={onPress}
      enabled={!disabled}>
      <Box style={styles.switchBox}>
        <Animated.View
          style={[
            animatedContainerStyle,
            styles.switchContainer(value, disabled),
          ]}>
          <PanGestureHandler ref={panRef} onGestureEvent={onGestureEvent}>
            <Animated.View
              style={[
                styles.circle,
                {
                  backgroundColor:
                    Colors[constructSwitchCircleColor(value, !!disabled)],
                },
                animatedStyle,
              ]}
            />
          </PanGestureHandler>
        </Animated.View>
        {!!label && <Text style={styles.label(disabled)}>{label}</Text>}
      </Box>
    </TapGestureHandler>
  );
});

const stylesheet = createStyleSheet(theme => ({
  switchContainer: (value, disabled) => ({
    width: SWITCH_CONTAINER_WIDTH,
    height: SWITCH_CONTAINER_HEIGHT,
    borderRadius: 32,
    flexDirection: 'row',
    backgroundColor: Colors[constructSwitchBackgroundColor(value, disabled)],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors[constructSwitchBorderColor(value, disabled)],
  }),
  circle: {
    alignSelf: 'center',
    width: CIRCLE_WIDTH,
    height: CIRCLE_WIDTH,
    borderRadius: 999,
    borderWidth: BORDER,
    elevation: 18,
    marginHorizontal: 1,
    paddingTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  switchBox: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: disabled => ({
    color: disabled ? theme.colors.basic_500 : theme.colors.basic_900,
    fontSize: 14,
  }),
}));
