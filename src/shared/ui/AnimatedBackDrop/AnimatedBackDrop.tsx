/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface AnimatedBackdropProps {
  onBackdropPress?: () => void;
  isVisible: boolean;
}

export const AnimatedBackdrop: React.FC<AnimatedBackdropProps> = React.memo(
  ({ onBackdropPress, isVisible }) => {
    const { styles } = useStyles(stylesheet);

    const visibility = useDerivedValue(() => {
      return isVisible ? 1 : 0;
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(visibility.value),
      };
    });

    const animatedProps = useAnimatedProps<AnimatedProps<ViewProps>>(() => {
      return {
        pointerEvents: visibility.value > 0 ? 'auto' : 'none',
      };
    });

    return (
      <Animated.View
        animatedProps={animatedProps}
        onTouchStart={onBackdropPress}
        style={[styles.container, animatedStyle]}
      />
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black_50,
    zIndex: 99999,
  },
}));
