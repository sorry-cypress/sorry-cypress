import { useCallback, useEffect, useState } from 'react';

export const useAsync = <T, E extends Error = Error>(
  fn: (...args: any) => any,
  immediate = false,
  ...immediateArgs: any[]
) => {
  const [pending, setPending] = useState<boolean>(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(
    (...args) => {
      setPending(true);
      setValue(null);
      setError(null);
      return fn(...args)
        .then((response: any) => {
          setValue(response);
        })
        .catch(setError)
        .finally(() => {
          setPending(false);
        });
    },
    [fn]
  );

  useEffect(() => {
    if (immediate) {
      execute(...immediateArgs);
    }
  }, [execute, immediate]);

  return [execute, pending, value, error];
};
