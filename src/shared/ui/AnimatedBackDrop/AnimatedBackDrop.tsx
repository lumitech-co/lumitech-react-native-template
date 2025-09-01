/* eslint-disable react/prop-types */
import React from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

interface AnimatedBackdropProps {
  onBackdropPress?: () => void;
  isVisible: boolean;
}

export const AnimatedBackdrop: React.FC<AnimatedBackdropProps> = React.memo(
  ({ onBackdropPress, isVisible }) => {
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

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: runtime.screen.width,
    height: runtime.screen.height,
    backgroundColor: theme.colors.black_30,
    zIndex: 99999,
  },
}));
