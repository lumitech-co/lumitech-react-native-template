import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { reactive } from '@legendapp/state/react';
import { Input } from './Input';

export const ReactiveInput = reactive(Input, undefined, {
  value: {
    handler: 'onChange',
    getValue: (event: NativeSyntheticEvent<TextInputChangeEventData>) =>
      event.nativeEvent.text,
    defaultValue: '',
  },
});
