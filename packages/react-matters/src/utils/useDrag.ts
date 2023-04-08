import { useDrag as useDragGesture } from "@use-gesture/react";
import { Body } from "matter-js";
import { useRef } from "react";
interface Props {
  body: Body;
  enabled: boolean;
}

export const useDrag = ({ body, enabled }: Props) => {
  const previousDelta = useRef({ x: 0, y: 0 });
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
      Body.setVelocity(body, previousDelta.current);
      previousDelta.current.x = dx;
      previousDelta.current.y = dy;
    },
    {
      enabled: enabled,
    }
  );
  return bind;
};
