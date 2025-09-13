import { useEffect, useMemo, useRef } from 'react';

function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined
): T {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

export { useCallbackRef };
