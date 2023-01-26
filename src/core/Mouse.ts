import { useEffect } from "react";
import { useStore } from "./store";
import {
  Composite,
  Mouse,
  MouseConstraint as MouseConstraintMatter,
} from "matter-js";

export const MouseConstraint = () => {
  const [container] = useStore((state) => state.containerElement);
  const [engine] = useStore((state) => state.engine);
  useEffect(() => {
    if (!container || !engine) return;
    const mouse = Mouse.create(container);
    // @ts-expect-error mousewheel not specified in matterjs types;
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    const mouseConstraint = MouseConstraintMatter.create(engine, {
      mouse,
    });
    Composite.add(engine.world, mouseConstraint);

    return () => {
      // @ts-expect-error mouseConstraint not specified in matterjs types;
      Composite.remove(engine.world, mouseConstraint);
    };
  }, [engine, container]);

  return null;
};
