import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook for managing state with localStorage using useSyncExternalStore
 * @param key - The localStorage key
 * @param initialValue - The initial value if no value exists in localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
          callback();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    },
    [key],
  );

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(getSnapshot()) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new StorageEvent('storage', { key }));
      } catch {
        // Error saving to localStorage - silent failure
      }
    },
    [key, getSnapshot],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Error removing from localStorage - silent failure
    }
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
}
