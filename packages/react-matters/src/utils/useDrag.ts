import { useDrag as useDragGesture } from "@use-gesture/react";
import { Body } from "matter-js";
import { useRef, type RefObject } from "react";

interface Props {
  bodyRef: RefObject<Body | null>;
  enabled: boolean;
}

export const useDrag = ({ bodyRef, enabled }: Props) => {
  const wasStaticRef = useRef(false);
  const bind = useDragGesture(
    ({
      delta: [dx, dy],
      velocity: [vx, vy],
      direction: [dirX, dirY],
      first,
      last,
    }) => {
      const body = bodyRef.current;
      if (!body) return;
      if (first) {
        wasStaticRef.current = body.isStatic;
        Body.setStatic(body, true);
      }
      Body.setPosition(body, {
        x: body.position.x + dx,
        y: body.position.y + dy,
      });
      if (last) {
        Body.setStatic(body, wasStaticRef.current);
        // velocity from @use-gesture is in px/ms (always positive), direction gives the sign.
        // Matter.js expects px/tick (~16.67ms at 60fps).
        const scale = 1000 / 60;
        Body.setVelocity(body, {
          x: vx * dirX * scale,
          y: vy * dirY * scale,
        });
      }
    },
    {
      enabled,
    },
  );
  return bind;
};
