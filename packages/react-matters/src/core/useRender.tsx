import { Runner, Events } from "matter-js";
import { useEffect, useRef } from "react";
import { useStore, type Element } from "./store";

export const useRender = () => {
  const elementsRef = useRef<Set<Element>>(new Set());
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  elementsRef.current = elements;

  useEffect(() => {
    if (!engine) return;
    const runner = Runner.create();

    Events.on(runner, "afterTick", () => {
      elementsRef.current.forEach((element) => {
        if (element.render) {
          element.render({
            position: element.body.position,
            angle: element.body.angle,
          });
        }
      });
    });

    Runner.run(runner, engine);

    return () => {
      Runner.stop(runner);
      Events.off(runner, "afterTick");
    };
  }, [engine]);
};
