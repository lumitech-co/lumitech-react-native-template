import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import {
  createIconSetFromIcoMoon,
  IconName,
  Props,
} from 'react-native-vector-icons';
import { Colors } from 'themes';

interface IcomoonIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const IcomoonConfig = require('../../../assets/resources/selection.json');

export const IcomoonIcon = createIconSetFromIcoMoon(
  IcomoonConfig,
  'icomoon',
  'icomoon.ttf',
) as unknown as React.ComponentType<IcomoonIconProps>;

const DEFAULT_ICON_SIZE = 16;

interface BaseProps extends Props {
  name: IconName;
  size?: number;
  color?: keyof typeof Colors;
}

export const Icon: React.FC<BaseProps> = ({
  name,
  size,
  color = 'black',
  ...rest
}) => {
  const { theme } = useStyles();

  return (
    <IcomoonIcon
      name={name}
      size={size || DEFAULT_ICON_SIZE}
      color={theme.colors[color]}
      {...rest}
    />
  );
};
