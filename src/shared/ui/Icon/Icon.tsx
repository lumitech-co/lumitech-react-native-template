import React from 'react';
import { withUnistyles } from 'react-native-unistyles';
import { IconName, Props } from 'react-native-vector-icons';
import { ColorsType } from 'themes';
import createIconSet from '@react-native-vector-icons/icomoon';

export const IcomoonConfig = require('../../../assets/resources/selection.json');

const IcomoonIcon = createIconSet(IcomoonConfig);

const DEFAULT_ICON_SIZE = 16;

interface BaseProps extends Props {
  name: IconName;
  size?: number;
  color?: ColorsType;
}

const UniIcon = withUnistyles(IcomoonIcon);

export const Icon: React.FC<BaseProps> = ({
  name,
  size,
  color = 'black',
  ...rest
}) => {
  return (
    <UniIcon
      name={name}
      size={size || DEFAULT_ICON_SIZE}
      uniProps={theme => ({
        color: theme.colors[color],
      })}
      {...rest}
    />
  );
};
