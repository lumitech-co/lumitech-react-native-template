import React, { useMemo } from 'react';
import {
  View,
  type ColorValue,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface PointerProps {
  style?: StyleProp<ViewStyle>;
  size: number;
  color: ColorValue;
}

export const Pointer = React.memo(({ style, size, color }: PointerProps) => {
  const { styles } = useStyles(stylesheet);

  const mergedStyle = useMemo(
    () => [
      styles.pointer,
      {
        borderLeftWidth: size,
        borderRightWidth: size,
        borderTopColor: color,
        borderTopWidth: size,
      },
      style,
    ],
    [color, size, style],
  );

  return <View style={mergedStyle} />;
});

const stylesheet = createStyleSheet(theme => ({
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: theme.colors.transparent,
    borderStyle: 'solid',
    borderLeftColor: theme.colors.transparent,
    borderRightColor: theme.colors.transparent,
  },
}));
