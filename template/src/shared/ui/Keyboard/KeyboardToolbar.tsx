import React from 'react';

import {
  KeyboardToolbar as BaseToolBar,
  KeyboardToolbarProps,
} from 'react-native-keyboard-controller';

export const KeyboardToolbar: React.FC<KeyboardToolbarProps> = props => {
  return <BaseToolBar {...props} />;
};
