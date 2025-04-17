import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';

export const useBottomSheetModal = () => {
  const panelRef = useRef<BottomSheetModal>(null);

  const present = (data?: unknown) => {
    panelRef?.current?.present(data);
  };

  const close = useCallback(() => {
    panelRef.current?.close();
  }, []);

  const collapse = useCallback(() => {
    panelRef.current?.collapse();
  }, []);

  const dismiss = useCallback(() => {
    panelRef.current?.dismiss();
  }, []);

  const forceClose = useCallback(() => {
    panelRef.current?.forceClose();
  }, []);

  const snapToIndex = useCallback((index: number) => {
    panelRef.current?.snapToIndex(index);
  }, []);

  const snapToPosition = useCallback((position: string | number) => {
    panelRef.current?.snapToPosition(position);
  }, []);

  return {
    panelRef,
    present,
    close,
    collapse,
    dismiss,
    forceClose,
    snapToIndex,
    snapToPosition,
  };
};
