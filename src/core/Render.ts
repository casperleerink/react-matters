import { Engine } from "matter-js";
import { useEffect, useRef } from "react";
import { useStore } from "./store";

export const Render = () => {
  const animationFrameRef = useRef<number | undefined>();
  const timeRef = useRef<number>(0);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const tick = () => {
    // keep time
    const currentTime = performance.now();
    const delta = currentTime - timeRef.current;
    timeRef.current = currentTime;

    if (engine) {
      // update matter-js engine
      Engine.update(engine, delta);

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
  };

  useEffect(() => {
    timeRef.current = performance.now();
    tick();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return null;
};
