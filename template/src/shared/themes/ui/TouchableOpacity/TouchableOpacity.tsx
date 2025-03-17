/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import { TouchableOpacity as BaseTouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacityProps, ViewStyleWithColors } from '../types';
import { separateProps, transformComponentStyle } from '../lib';
import { CommonStyleSchema } from '../lib/style-schema';

export const TouchableOpacity = forwardRef<View, TouchableOpacityProps>(
  ({ style, children, ...rest }, ref) => {
    const { styles } = useStyles(stylesheet);

    const { styleProps, otherProps } = separateProps<
      TouchableOpacityProps,
      ViewStyleWithColors
    >(rest, CommonStyleSchema.shape);

    return (
      <BaseTouchableOpacity
        ref={ref}
        style={[styles.layout(styleProps), style]}
        {...otherProps}>
        {children}
      </BaseTouchableOpacity>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  layout: (props: TouchableOpacityProps) =>
    transformComponentStyle(props, theme),
}));
