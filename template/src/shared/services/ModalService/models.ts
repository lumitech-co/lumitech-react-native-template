export const MODAL_NAMES = {
  UPDATE_MODAL: 'UPDATE_MODAL',
};

export type ModalNames = keyof typeof MODAL_NAMES;

export type ModalStackParams = {
  UPDATE_MODAL: { title: string; message: string };
};
