import React, { ReactElement } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export interface AnimatedBackgroundButtonProps {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  Icon?: ReactElement;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  title: string;
  scale?: number;
}

const DURATION = 250;

const BASE_SCALE = 0.95;

export const AnimatedButton = ({
  accessibilityHint,
  accessibilityLabel,
  Icon,
  isDisabled = false,
  isLoading = false,
  scale = BASE_SCALE,
  onPress,
  title,
}: AnimatedBackgroundButtonProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const transition = useSharedValue(0);
  const isActive = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(transition.value, [0, 1], [1, scale]),
      },
    ],
  }));

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        busy: isLoading,
        disabled: isDisabled || isLoading,
      }}
      disabled={isDisabled || isLoading}
      hitSlop={16}
      onPress={onPress}
      onPressIn={() => {
        isActive.value = true;
        transition.value = withTiming(1, { duration: DURATION }, () => {
          if (!isActive.value) {
            transition.value = withTiming(0, {
              duration: DURATION,
            });
          }
        });
      }}
      onPressOut={() => {
        if (transition.value === 1) {
          transition.value = withTiming(0, { duration: DURATION });
        }
        isActive.value = false;
      }}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          {
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.success_500} size={18} />
        ) : (
          <>
            {Icon}
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: theme.colors.success_500,
  },
  title: {
    color: theme.colors.basic_300,
    flexShrink: 1,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: theme.fonts.Regular,
  },
}));
