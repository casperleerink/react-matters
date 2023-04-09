import { Bodies } from "matter-js";
import { useStore } from "./store";
import { useEffect, useRef } from "react";
import type { Element } from "./store";
import { addElement, removeElement } from "../utils/element";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";

interface Props {
  restitution?: number;
  friction?: number;
}

const getRects = (width: number, height: number) => {
  const rects = [
    {
      id: 0,
      x: width * 0.5,
      y: height + 100,
      width: width,
      height: 200,
    },
    {
      id: 1,
      x: width * 0.5,
      y: -100,
      width: width,
      height: 200,
    },
    {
      id: 2,
      x: -100,
      y: height * 0.5,
      width: 200,
      height: height,
    },
    {
      id: 3,
      x: width + 100,
      y: height * 0.5,
      width: 200,
      height: height,
    },
  ];

  return rects;
};

export const Bounds = ({ restitution = 0.0, friction = 0.5 }: Props) => {
  const [{ x: width, y: height }] = useStore((state) => state.container);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const elementsRef = useRef<Element[]>(
    getRects(width, height).map((rect) => {
      return {
        body: Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, {
          restitution,
          friction,
          isStatic: true,
        }),
      };
    })
  );

  useIsomorphicLayoutEffect(() => {
    if (!engine) return;
    const rects = getRects(width, height);
    rects.forEach((rect) => {
      const body = Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, {
        restitution,
        friction,
        isStatic: true,
      });
      const newElement = {
        body,
      };

      removeElement({
        element: elementsRef.current[rect.id] as Element,
        elements,
        engine,
      });
      elementsRef.current[rect.id] = newElement;
      addElement({
        element: newElement,
        engine,
        elements,
      });
    });

    return () => {
      elementsRef.current.forEach((element) => {
        removeElement({
          element,
          elements,
          engine,
        });
      });
    };
  }, [width, height, engine, elements]);
  return null;
};
