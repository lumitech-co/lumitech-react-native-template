import { ModalOptions, createModalStack } from 'react-native-modalfy';
import { ModalNames } from 'services';
import { UpdateModal } from './UpdateModal';

const UpdateModalConfig: ModalOptions = {
  modal: UpdateModal,
  backBehavior: 'none',
  disableFlingGesture: true,
};

const modalConfig: Record<ModalNames, ModalOptions> = {
  UPDATE_MODAL: UpdateModalConfig,
};

const defaultOptions = { backdropOpacity: 0.6 };

export const modalStack = createModalStack(modalConfig, defaultOptions);
