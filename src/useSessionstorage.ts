import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
type Setter<T> = Dispatch<SetStateAction<T | undefined>>;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: any) => void;
  syncData: boolean;
}>;

function getValueFromSessionStorage(
  key: string,
  parser: Parser<any>,
  defaultValue?: any
) {
  if (typeof sessionStorage === "undefined") {
    return defaultValue;
  }

  const storedValue = sessionStorage.getItem(key);
  try {
    return storedValue ? parser(storedValue) : defaultValue;
  } catch (error) {
    console.error(error);
    return defaultValue;
  }
}

function saveValueToSessionStorage<S>(
  key: string,
  value: S,
  serializer: Serializer<S>
) {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  if (value === undefined) {
    return sessionStorage.removeItem(key);
  }

  return sessionStorage.setItem(key, serializer(value));
}

function useSessionStorage<S>(
  key: string,
  initialState?: S | (() => S),
  options?: Options<S>
): [S | undefined, Setter<S>, () => void] {
  const opts = useMemo(
    () => ({
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options,
    }),
    [options]
  );

  const { serializer, parser, logger, syncData } = opts;

  const [value, setValue] = useState(() => {
    const resolvedInitialState =
      typeof initialState === "function"
        ? (initialState as () => S)() // Type assertion
        : initialState;

    return getValueFromSessionStorage(key, parser, resolvedInitialState);
  });

  const rawValueRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSessionStorage = () => {
      if (value !== undefined) {
        const newValue = serializer(value);
        rawValueRef.current = newValue;
        sessionStorage.setItem(key, newValue);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: sessionStorage,
            key,
            newValue,
          })
        );
      } else {
        sessionStorage.removeItem(key);
        window.dispatchEvent(
          new StorageEvent("storage", {
            storageArea: sessionStorage,
            key,
          })
        );
      }
    };

    try {
      updateSessionStorage();
    } catch (e) {
      logger(e);
    }
  }, [key, value]);

  useEffect(() => {
    if (!syncData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== sessionStorage) return;

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
        sessionStorage.setItem(key, serializer(event.detail.newValue));
      }
    };

    if (typeof window === "undefined") return;

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener(
      `rooks-${key}-sessionstorage-update`,
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener(
        `rooks-${key}-sessionstorage-update`,
        handleCustomEvent as EventListener
      );
    };
  }, [key, syncData]);

  const remove = useCallback(() => {
    sessionStorage.removeItem(key);
    setValue(undefined); // Resetting value to undefined after removal
  }, [key]);

  return [value, setValue, remove];
}

export { useSessionStorage };
