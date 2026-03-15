import { Runner, Events } from "matter-js";
import { useEffect, useRef } from "react";
import { usePhysics } from "./PhysicsContext";
import type { Element } from "./store";

export const useRender = () => {
  const { engine, elements } = usePhysics();
  const elementsRef = useRef<Set<Element>>(elements);

  elementsRef.current = elements;

  useEffect(() => {
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
