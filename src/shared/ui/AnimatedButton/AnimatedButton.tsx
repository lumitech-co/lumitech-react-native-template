import React, { ReactElement } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const DURATION = 250;

const BASE_SCALE = 0.95;

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'bold-link';

export interface AnimatedBackgroundButtonProps {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  LeftIcon?: ReactElement;
  RightIcon?: ReactElement;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  title: string;
  scale?: number;
  type?: ButtonVariant;
}

export const AnimatedButton = ({
  accessibilityHint,
  accessibilityLabel,
  LeftIcon,
  RightIcon,
  isDisabled = false,
  isLoading = false,
  scale = BASE_SCALE,
  onPress,
  title,
  type = 'primary',
}: AnimatedBackgroundButtonProps) => {
  const { styles, theme } = useStyles(stylesheet, {
    type,
  });

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
          <ActivityIndicator
            color={theme.colors.primary_background}
            size={18}
          />
        ) : (
          <>
            {LeftIcon}
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            {RightIcon}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.base,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary,
    variants: {
      type: {
        primary: {
          height: 56,
          paddingVertical: 16,
        },
        secondary: {
          height: 40,
        },
        ghost: {
          height: 40,
          backgroundColor: theme.colors.transparent,
          borderColor: theme.colors.primary,
          borderWidth: 1,
        },
        'bold-link': {
          height: 36,
          backgroundColor: theme.colors.transparent,
          borderColor: theme.colors.primary_separator,
          borderWidth: 1,
        },
      },
    },
  },
  title: {
    color: theme.colors.primary_button_text,
    flexShrink: 1,
    fontWeight: '600',
    fontFamily: theme.fonts.Bold,
    variants: {
      type: {
        primary: {
          fontSize: 19,
          lineHeight: 24,
        },
        secondary: {
          fontSize: 16,
          lineHeight: 21,
        },
        ghost: {
          fontSize: 14,
          lineHeight: 19,
          color: theme.colors.primary,
        },
        'bold-link': {
          fontSize: 14,
          lineHeight: 19,
          color: theme.colors.primary,
          fontFamily: theme.fonts.Bold,
          fontWeight: '700',
        },
      },
    },
  },
}));
