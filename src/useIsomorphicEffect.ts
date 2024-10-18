import { useEffect, useLayoutEffect } from "react";

/**
 * useIsomorphicEffect
 * Resolves to useEffect when "window" is not in scope and useLayoutEffect in the browser.
 *
 * @param {Function} callback Callback function to be called on mount
 * @param {Array} deps Optional dependency array to control when the effect runs
 *
 * @example
 * useIsomorphicEffect(() => {
 *   console.log("This will run in the browser or during SSR");
 * }, [someDependency]);
 */
const useIsomorphicEffect = (callback: () => void, deps: any[] = []) => {
  const effect = typeof window === "undefined" ? useEffect : useLayoutEffect;

  effect(callback, deps);
};

export { useIsomorphicEffect };
