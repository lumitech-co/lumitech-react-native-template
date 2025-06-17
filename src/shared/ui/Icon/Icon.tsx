import React from 'react';
import { useStyles } from 'react-native-unistyles';
import {
  createIconSetFromIcoMoon,
  IconName,
  Props,
} from 'react-native-vector-icons';
import { ColorsType } from 'themes';

export const IcomoonConfig = require('../../../assets/resources/selection.json');

export const IcomoonIcon = createIconSetFromIcoMoon(
  IcomoonConfig,
  'icomoon',
  'icomoon.ttf',
);

const DEFAULT_ICON_SIZE = 16;

interface BaseProps extends Props {
  name: IconName;
  size?: number;
  color?: ColorsType;
}

export const Icon: React.FC<BaseProps> = ({
  name,
  size,
  color = 'black',
  ...rest
}) => {
  const { theme } = useStyles();

  return (
    // @ts-ignore WIP
    <IcomoonIcon
      name={name}
      size={size || DEFAULT_ICON_SIZE}
      color={theme.colors[color]}
      {...rest}
    />
  );
};
