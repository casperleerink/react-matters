import React, { useRef } from "react";
import { type IBodyDefinition } from "matter-js";
import { type Element, useStore } from "../core/store";
import { useSize } from "../utils/useSize";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import {
  addElement,
  ConstraintType,
  createCircle,
  removeElement,
} from "../utils/element";
import { useDrag } from "../utils/useDrag";
import { useContainerSize } from "../utils/useContainerSize";
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
  constraint?: ConstraintType;
}

export const Circle = ({
  className = "",
  style,
  initialPosition,
  children,
  bodyOptions,
  draggable,
  constraint,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null!);
  const lineRef = useRef<SVGLineElement | null>(null);
  const [width, height] = useSize(divRef);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);
  const container = useContainerSize();

  const circle = useRef<Element>(
    createCircle({
      radius: width * 0.5,
      options: bodyOptions,
      position: {
        x: initialPosition.x,
        y: initialPosition.y,
      },
      constraint,
      ref: divRef,
      lineRef,
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
      constraint,
      ref: divRef,
      lineRef,
    });

    removeElement({ element: circle.current, elements, engine });
    circle.current = newCircle;
    addElement({ element: newCircle, elements, engine });
  }, [width, height, bodyOptions, constraint]);

  const bind = useDrag({
    body: circle.current.body,
    enabled: draggable ?? false,
  });

  return (
    <>
      {constraint ? (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            ...constraint.renderProps?.style,
          }}
          pointerEvents="none"
          width={container[0] ?? 0}
          height={container[1] ?? 0}
        >
          <line
            ref={lineRef}
            x1={constraint.point.x}
            y1={constraint.point.y}
            x2={circle.current.body.position.x}
            y2={circle.current.body.position.y}
            {...constraint.renderProps}
          />
        </svg>
      ) : null}
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
    </>
  );
};
