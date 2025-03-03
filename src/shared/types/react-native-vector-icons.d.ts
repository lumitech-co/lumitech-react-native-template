/* eslint-disable import/no-unresolved */
import { IconName as BaseName } from 'assets/resources/selection.json';
import { IconProps } from 'react-native-vector-icons/Icon';

declare module 'react-native-vector-icons' {
  export type IconName = BaseName;

  export type Props = IconProps;
}
