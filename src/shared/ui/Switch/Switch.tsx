/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
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
  clamp,
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

const SWITCH_CONTAINER_WIDTH = 40;
const SWITCH_CONTAINER_HEIGHT = 24;
const CIRCLE_WIDTH = 20;
const BORDER = 1;

const TRACK_CIRCLE_WIDTH = SWITCH_CONTAINER_WIDTH - CIRCLE_WIDTH - BORDER * 2;

const config: WithSpringConfig = {
  overshootClamping: true,
};

export interface SwitchComponentRefProps {
  outsideAnimationStart: (value: boolean) => void;
}

export interface SwitchComponentProps {
  value: boolean;
  onChange: (value: boolean) => void;
  enabled?: boolean;
}

export const Switch = React.forwardRef<
  SwitchComponentRefProps,
  SwitchComponentProps
>(({ value, onChange, enabled = true }, ref) => {
  const { styles, theme } = useStyles(stylesheet);

  const panRef = useRef<PanGestureHandler>(null);

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

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [0, TRACK_CIRCLE_WIDTH],
      [theme.colors.transparent, theme.colors.success_400],
    ),
  }));

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
      enabled={enabled}>
      <Animated.View style={[animatedContainerStyle, styles.switchContainer]}>
        <PanGestureHandler ref={panRef} onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[
              styles.circle,
              { backgroundColor: theme.colors.basic_600 },
              animatedStyle,
            ]}
          />
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
});

const stylesheet = createStyleSheet(theme => ({
  switchContainer: {
    width: SWITCH_CONTAINER_WIDTH,
    height: SWITCH_CONTAINER_HEIGHT,
    borderRadius: 12,
    flexDirection: 'row',
  },
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
    borderColor: theme.colors.transparent,
  },
}));
