/* eslint-disable react/style-prop-object */
import React, { useEffect, useMemo } from 'react';
import {
  BlurMask,
  Canvas,
  Path,
  Skia,
  SweepGradient,
} from '@shopify/react-native-skia';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const CANVAS_SIZE = 120;

const CIRCLE_SIZE = 64;

const STROKE_WIDTH = 10;

const CIRCLE_RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;

export const AnimatedActivityIndicator = () => {
  const progress = useSharedValue(0);

  const { styles, theme } = useStyles(stylesheet);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [progress]);

  const circlePath = useMemo(() => {
    const skiaPath = Skia.Path.Make();

    skiaPath.addCircle(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CIRCLE_RADIUS);

    return skiaPath;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 2 * Math.PI}rad` }],
    };
  }, []);

  const startAnimated = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <Canvas style={styles.canvas}>
        <Path
          path={circlePath}
          color="white"
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          start={startAnimated}
          end={1}
          strokeCap="round">
          <SweepGradient
            c={{ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }}
            colors={[
              theme.colors.success_400,
              theme.colors.success_400,
              theme.colors.success_400,
              theme.colors.success_400,
            ]}
          />
          <BlurMask blur={8} style="solid" />
        </Path>
      </Canvas>
    </Animated.View>
  );
};

const stylesheet = createStyleSheet(() => ({
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
  container: {
    zIndex: 999,
  },
}));
