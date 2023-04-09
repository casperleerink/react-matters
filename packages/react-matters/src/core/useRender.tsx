import { Engine } from "matter-js";
import { useCallback, useEffect, useRef } from "react";
import { useStore } from "./store";

export const useRender = () => {
  const animationFrameRef = useRef<number | undefined>();
  const timeRef = useRef<number>(0);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const tick = useCallback(() => {
    // keep time
    const currentTime = performance.now();
    const delta = currentTime - timeRef.current;
    timeRef.current = currentTime;

    if (engine) {
      // update matter-js engine, maxmimum of 100ms to prevent big jumps
      Engine.update(engine, delta < 100 ? delta : 100);

      //update HTML DOM positions
      elements.forEach((element) => {
        if (element.render) {
          element.render({
            position: element.body.position,
            angle: element.body.angle,
          });
        }
      });
    }
    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, [elements, engine, timeRef.current]);

  useEffect(() => {
    timeRef.current = performance.now();
    tick();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
};
