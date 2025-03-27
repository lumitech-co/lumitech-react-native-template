import { useCallback, useRef } from 'react';
import { SwitchComponentRefProps } from 'ui';

export const useSwitch = () => {
  const switchRef = useRef<SwitchComponentRefProps>(null);

  const onOutsideAnimationStart = useCallback((isStart: boolean) => {
    switchRef?.current?.outsideAnimationStart(isStart);
  }, []);

  return {
    switchRef,
    onOutsideAnimationStart,
  };
};
