import { render, act } from "@testing-library/react";
import { useLocalstorageState } from "../src/useLocalstorage"; // Adjust the path as necessary
import { useEffect } from "react";

// Test component to use the hook
const TestComponent: React.FC<{
  localStorageKey: string;
  initialValue?: string;
}> = ({ localStorageKey, initialValue }) => {
  const [value, setValue, remove] = useLocalstorageState(
    localStorageKey,
    initialValue
  );

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button data-testid="set-value" onClick={() => setValue("newValue")}>
        Set Value
      </button>
      <button data-testid="remove" onClick={remove}>
        Remove Value
      </button>
    </div>
  );
};

describe("useLocalstorageState", () => {
  const localStorageKey = "testKey";

  afterEach(() => {
    localStorage.removeItem(localStorageKey); // Clean up localStorage after each test
  });

  test("should initialize with the correct value from localStorage", () => {
    localStorage.setItem(localStorageKey, JSON.stringify("initialValue"));

    const { getByTestId } = render(
      <TestComponent
        localStorageKey={localStorageKey}
        initialValue="defaultValue"
      />
    );

    expect(getByTestId("value").textContent).toBe("initialValue");
  });

  test("should update value in localStorage and component when setValue is called", () => {
    const { getByTestId } = render(
      <TestComponent
        localStorageKey={localStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      getByTestId("set-value").click(); // Simulate button click to set new value
    });

    expect(getByTestId("value").textContent).toBe("newValue");
    expect(localStorage.getItem(localStorageKey)).toBe(
      JSON.stringify("newValue")
    );
  });

  test("should remove value from localStorage when remove is called", () => {
    localStorage.setItem(localStorageKey, JSON.stringify("someValue"));

    const { getByTestId } = render(
      <TestComponent
        localStorageKey={localStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      getByTestId("remove").click(); // Simulate button click to remove value
    });

    expect(getByTestId("value").textContent).toBe(""); // Value should be empty after removal
    expect(localStorage.getItem(localStorageKey)).toBeNull();
  });

  test("should listen to cross-document storage events", () => {
    const { getByTestId } = render(
      <TestComponent
        localStorageKey={localStorageKey}
        initialValue="defaultValue"
      />
    );

    // Simulate a storage event
    act(() => {
      localStorage.setItem(localStorageKey, JSON.stringify("updatedValue"));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: localStorageKey,
          newValue: JSON.stringify("updatedValue"),
          oldValue: JSON.stringify("defaultValue"),
          storageArea: localStorage,
        })
      ); // Dispatch storage event
    });

    expect(getByTestId("value").textContent).toBe("updatedValue");
  });

  test("should respond to custom events within the document", () => {
    const { getByTestId } = render(
      <TestComponent
        localStorageKey={localStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      const customEvent = new CustomEvent(
        `rooks-${localStorageKey}-localstorage-update`,
        {
          detail: { newValue: "customEventValue" },
        }
      );
      document.dispatchEvent(customEvent);
    });

    expect(getByTestId("value").textContent).toBe("customEventValue");
  });
});
