import { useEffect } from "react";
import { usePhysics } from "./PhysicsContext";
import {
  Composite,
  Mouse,
  MouseConstraint as MouseConstraintMatter,
} from "matter-js";

/**
 * Enables mouse and touch interaction with physics bodies inside the
 * {@link Container}. When mounted, users can click/tap and drag any
 * non-static body.
 *
 * Renders nothing to the DOM. Only one instance should be mounted per
 * container.
 *
 * @example
 * ```tsx
 * <Container style={{ width: "100%", height: 500 }}>
 *   <MouseConstraint />
 *   <Bounds />
 *   <Ball />
 * </Container>
 * ```
 */
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
