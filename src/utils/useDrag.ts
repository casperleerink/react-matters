import { useDrag as useDragGesture } from "@use-gesture/react";
import { Body } from "matter-js";
interface Props {
  body: Body;
  enabled: boolean;
}

export const useDrag = ({ body, enabled }: Props) => {
  const bind = useDragGesture(
    ({ delta: [dx, dy], first, last }) => {
      if (first) {
        Body.setStatic(body, true);
      }
      if (last) {
        Body.setStatic(body, false);
      }
      Body.setPosition(body, {
        x: body.position.x + dx,
        y: body.position.y + dy,
      });
    },
    {
      enabled: enabled,
    }
  );
  return bind;
};
