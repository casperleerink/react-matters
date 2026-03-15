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
    ({ delta: [dx, dy], first, last }) => {
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
        Body.setVelocity(body, { x: dx, y: dy });
      }
    },
    {
      enabled,
    }
  );
  return bind;
};
