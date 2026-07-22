import { useState, useEffect } from 'react';

/**
 * Custom React hook to debounce a fast-changing value.
 * Delays updating the state until after the specified delay has elapsed since the last change.
 *
 * @template T - The type of the value to be debounced.
 * @param {T} value - The input value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
