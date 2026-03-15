import Matter, { type Body, type Constraint } from "matter-js";

export interface Element {
  body: Body;
  render?: ({
    position,
    angle,
  }: {
    position: Matter.Vector;
    angle: number;
  }) => void;
  constraint?: Constraint;
}
