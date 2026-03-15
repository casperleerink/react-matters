import { useRef } from "react";
import {
  Constraint,
  Composite,
  Body,
  type IConstraintDefinition,
} from "matter-js";
import { usePhysics } from "./PhysicsContext";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";

interface BodyConstraintProps {
  bodyA: Body;
  bodyB: Body;
  pointA?: { x: number; y: number };
  pointB?: { x: number; y: number };
}

interface WorldConstraintProps {
  bodyA: Body;
  pointB: { x: number; y: number };
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
 *   const { ref: ref, style, matterBody } = useBody<HTMLDivElement>({
 *     type: "circle", x: 200, y: 300,
 *   });
 *
 *   const anchorPoint = { x: 200, y: 100 };
 *
 *   // Physics constraint — renders nothing
 *   useConstraint({
 *     bodyA: matterBody,
 *     pointB: anchorPoint,
 *     stiffness: 1,
 *   });
 *
 *   // You own the visual — use any element you want
 *   return (
 *     <>
 *       <Line from={anchorPoint} to={matterBody.position} />
 *       <div ref={ref} style={style} />
 *     </>
 *   );
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
  const constraintRef = useRef<Constraint | null>(null);

  // Create/recreate constraint when bodies change
  useIsomorphicLayoutEffect(() => {
    const options: IConstraintDefinition = {
      bodyA,
      pointA,
      pointB,
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
    if (pointB !== undefined) c.pointB = pointB;
    if (length !== undefined) c.length = length;
    if (stiffness !== undefined) c.stiffness = stiffness;
    if (damping !== undefined) c.damping = damping;
    if (angularStiffness !== undefined)
      (c as unknown as Record<string, unknown>).angularStiffness =
        angularStiffness;
  }, [
    pointA?.x,
    pointA?.y,
    pointB?.x,
    pointB?.y,
    length,
    stiffness,
    damping,
    angularStiffness,
  ]);

  return constraintRef;
};
