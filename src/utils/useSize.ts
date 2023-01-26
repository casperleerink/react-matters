import { MutableRefObject, useCallback, useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useSize(
  ref: MutableRefObject<HTMLDivElement | null>,
  updateCallback?: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => void
) {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  // Prevent too many rendering using useCallback
  const updateSize = useCallback(() => {
    if (!ref.current) return;
    const { offsetWidth, offsetHeight } = ref.current;
    setWidth(offsetWidth);
    setHeight(offsetHeight);
    if (updateCallback) {
      updateCallback({ width: offsetWidth, height: offsetHeight });
    }
  }, [setWidth, setHeight]);

  const resizeObserver = useRef(new ResizeObserver(updateSize));
  useIsomorphicLayoutEffect(() => {
    updateSize();
    resizeObserver.current.observe(ref.current!, {
      box: "border-box",
    });
    return () => {
      resizeObserver.current.unobserve(ref.current!);
    };
  }, []);

  return [width, height] as const;
}
