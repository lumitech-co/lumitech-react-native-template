import { useEffect, useMemo } from 'react';
import { debounce } from 'lib';
import { useEvent } from './useEvent';

export const useDebounce = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  ms: number,
) => {
  const memoizedFn = useEvent(fn);

  const debouncedFn = useMemo(
    () =>
      debounce((...args: Parameters<Fn>) => {
        memoizedFn(...args);
      }, ms),
    [ms],
  );

  useEffect(
    () => () => {
      debouncedFn.cancel();
    },
    [debouncedFn],
  );

  return debouncedFn;
};
