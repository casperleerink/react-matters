import React, { useRef } from "react";
import { type IBodyDefinition } from "matter-js";
import { type Element, useStore } from "../core/store";
import { useSize } from "../utils/useSize";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import { addElement, createCircle, removeElement } from "../utils/element";
import { useDrag } from "../utils/useDrag";
interface Props {
  className?: string;
  style?: React.CSSProperties;
  initialPosition: {
    x: number;
    y: number;
  };
  children?: React.ReactNode;
  bodyOptions?: IBodyDefinition;
  draggable?: boolean;
}

export const Circle = ({
  className = "",
  style,
  initialPosition,
  children,
  bodyOptions,
  draggable,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null!);
  const [width, height] = useSize(divRef);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const circle = useRef<Element>(
    createCircle({
      radius: width * 0.5,
      options: bodyOptions,
      position: {
        x: initialPosition.x,
        y: initialPosition.y,
      },
      ref: divRef,
    })
  );
  useIsomorphicLayoutEffect(() => {
    const newCircle = createCircle({
      radius: width * 0.5,
      options: bodyOptions,
      position: {
        x: circle.current.body.position.x,
        y: circle.current.body.position.y,
      },
      ref: divRef,
    });

    removeElement({ element: circle.current, elements, engine });
    circle.current = newCircle;
    addElement({ element: newCircle, elements, engine });
  }, [width, height, bodyOptions]);

  const bind = useDrag({
    body: circle.current.body,
    enabled: draggable ?? false,
  });

  return (
    <div
      ref={divRef}
      style={{
        transform: `translate(${initialPosition.x - width * 0.5}px, ${
          initialPosition.y - height * 0.5
        }px) rotate(0deg)`,
        transformOrigin: "center",
        position: "absolute",
        top: 0,
        left: 0,
        aspectRatio: "1/1",
        borderRadius: "9999px",
        touchAction: "none",
        ...style,
      }}
      className={className}
      {...bind()}
    >
      {children}
    </div>
  );
};
