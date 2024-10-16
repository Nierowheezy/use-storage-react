// src/tests/useAdvancedToggle.test.ts
import { renderHook, act } from "@testing-library/react";
import useAdvancedToggle from "../hooks/useAdvancedToggle";

describe("useAdvancedToggle", () => {
  it("should toggle between states", () => {
    const states = ["red", "green", "blue"];
    const { result } = renderHook(() => useAdvancedToggle(states));

    expect(result.current[0]).toBe("red"); // Initial state
    act(() => result.current[1]()); // Toggle
    expect(result.current[0]).toBe("green"); // Second state
    act(() => result.current[1]()); // Toggle
    expect(result.current[0]).toBe("blue"); // Third state
    act(() => result.current[1]()); // Toggle
    expect(result.current[0]).toBe("red"); // Back to first state
  });

  it("should handle empty states array", () => {
    const { result } = renderHook(() => useAdvancedToggle([]));
    expect(result.current[0]).toBeUndefined(); // or check for specific behavior
  });

  it("should remain constant when a single state is provided", () => {
    const { result } = renderHook(() => useAdvancedToggle(["red"]));
    expect(result.current[0]).toBe("red");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("red"); // should still be red
  });

  it("should handle multiple toggles", () => {
    const states = ["red", "green", "blue"];
    const { result } = renderHook(() => useAdvancedToggle(states));

    act(() => result.current[1]()); // Toggle to green
    act(() => result.current[1]()); // Toggle to blue
    act(() => result.current[1]()); // Toggle to red
    expect(result.current[0]).toBe("red"); // Should be back to red
  });

  it("should handle states of different types", () => {
    const states = [1, 2, 3];
    const { result } = renderHook(() => useAdvancedToggle(states));

    expect(result.current[0]).toBe(1);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(2);
  });

  it("should handle non-string states", () => {
    const states = [{ color: "red" }, { color: "green" }, { color: "blue" }];
    const { result } = renderHook(() => useAdvancedToggle(states));

    expect(result.current[0]).toEqual({ color: "red" });
    act(() => result.current[1]());
    expect(result.current[0]).toEqual({ color: "green" });
  });
});
