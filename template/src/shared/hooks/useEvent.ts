import { useCallback, useLayoutEffect, useRef } from 'react';

type UseEventOptions = (...args: any[]) => any;

export const useEvent = <T extends UseEventOptions>(fn: T) => {
  const latestRef = useRef(fn);

  useLayoutEffect(() => {
    latestRef.current = fn;
  }, [fn]);

  const eventCallback = useCallback(
    (...args: Parameters<T>) => latestRef.current.apply(null, args),
    [latestRef],
  );

  return eventCallback as unknown as T;
};
