import { MutableRefObject, useCallback, useState } from "react";
import useEventListener from "./useEventListerer";

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

  useEventListener("resize", updateSize);

  useIsomorphicLayoutEffect(() => {
    updateSize();
  }, []);

  return [width, height] as const;
}
