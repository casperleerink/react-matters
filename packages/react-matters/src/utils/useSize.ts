import { RefObject, useCallback, useState } from "react";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useSize<T extends HTMLElement>(
  ref: RefObject<T>,
  updateCallback?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void
) {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Prevent too many rendering using useCallback
  const updateSize = useCallback(() => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth;
    const h = ref.current.offsetHeight;
    setWidth(w);
    setHeight(h);
    if (updateCallback) {
      updateCallback({
        width: w,
        height: h,
      });
    }
  }, [setWidth, setHeight]);

  useIsomorphicLayoutEffect(() => {
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(ref.current!, {
      box: "border-box",
    });
    return () => {
      resizeObserver.unobserve(ref.current!);
      resizeObserver.disconnect();
    };
  }, []);

  return [width, height] as const;
}
