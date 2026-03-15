import { useEffect } from "react";
import { usePhysics } from "./PhysicsContext";
import {
  Composite,
  Mouse,
  MouseConstraint as MouseConstraintMatter,
} from "matter-js";

export const MouseConstraint = () => {
  const { engine, containerRef } = usePhysics();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const mouse = Mouse.create(container);
    // @ts-expect-error wheel not specified in matterjs types;
    mouse.element.removeEventListener("wheel", mouse.mousewheel);
    // @ts-expect-error mousemove not specified in matterjs types;
    mouse.element.removeEventListener("touchmove", mouse.mousemove);
    // @ts-expect-error mousemove not specified in matterjs types;
    mouse.element.removeEventListener("touchstart", mouse.mousedown);
    // @ts-expect-error mousemove not specified in matterjs types;
    mouse.element.removeEventListener("touchend", mouse.mouseup);
    const mouseConstraint = MouseConstraintMatter.create(engine, {
      mouse,
    });

    Composite.add(engine.world, mouseConstraint);

    return () => {
      Composite.remove(engine.world, mouseConstraint);
    };
  }, [engine, containerRef]);

  return null;
};
