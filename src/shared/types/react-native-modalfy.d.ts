import 'react-native-modalfy';
import { type ModalStackParams } from 'services';

declare module 'react-native-modalfy' {
  interface ModalfyCustomParams extends ModalStackParams {}
}
