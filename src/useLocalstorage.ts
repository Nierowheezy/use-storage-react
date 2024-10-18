import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useFreshRef } from "./useFreshRef";

// Gets value from localStorage
function getValueFromLocalStorage(key: string) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const storedValue = localStorage.getItem(key) ?? "null";
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(error);
  }

  return storedValue;
}

// Saves value to localStorage
function saveValueToLocalStorage<S>(key: string, value: S) {
  if (typeof localStorage === "undefined") {
    return null;
  }

  if (value === undefined) {
    return localStorage.removeItem(key);
  }

  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the localStorage object
 * @param initialState Default initial value
 */
function initialize<S>(key: string, initialState: S | (() => S)) {
  const valueLoadedFromLocalStorage = getValueFromLocalStorage(key);
  if (valueLoadedFromLocalStorage === null) {
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : initialState;
  } else {
    return valueLoadedFromLocalStorage;
  }
}

type UseLocalstorageStateReturnValue<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  () => void
];
type BroadcastCustomEvent<S> = CustomEvent<{ newValue: S }>;

/**
 * useLocalstorageState hook
 * Tracks a value within localStorage and updates it
 *
 * @param {string} key - Key of the localStorage object
 * @param {any} initialState - Default initial value
 *
 */
function useLocalstorageState<S>(
  key: string,
  initialState?: S | (() => S)
): UseLocalstorageStateReturnValue<S> {
  const [value, setValue] = useState(() => initialize(key, initialState));
  const isUpdateFromCrossDocumentListener = useRef(false);
  const isUpdateFromWithinDocumentListener = useRef(false);
  const customEventTypeName = useMemo(() => {
    return `rooks-${key}-localstorage-update`;
  }, [key]);

  useEffect(() => {
    if (
      !isUpdateFromCrossDocumentListener.current ||
      !isUpdateFromWithinDocumentListener.current
    ) {
      saveValueToLocalStorage<S>(key, value);
    }
    // Reset the flags after saving
    isUpdateFromCrossDocumentListener.current = false;
    isUpdateFromWithinDocumentListener.current = false;
  }, [key, value]);

  const listenToCrossDocumentStorageEvents = useCallback(
    (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === key) {
        try {
          const newValue = JSON.parse(event.newValue ?? "null");
          if (value !== newValue) {
            isUpdateFromCrossDocumentListener.current = true; // Set flag
            setValue(newValue);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [key, value]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", listenToCrossDocumentStorageEvents);
      return () => {
        window.removeEventListener(
          "storage",
          listenToCrossDocumentStorageEvents
        );
      };
    } else {
      console.warn("useLocalstorageState: window is undefined.");
      return () => {};
    }
  }, [listenToCrossDocumentStorageEvents]);

  const listenToCustomEventWithinDocument = useCallback(
    (event: Event) => {
      const customEvent = event as BroadcastCustomEvent<S>;
      try {
        const { newValue } = customEvent.detail;
        if (value !== newValue) {
          isUpdateFromWithinDocumentListener.current = true; // Set flag
          setValue(newValue);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [value]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener(
        customEventTypeName,
        listenToCustomEventWithinDocument as EventListener
      );
      return () => {
        document.removeEventListener(
          customEventTypeName,
          listenToCustomEventWithinDocument as EventListener
        );
      };
    } else {
      console.warn("[useLocalstorageState] document is undefined.");
      return () => {};
    }
  }, [customEventTypeName, listenToCustomEventWithinDocument]);

  const broadcastValueWithinDocument = useCallback(
    (newValue: S) => {
      if (typeof document !== "undefined") {
        const event: BroadcastCustomEvent<S> = new CustomEvent(
          customEventTypeName,
          { detail: { newValue } }
        );
        document.dispatchEvent(event);
      } else {
        console.warn("[useLocalstorageState] document is undefined.");
      }
    },
    [customEventTypeName]
  );

  const currentValue = useFreshRef(value, true);

  const set = useCallback(
    (newValue: SetStateAction<S>) => {
      const resolvedNewValue =
        typeof newValue === "function"
          ? (newValue as (prevState: S) => S)(currentValue.current)
          : newValue;
      setValue(resolvedNewValue);
      broadcastValueWithinDocument(resolvedNewValue);
    },
    [broadcastValueWithinDocument, currentValue]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(undefined); // Resetting value to undefined after removal
  }, [key]);

  return [value, set, remove];
}

export { useLocalstorageState };
