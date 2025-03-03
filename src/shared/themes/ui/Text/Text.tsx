/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import { Text as BaseText } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TextProps, TextStyleWithColors } from '../types';
import { transformComponentStyle, separateProps } from '../lib';
import { CommonStyleSchema } from '../lib/style-schema';

export const Text = forwardRef<BaseText, TextProps>(
  ({ style, children, ...rest }, ref) => {
    const { styles } = useStyles(stylesheet);

    const { styleProps, otherProps } = separateProps<
      TextProps,
      TextStyleWithColors
    >(rest, CommonStyleSchema.shape);

    return (
      <BaseText
        ref={ref}
        style={[styles.layout(styleProps), style]}
        {...otherProps}>
        {children}
      </BaseText>
    );
  },
);

const stylesheet = createStyleSheet(theme => ({
  layout: (props: TextProps) => transformComponentStyle(props, theme),
}));
