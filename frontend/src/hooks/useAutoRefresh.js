import { useEffect, useRef } from "react";

/**
 * Calls `fetchFn` immediately, then again:
 *  - every `intervalMs` milliseconds
 *  - whenever the browser tab becomes visible again
 */
export default function useAutoRefresh(fetchFn, intervalMs = 30000) {
  const fn = useRef(fetchFn);
  fn.current = fetchFn;

  useEffect(() => {
    fn.current();

    const timer = setInterval(() => fn.current(), intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") fn.current();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs]);
}
