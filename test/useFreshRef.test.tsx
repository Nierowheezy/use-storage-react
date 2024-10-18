import { renderHook } from "@testing-library/react-hooks";
import { useFreshRef } from "../src/useFreshRef";

describe("useFreshRef", () => {
  test("should initialize with the correct value", () => {
    const { result } = renderHook(() => useFreshRef("initialValue"));
    expect(result.current.current).toBe("initialValue");
  });

  test("should update the ref value on re-render", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useFreshRef(value),
      {
        initialProps: { value: "initialValue" },
      }
    );

    // Check initial value
    expect(result.current.current).toBe("initialValue");

    // Update value and re-render
    rerender({ value: "updatedValue" });
    expect(result.current.current).toBe("updatedValue"); // Should pass now
  });

  test("should update using layout effect when preferLayoutEffect is true", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useFreshRef(value, true),
      {
        initialProps: { value: "initialValue" },
      }
    );

    // Check initial value
    expect(result.current.current).toBe("initialValue");

    // Update value and re-render
    rerender({ value: "updatedValue" });

    // Ref should have the updated value immediately
    expect(result.current.current).toBe("updatedValue"); // Should pass now
  });

  test("should hold the latest function reference", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: () => string }) => useFreshRef(value),
      { initialProps: { value: () => "initial" } }
    );

    expect(result.current.current()).toBe("initial");

    // Change the value and rerender
    rerender({ value: () => "updated" });
    expect(result.current.current()).toBe("updated"); // Should pass now
  });

  test("should update the ref value when set rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useFreshRef(value),
      {
        initialProps: { value: "value1" },
      }
    );

    expect(result.current.current).toBe("value1");

    // Update value rapidly
    rerender({ value: "value2" });
    rerender({ value: "value3" });

    expect(result.current.current).toBe("value3"); // Should pass now
  });
});
