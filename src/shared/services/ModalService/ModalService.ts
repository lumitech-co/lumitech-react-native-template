import { modalfy } from 'react-native-modalfy';
import { ModalNames, ModalStackParams } from './models';

const open = <T extends ModalNames>(name: T, params?: ModalStackParams[T]) => {
  modalfy().openModal(name, params);
};

const close = <T extends ModalNames>(name: T, callback?: () => void) => {
  modalfy().closeModal(name, callback);
};

const closeAllModals = () => {
  modalfy().closeAllModals();
};

export const ModalService = {
  open,
  close,
  closeAllModals,
};
