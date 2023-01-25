import type { Element } from "../core/store";
import Matter, {
  type Engine,
  Composite,
  Bodies,
  IBodyDefinition,
} from "matter-js";
import { Vector2 } from "../types/vector";

interface Props {
  element: Element;
  elements: Set<Element>;
  engine: Engine | null;
}

export const addElement = ({ element, elements, engine }: Props) => {
  if (!engine) return null;
  elements.add(element);
  Composite.add(engine.world, element.body);
};

export const removeElement = ({ element, elements, engine }: Props) => {
  if (!engine) return null;
  elements.delete(element);
  Composite.remove(engine.world, element.body);
};

interface CircleProps {
  position: Vector2;
  radius: number;
  options?: IBodyDefinition;
  ref?: React.MutableRefObject<HTMLElement>;
}

export const createCircle = ({
  position,
  radius,
  options,
  ref,
}: CircleProps): Element => {
  return {
    body: Bodies.circle(position.x, position.y, radius, options),
    render: ref
      ? ({ position, angle }) => {
          if (!ref.current) return;
          ref.current.style.transform = `translate(
        ${position.x - radius}px,
        ${position.y - radius}px
        )
        rotate(${angle}rad)`;
        }
      : undefined,
  };
};

interface RectangleProps {
  position: Vector2;
  width: number;
  height: number;
  options?: Matter.IChamferableBodyDefinition;
  ref?: React.MutableRefObject<HTMLElement>;
}

export const createRectangle = ({
  position,
  width,
  height,
  options,
  ref,
}: RectangleProps): Element => {
  return {
    body: Bodies.rectangle(position.x, position.y, width, height, options),
    render: ref
      ? ({ position, angle }) => {
          if (!ref.current) return;
          ref.current.style.transform = `translate(
        ${position.x - width * 0.5}px,
        ${position.y - height * 0.5}px
        )
        rotate(${angle}rad)`;
        }
      : undefined,
  };
};
