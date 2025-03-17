// eslint-disable-next-line import/no-extraneous-dependencies
import { Portal } from '@gorhom/portal';
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import {
  View,
  type ColorValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type BaseAnimationBuilder,
  runOnUI,
  runOnJS,
} from 'react-native-reanimated';
import { Pointer } from './Pointer';

const POINTER_SIZE = 8;

export interface TooltipProps extends ViewProps {
  portalHostName?: string;
  visible?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  tooltipStyle?: StyleProp<ViewStyle>;
  content?: React.ReactElement<{}>;
  entering?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  exiting?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  withPointer?: boolean;
  pointerStyle?: StyleProp<ViewStyle>;
  pointerSize?: number;
  pointerColor?: ColorValue;
}

export const Tooltip = React.memo((props: PropsWithChildren<TooltipProps>) => {
  const {
    portalHostName,
    visible = false,
    containerStyle,
    content,
    tooltipStyle,
    entering,
    exiting,
    withPointer = true,
    pointerStyle,
    pointerSize = POINTER_SIZE,
    pointerColor = '',
    children,
    onLayout,
    ...rest
  } = props;

  const { styles } = useStyles(stylesheet);

  const [delayedVisible, setDelayedVisible] = useState(visible);

  if (visible && visible !== delayedVisible) {
    setDelayedVisible(true);
  }

  const element = useAnimatedRef<Animated.View>();
  const backdrop = useRef<View>(null);
  const tooltip = useRef<Animated.View>(null);

  const elementDimensions = useSharedValue<{
    pageX: number;
    pageY: number;
    height: number;
    width: number;
  } | null>(null);

  const backdropDimensions = useSharedValue<{
    width: number;
    height: number;
  } | null>(null);

  const tooltipDimensions = useSharedValue<{
    width: number;
    height: number;
  } | null>(null);

  const pointPosition = useDerivedValue<
    | {
        x: number;
        y: number;
        topHalfOfViewport: boolean;
      }
    | undefined
  >(() => {
    if (elementDimensions.value && backdropDimensions.value) {
      const topHalfOfViewport =
        elementDimensions.value.pageY + elementDimensions.value.height / 2 >=
        backdropDimensions.value.height / 2;
      const x =
        elementDimensions.value.pageX + elementDimensions.value.width / 2;
      const y =
        elementDimensions.value.pageY +
        (topHalfOfViewport ? -pointerSize : elementDimensions.value.height);

      return { x, y, topHalfOfViewport };
    }

    return undefined;
  });

  const measureElement = useCallback(() => {
    'worklet';

    const measured = measure(element);

    if (measured) {
      const { pageX, pageY, width, height } = measured;

      elementDimensions.value = {
        pageX,
        pageY,
        width,
        height,
      };
    }
  }, [element, elementDimensions]);

  useEffect(() => {
    if (visible) {
      runOnUI(measureElement)();
    }
  }, [visible, measureElement]);

  const onElementLayout = useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);
      if (visible) {
        runOnUI(measureElement)();
      }
    },
    [onLayout, measureElement, visible],
  );

  const onBackdropLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      backdropDimensions.value = {
        width,
        height,
      };
    },
    [backdropDimensions],
  );

  const onTooltipLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      tooltipDimensions.value = {
        width,
        height,
      };
    },
    [tooltipDimensions],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => {
    if (pointPosition.value) {
      return {
        position: 'absolute',
        top: pointPosition.value.y,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
      };
    }

    return {
      position: 'absolute',
      top: -10000,
      left: 0,
      right: 0,
    };
  });

  const tooltipAnimatedStyle = useAnimatedStyle(() => {
    if (
      backdropDimensions.value &&
      tooltipDimensions.value &&
      pointPosition.value
    ) {
      let tooltipX = pointPosition.value.x - tooltipDimensions.value.width / 2;
      const tooltipOutsideRight =
        tooltipX + tooltipDimensions.value.width >
        backdropDimensions.value.width;

      if (tooltipOutsideRight) {
        tooltipX =
          backdropDimensions.value.width - tooltipDimensions.value.width;
      }

      const tooltipOutsideLeft = tooltipX < 0;

      if (tooltipOutsideLeft) {
        tooltipX = 0;
      }

      return {
        position: 'absolute',
        top: pointPosition.value.topHalfOfViewport
          ? -tooltipDimensions.value.height
          : pointerSize,
        left: tooltipX,
      };
    }

    return {
      position: 'absolute',
      top: -10000,
    };
  }, []);

  const pointerAnimatedStyle = useAnimatedStyle(() => {
    if (pointPosition.value) {
      return {
        position: 'absolute',
        top: 0,
        left: pointPosition.value.x,
        marginLeft: -pointerSize,
        transform: [
          {
            rotate: pointPosition.value.topHalfOfViewport ? '0deg' : '180deg',
          },
        ],
      };
    }

    return {
      position: 'absolute',
      top: -10000,
    };
  }, []);

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  return (
    <Animated.View
      {...rest}
      ref={element}
      collapsable={false}
      onLayout={onElementLayout}>
      {children}
      <Portal hostName={portalHostName}>
        {delayedVisible ? (
          <>
            <View
              style={styles.backdrop}
              ref={backdrop}
              pointerEvents="none"
              onLayout={onBackdropLayout}
            />
            <Animated.View style={[containerStyle, containerAnimatedStyle]}>
              {visible ? (
                <Animated.View
                  entering={entering}
                  // @ts-ignore
                  exiting={exiting?.withCallback(finished => {
                    'worklet';

                    if (finished) {
                      runOnJS(setDelayedVisible)(false);
                    }
                  })}>
                  <Animated.View
                    style={tooltipAnimatedStyle}
                    ref={tooltip}
                    onLayout={onTooltipLayout}>
                    <View style={tooltipStyle ?? styles.defaultTooltip}>
                      {content}
                    </View>
                  </Animated.View>
                  {withPointer ? (
                    <Animated.View style={pointerAnimatedStyle}>
                      <Pointer
                        style={pointerStyle}
                        size={pointerSize}
                        color={pointerColor}
                      />
                    </Animated.View>
                  ) : null}
                </Animated.View>
              ) : null}
            </Animated.View>
          </>
        ) : null}
      </Portal>
    </Animated.View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  defaultTooltip: {
    backgroundColor: theme.colors.info_transparent_24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
}));
