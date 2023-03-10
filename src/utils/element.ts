import type { Element } from "../core/store";
import Matter, {
  type Engine,
  Composite,
  Bodies,
  type IBodyDefinition,
  Constraint,
  type IConstraintDefinition,
} from "matter-js";
import { Vector2 } from "../types/vector";
import { SVGProps } from "react";

interface Props {
  element: Element;
  elements: Set<Element>;
  engine: Engine | null;
}

export const addElement = ({ element, elements, engine }: Props) => {
  if (!engine) return null;
  elements.add(element);
  if (element.constraint) {
    Composite.add(engine.world, element.constraint);
  }
  Composite.add(engine.world, element.body);
};

export const removeElement = ({ element, elements, engine }: Props) => {
  if (!engine) return null;
  elements.delete(element);
  if (element.constraint) {
    Composite.remove(engine.world, element.constraint);
  }
  Composite.remove(engine.world, element.body);
};

export interface ConstraintType {
  point: Vector2;
  options?: Omit<IConstraintDefinition, "bodyA" | "bodyB" | "render">;
  renderProps?: Omit<SVGProps<SVGLineElement>, "x1" | "y1" | "x2" | "y2">;
}

interface CircleProps {
  position: Vector2;
  radius: number;
  options?: IBodyDefinition;
  constraint?: ConstraintType;
  ref?: React.MutableRefObject<HTMLElement>;
  lineRef?: React.MutableRefObject<SVGLineElement | null>;
}

export const createCircle = ({
  position,
  radius,
  options,
  constraint,
  ref,
  lineRef,
}: CircleProps): Element => {
  const circle = Bodies.circle(position.x, position.y, radius, options);
  return {
    body: circle,
    constraint: constraint
      ? Constraint.create({
          ...constraint.options,
          pointA: constraint.point,
          bodyB: circle,
        })
      : undefined,
    render: ref
      ? ({ position, angle }) => {
          if (!ref.current) return;
          ref.current.style.transform = `translate(
        ${position.x - radius}px,
        ${position.y - radius}px
        )
        rotate(${angle}rad)`;
          if (lineRef?.current && constraint) {
            const line = lineRef.current;
            line.setAttribute("x2", `${position.x}`);
            line.setAttribute("y2", `${position.y}`);
          }
        }
      : undefined,
  };
};

interface RectangleProps {
  position: Vector2;
  width: number;
  height: number;
  options?: Matter.IChamferableBodyDefinition;
  constraint?: ConstraintType;
  ref?: React.MutableRefObject<HTMLElement>;
  lineRef?: React.MutableRefObject<SVGLineElement | null>;
}

export const createRectangle = ({
  position,
  width,
  height,
  options,
  constraint,
  ref,
  lineRef,
}: RectangleProps): Element => {
  const rect = Bodies.rectangle(position.x, position.y, width, height, options);
  return {
    body: rect,
    constraint: constraint
      ? Constraint.create({
          ...constraint.options,
          pointA: constraint.point,
          bodyB: rect,
        })
      : undefined,
    render: ref
      ? ({ position, angle }) => {
          if (!ref.current) return;
          ref.current.style.transform = `translate(
        ${position.x - width * 0.5}px,
        ${position.y - height * 0.5}px
        )
        rotate(${angle}rad)`;
          if (lineRef?.current && constraint) {
            const line = lineRef.current;
            line.setAttribute("x2", `${position.x}`);
            line.setAttribute("y2", `${position.y}`);
          }
        }
      : undefined,
  };
};
