import { renderHook } from "@testing-library/react-hooks";
import { useIsomorphicEffect } from "../src/useIsomorphicEffect";

describe("useIsomorphicEffect", () => {
  const useEffectCallback = jest.fn();
  const useLayoutEffectCallback = jest.fn();

  afterEach(() => {
    // Clear mock calls after each test
    useEffectCallback.mockClear();
    useLayoutEffectCallback.mockClear();
  });

  test("should use useEffect when window is undefined", () => {
    const originalWindow = global.window;
    global.window = undefined as unknown as Window & typeof globalThis;

    renderHook(() => {
      useIsomorphicEffect(() => {
        useEffectCallback();
      });
    });

    expect(useEffectCallback).toHaveBeenCalled();
    global.window = originalWindow;
  });

  test("should use useLayoutEffect when window is defined", () => {
    if (typeof global.window === "undefined") {
      global.window = {
        document: {} as Document,
        location: {},
        navigator: {},
      } as Window & typeof globalThis;
    }

    renderHook(() => {
      useIsomorphicEffect(() => {
        useLayoutEffectCallback();
      });
    });

    expect(useLayoutEffectCallback).toHaveBeenCalled();
  });

  test("should call callback when dependencies change", () => {
    let count = 0;
    const { rerender } = renderHook(
      ({ value }) => {
        useIsomorphicEffect(() => {
          count++;
        }, [value]);
      },
      { initialProps: { value: 1 } }
    );

    expect(count).toBe(1);

    rerender({ value: 2 });
    expect(count).toBe(2);

    rerender({ value: 2 }); // Should not increment
    expect(count).toBe(2);
  });

  test("should not call the effect callback if dependencies are the same", () => {
    const { rerender } = renderHook(
      ({ value }) => {
        useIsomorphicEffect(() => {
          useLayoutEffectCallback();
        }, [value]);
      },
      { initialProps: { value: 1 } }
    );

    expect(useLayoutEffectCallback).toHaveBeenCalledTimes(1); // First render

    rerender({ value: 1 }); // Same value, should not call again
    expect(useLayoutEffectCallback).toHaveBeenCalledTimes(1);
  });

  test("should handle an empty callback and dependency array", () => {
    renderHook(() => {
      useIsomorphicEffect(() => {}, []);
    });

    // Should not throw errors or call any callbacks
    expect(useEffectCallback).not.toHaveBeenCalled();
    expect(useLayoutEffectCallback).not.toHaveBeenCalled();
  });
});
