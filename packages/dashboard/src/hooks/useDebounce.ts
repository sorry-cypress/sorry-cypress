import { useCallback, useRef } from 'react';

const DEFAULT_TIMEOUT = 250;

export interface Debounce {
  (callback: (arg: never) => unknown, timeout?: number): unknown;
}

const useDebounce = (): Debounce => {
  const timeoutRef = useRef(0);

  return useCallback(
    (callback, timeout = DEFAULT_TIMEOUT) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(callback, timeout);
    },
    [timeoutRef]
  );
};

export default useDebounce;
