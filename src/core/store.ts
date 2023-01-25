import Matter, { Engine, type Body } from "matter-js";
import createFastContext from "./createFastContext";
import { Vector2 } from "../types/vector";

export interface Element {
  body: Body;
  render?: ({
    position,
    angle,
  }: {
    position: Matter.Vector;
    angle: number;
  }) => void;
}

export interface Store {
  container: Vector2;
  engine: Engine | null;
  elements: Set<Element>;
  containerElement: HTMLDivElement | null;
}

export const { Provider, useStore } = createFastContext<Store>({
  container: { x: 0, y: 0 },
  engine: null,
  elements: new Set(),
  containerElement: null,
});
