import { useStore } from "../core/store";
import React from "react";
import { Rectangle } from "./Rectangle";

interface Props {
  restitution?: number;
  friction?: number;
}

const getRects = (width: number, height: number) => {
  const rects = [
    {
      id: "1",
      x: width * 0.5,
      y: height + 100,
      width: width,
      height: 200,
    },
    {
      id: "2",
      x: width * 0.5,
      y: -100,
      width: width,
      height: 200,
    },
    {
      id: "3",
      x: -100,
      y: height * 0.5,
      width: 200,
      height: height,
    },
    {
      id: "4",
      x: width + 100,
      y: height * 0.5,
      width: 200,
      height: height,
    },
  ];

  return rects;
};

export const Bounds = ({ restitution = 0.0, friction = 0.5 }: Props) => {
  const [container] = useStore((state) => state.container);
  const { x: width, y: height } = container;

  if (width <= 1 || height <= 1) return null;
  const rects = getRects(width, height);
  return (
    <>
      {rects.map((rect) => {
        return (
          <Rectangle
            key={rect.id}
            initialPosition={{
              x: rect.x,
              y: rect.y,
            }}
            bodyOptions={{
              isStatic: true,
              restitution,
              friction,
            }}
            style={{
              width: `${rect.width}px`,
              height: `${rect.height}px`,
            }}
            visible={false}
          />
        );
      })}
    </>
  );
};
