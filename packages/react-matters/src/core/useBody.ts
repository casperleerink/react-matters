import { type CSSProperties, useRef, type RefObject } from "react";
import { Body } from "matter-js";
import { type Element, useStore } from "./store";
import { useSize } from "../utils/useSize";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import { addElement, createBody, removeElement } from "../utils/element";
import { useDrag } from "../utils/useDrag";
import type { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";

interface Props {
  type: "rectangle" | "circle";
  x: number;
  y: number;
  rounded?: number;
  draggable?: boolean;
  // Mutable physics properties (updated via Body.set without recreating)
  isStatic?: boolean;
  isSensor?: boolean;
  friction?: number;
  frictionStatic?: number;
  frictionAir?: number;
  restitution?: number;
  density?: number;
  slop?: number;
  timeScale?: number;
  collisionFilter?: { category?: number; mask?: number; group?: number };
}

const commonStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  transformOrigin: "center",
  touchAction: "none",
  willChange: "transform",
};

type Returns<T> = {
  ref: RefObject<T | null>;
  style: CSSProperties;
  matterBody: Body;
  dragControls: (...args: any[]) => ReactDOMAttributes;
};

export const useBody = <T extends HTMLElement>({
  type,
  x,
  y,
  rounded = 0,
  draggable,
  isStatic,
  isSensor,
  friction,
  frictionStatic,
  frictionAir,
  restitution,
  density,
  slop,
  timeScale,
  collisionFilter,
}: Props): Returns<T> => {
  const ref = useRef<T>(null);
  const [width, height] = useSize(ref);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const bodyOptions: Record<string, unknown> = {
    chamfer: { radius: rounded },
  };
  if (isStatic !== undefined) bodyOptions.isStatic = isStatic;
  if (isSensor !== undefined) bodyOptions.isSensor = isSensor;
  if (friction !== undefined) bodyOptions.friction = friction;
  if (frictionStatic !== undefined) bodyOptions.frictionStatic = frictionStatic;
  if (frictionAir !== undefined) bodyOptions.frictionAir = frictionAir;
  if (restitution !== undefined) bodyOptions.restitution = restitution;
  if (density !== undefined) bodyOptions.density = density;
  if (slop !== undefined) bodyOptions.slop = slop;
  if (timeScale !== undefined) bodyOptions.timeScale = timeScale;
  if (collisionFilter !== undefined) bodyOptions.collisionFilter = collisionFilter;

  const element = useRef<Element>(
    createBody({
      type,
      width,
      height,
      options: bodyOptions,
      position: { x, y },
      ref,
    })
  );

  // Ref to always point to the current body (avoids stale closures in useDrag)
  const bodyRef = useRef<Body>(element.current.body);

  // Recreate body only when geometry changes (type, measured size, chamfer)
  useIsomorphicLayoutEffect(() => {
    const currentBody = element.current.body;
    const position = isStatic
      ? { x, y }
      : { x: currentBody.position.x, y: currentBody.position.y };

    const newElement = createBody({
      type,
      width,
      height,
      options: bodyOptions,
      position,
      ref,
    });

    removeElement({ element: element.current, elements, engine });
    element.current = newElement;
    bodyRef.current = newElement.body;
    addElement({ element: newElement, elements, engine });

    return () => {
      removeElement({ element: element.current, elements, engine });
    };
  }, [type, width, height, rounded]);

  // Update physics properties on existing body without recreating
  useIsomorphicLayoutEffect(() => {
    const body = element.current.body;
    Body.set(body, {
      ...(isStatic !== undefined && { isStatic }),
      ...(isSensor !== undefined && { isSensor }),
      ...(friction !== undefined && { friction }),
      ...(frictionStatic !== undefined && { frictionStatic }),
      ...(frictionAir !== undefined && { frictionAir }),
      ...(restitution !== undefined && { restitution }),
      ...(density !== undefined && { density }),
      ...(slop !== undefined && { slop }),
      ...(timeScale !== undefined && { timeScale }),
      ...(collisionFilter !== undefined && { collisionFilter }),
    });
  }, [
    isStatic,
    isSensor,
    friction,
    frictionStatic,
    frictionAir,
    restitution,
    density,
    slop,
    timeScale,
    collisionFilter?.category,
    collisionFilter?.mask,
    collisionFilter?.group,
  ]);

  const dragControls = useDrag({
    bodyRef,
    enabled: draggable ?? false,
  });

  return {
    ref,
    dragControls,
    style:
      type === "circle"
        ? { ...commonStyles, borderRadius: "9999px", aspectRatio: "1/1" }
        : { ...commonStyles, borderRadius: rounded },
    matterBody: element.current.body,
  };
};
