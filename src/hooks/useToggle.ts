import { useState, useCallback } from 'react';

/**
 * Custom hook for toggling a boolean value
 * @param initialValue - The initial boolean value (default: false)
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse, setValue } as const;
}
