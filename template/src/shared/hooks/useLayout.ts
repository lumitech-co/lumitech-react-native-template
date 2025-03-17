import { useState, useCallback } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

export const useLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => setLayout(event.nativeEvent.layout),
    [],
  );

  return {
    onLayout,
    layout,
  };
};
