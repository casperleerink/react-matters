import React, { useRef } from "react";
import { Body, type IBodyDefinition } from "matter-js";
import { type Element, useStore } from "../core/store";
import { useSize } from "../utils/useSize";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import { addElement, createRectangle, removeElement } from "../utils/element";
interface Props {
  className?: string;
  initialPosition: {
    x: number;
    y: number;
  };
  children?: React.ReactNode;
  bodyOptions?: IBodyDefinition;
  visible?: boolean;
  style?: React.CSSProperties;
}

export const Rectangle = ({
  visible = true,
  className = "",
  style,
  initialPosition,
  children,
  bodyOptions,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null!);
  const [width, height] = useSize(divRef);
  console.log(width);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const rectangle = useRef<Element>(
    createRectangle({
      width,
      height,
      options: bodyOptions,
      position: {
        x: initialPosition.x,
        y: initialPosition.y,
      },
      ref: visible ? divRef : undefined,
    })
  );
  useIsomorphicLayoutEffect(() => {
    const newRectangle = createRectangle({
      width,
      height,
      options: bodyOptions,
      position: {
        x: rectangle.current.body.position.x,
        y: rectangle.current.body.position.y,
      },
      ref: visible ? divRef : undefined,
    });
    console.log(newRectangle.body.position.x);

    removeElement({ element: rectangle.current, elements, engine });
    rectangle.current = newRectangle;
    addElement({ element: newRectangle, elements, engine });
  }, [width, height, bodyOptions, initialPosition.x, initialPosition.y]);

  if (!visible) return null;

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
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};