import { render, act } from "@testing-library/react";
import { useSessionStorage } from "../src/useSessionstorage"; // Adjust the path as necessary
import { useEffect } from "react";

// Define the props type for the TestComponent
interface TestComponentProps {
  sessionStorageKey: string;
  initialValue?: string; // Make initialValue optional
}

// Test component to use the hook
const TestComponent: React.FC<TestComponentProps> = ({
  sessionStorageKey,
  initialValue,
}) => {
  const [value, setValue] = useSessionStorage(sessionStorageKey, initialValue);

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div>
      <span data-testid="value">{value}</span>
      <button data-testid="set-value" onClick={() => setValue("newValue")}>
        Set Value
      </button>
      <button data-testid="remove" onClick={() => setValue(undefined)}>
        Remove Value
      </button>
    </div>
  );
};

describe("useSessionStorage", () => {
  const sessionStorageKey = "testKey";

  afterEach(() => {
    sessionStorage.removeItem(sessionStorageKey); // Clean up sessionStorage after each test
  });

  test("should initialize with the correct value from sessionStorage", () => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify("initialValue"));

    const { getByTestId } = render(
      <TestComponent
        sessionStorageKey={sessionStorageKey}
        initialValue="defaultValue"
      />
    );

    expect(getByTestId("value").textContent).toBe("initialValue");
  });

  test("should update value in sessionStorage and component when setValue is called", () => {
    const { getByTestId } = render(
      <TestComponent
        sessionStorageKey={sessionStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      getByTestId("set-value").click(); // Simulate button click to set new value
    });

    expect(getByTestId("value").textContent).toBe("newValue");
    expect(sessionStorage.getItem(sessionStorageKey)).toBe(
      JSON.stringify("newValue")
    );
  });

  test("should remove value from sessionStorage when remove is called", () => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify("someValue"));

    const { getByTestId } = render(
      <TestComponent
        sessionStorageKey={sessionStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      getByTestId("remove").click(); // Simulate button click to remove value
    });

    expect(getByTestId("value").textContent).toBe(""); // Value should be empty after removal
    expect(sessionStorage.getItem(sessionStorageKey)).toBeNull();
  });

  test("should listen to cross-document storage events", () => {
    const { getByTestId } = render(
      <TestComponent
        sessionStorageKey={sessionStorageKey}
        initialValue="defaultValue"
      />
    );

    // Simulate a storage event
    act(() => {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify("updatedValue"));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: sessionStorageKey,
          newValue: JSON.stringify("updatedValue"),
          oldValue: JSON.stringify("defaultValue"),
          storageArea: sessionStorage,
        })
      ); // Dispatch storage event
    });

    expect(getByTestId("value").textContent).toBe("updatedValue");
  });

  test("should respond to custom events within the document", () => {
    const { getByTestId } = render(
      <TestComponent
        sessionStorageKey={sessionStorageKey}
        initialValue="defaultValue"
      />
    );

    act(() => {
      const customEvent = new CustomEvent(
        `rooks-${sessionStorageKey}-sessionstorage-update`,
        {
          detail: { newValue: "customEventValue" },
        }
      );
      document.dispatchEvent(customEvent);
    });

    expect(getByTestId("value").textContent).toBe("customEventValue");
  });
});
