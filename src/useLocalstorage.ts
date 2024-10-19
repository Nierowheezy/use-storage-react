import { useEffect, useMemo, useRef, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: any) => void;
  syncData: boolean;
}>;

/**
 * useLocalStorage hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} defaultValue - Default initial value
 * @param {Options} options - Options for serializer, parser, logger, and syncData
 *
 * @returns {Array} Current value and setter function
 */
function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
): [T | undefined, Setter<T>] {
  const opts = useMemo(() => {
    return {
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options,
    };
  }, [options]);

  const { serializer, parser, logger, syncData } = opts;

  const rawValueRef = useRef<string | null>(null);

  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      rawValueRef.current = window.localStorage.getItem(key);
      const res: T = rawValueRef.current
        ? parser(rawValueRef.current)
        : defaultValue;
      return res;
    } catch (e) {
      logger(e);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocalStorage = () => {
      if (value !== undefined) {
        const newValue = serializer(value);
        const oldValue = rawValueRef.current;
        rawValueRef.current = newValue;
        window.localStorage.setItem(key, newValue);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
            newValue,
            oldValue,
          })
        );
      } else {
        window.localStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: window.localStorage,
            url: window.location.href,
            key,
          })
        );
      }
    };

    try {
      updateLocalStorage();
    } catch (e) {
      logger(e);
    }
  }, [value]);

  useEffect(() => {
    if (!syncData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;

      try {
        if (e.newValue !== rawValueRef.current) {
          rawValueRef.current = e.newValue;
          setValue(e.newValue ? parser(e.newValue) : undefined);
        }
      } catch (e) {
        logger(e);
      }
    };

    const handleCustomEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.newValue) {
        setValue(event.detail.newValue);
        window.localStorage.setItem(key, serializer(event.detail.newValue));
      }
    };

    if (typeof window === "undefined") return;

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener(
      `rooks-${key}-localstorage-update`,
      handleCustomEvent as EventListener // Ensure this is treated as a valid EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener(
        `rooks-${key}-localstorage-update`,
        handleCustomEvent as EventListener
      );
    };
  }, [key, syncData]);

  return [value, setValue];
}

// Named export
export { useLocalStorage };
