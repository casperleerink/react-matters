import { useRef } from "react";
import {
  Constraint,
  Composite,
  Body,
  type IConstraintDefinition,
} from "matter-js";
import { usePhysics, useContainerSizeContext } from "./PhysicsContext";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import { type PositionValue, resolvePosition } from "../types/position";

interface BodyConstraintProps {
  bodyA: Body;
  bodyB: Body;
  /** Offset from bodyA's center (pixels). */
  pointA?: { x: number; y: number };
  /** Offset from bodyB's center (pixels). */
  pointB?: { x: number; y: number };
}

interface WorldConstraintProps {
  bodyA: Body;
  /**
   * World-anchor point. `x` and `y` accept pixels or a percentage of container
   * width/height (e.g. `{ x: "50%", y: "25%" }`).
   */
  pointB: { x: PositionValue; y: PositionValue };
  pointA?: { x: number; y: number };
}

type Props = (BodyConstraintProps | WorldConstraintProps) & {
  length?: number;
  stiffness?: number;
  damping?: number;
  angularStiffness?: number;
};

/**
 * Creates a physics constraint between two bodies, or between a body and a fixed world point.
 * The constraint is added to the engine world and cleaned up on unmount.
 *
 * This hook handles the physics only — it does not render anything.
 * To visualize the constraint, read the body positions and render your own element.
 *
 * @example
 * ```tsx
 * const Pendulum = () => {
 *   const { ref, style, matterBody } = useBody<HTMLDivElement>({
 *     type: "circle", x: "50%", y: "60%",
 *   });
 *
 *   // pointB accepts percentages for world-anchor constraints
 *   useConstraint({
 *     bodyA: matterBody,
 *     pointB: { x: "50%", y: "20%" },
 *     stiffness: 1,
 *   });
 *
 *   return <div ref={ref} style={style} />;
 * };
 * ```
 */
export const useConstraint = ({
  bodyA,
  bodyB,
  pointA,
  pointB,
  length,
  stiffness,
  damping,
  angularStiffness,
}: Props & { bodyB?: Body }) => {
  const { engine } = usePhysics();
  const { width: containerW, height: containerH } = useContainerSizeContext();
  const constraintRef = useRef<Constraint | null>(null);

  const resolvedPointB = pointB
    ? {
        x: resolvePosition(pointB.x, containerW),
        y: resolvePosition(pointB.y, containerH),
      }
    : undefined;

  // Create/recreate constraint when bodies change
  useIsomorphicLayoutEffect(() => {
    const options: IConstraintDefinition = {
      bodyA,
      pointA,
      pointB: resolvedPointB,
      render: { visible: false },
    };
    if (bodyB) options.bodyB = bodyB;
    if (length !== undefined) options.length = length;
    if (stiffness !== undefined) options.stiffness = stiffness;
    if (damping !== undefined) options.damping = damping;
    if (angularStiffness !== undefined)
      (options as Record<string, unknown>).angularStiffness = angularStiffness;

    const constraint = Constraint.create(options);
    constraintRef.current = constraint;
    Composite.add(engine.world, constraint);

    return () => {
      Composite.remove(engine.world, constraint);
      constraintRef.current = null;
    };
  }, [bodyA, bodyB, engine]);

  // Update mutable properties without recreating
  useIsomorphicLayoutEffect(() => {
    if (!constraintRef.current) return;
    const c = constraintRef.current;
    if (pointA !== undefined) c.pointA = pointA;
    if (resolvedPointB !== undefined) c.pointB = resolvedPointB;
    if (length !== undefined) c.length = length;
    if (stiffness !== undefined) c.stiffness = stiffness;
    if (damping !== undefined) c.damping = damping;
    if (angularStiffness !== undefined)
      (c as unknown as Record<string, unknown>).angularStiffness =
        angularStiffness;
  }, [
    pointA?.x,
    pointA?.y,
    resolvedPointB?.x,
    resolvedPointB?.y,
    length,
    stiffness,
    damping,
    angularStiffness,
  ]);

  return constraintRef;
};
