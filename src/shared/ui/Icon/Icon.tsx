import React from 'react';
import { withUnistyles } from 'react-native-unistyles';
import createIconSet, { IconName } from '@react-native-vector-icons/icomoon';
import { ColorsType } from 'themes';
import { ViewProps } from 'react-native';

export const IcomoonConfig = require('../../../assets/resources/selection.json');

const IcomoonIcon = createIconSet(IcomoonConfig);

const DEFAULT_ICON_SIZE = 16;

interface BaseProps extends ViewProps {
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
