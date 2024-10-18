import { renderHook, act } from "@testing-library/react-hooks";
import { useSessionstorageState } from "../src/useSessionstorage"; // Adjust the path accordingly

describe("useSessionstorageState", () => {
  const key = "testKey";

  beforeEach(() => {
    sessionStorage.clear(); // Clear sessionStorage before each test
  });

  it("should initialize with the default value", () => {
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );
    expect(result.current[0]).toBe("defaultValue");
  });

  it("should initialize with value from sessionStorage", () => {
    sessionStorage.setItem(key, JSON.stringify("storedValue"));
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );
    expect(result.current[0]).toBe("storedValue");
  });

  it("should update sessionStorage when state changes", () => {
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );

    act(() => {
      result.current[1]("newValue"); // Set new value
    });

    expect(result.current[0]).toBe("newValue");
    expect(sessionStorage.getItem(key)).toBe(JSON.stringify("newValue"));
  });

  it("should remove item from sessionStorage", () => {
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );

    act(() => {
      result.current[2](); // Remove value
    });

    expect(result.current[0]).toBe(undefined);
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it("should handle cross-document storage events", () => {
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );

    act(() => {
      sessionStorage.setItem(key, JSON.stringify("crossDocumentValue"));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify("crossDocumentValue"),
          storageArea: sessionStorage,
        })
      );
    });

    expect(result.current[0]).toBe("crossDocumentValue");
  });

  it("should handle custom events within the document", () => {
    const { result } = renderHook(() =>
      useSessionstorageState(key, "defaultValue")
    );

    const event = new CustomEvent(`rooks-${key}-sessionstorage-update`, {
      detail: { newValue: "customEventValue" },
    });

    act(() => {
      document.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("customEventValue");
  });
});
