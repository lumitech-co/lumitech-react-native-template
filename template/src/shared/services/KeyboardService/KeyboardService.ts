import { KeyboardController } from 'react-native-keyboard-controller';

const dismiss = () => KeyboardController.dismiss();

const show = () => KeyboardController.setFocusTo('prev');

export const KeyboardService = {
  dismiss,
  show,
};
