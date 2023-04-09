import { CSSProperties, useRef } from "react";
import { type IBodyDefinition } from "matter-js";
import { type Element, useStore } from "./store";
import { useSize } from "../utils/useSize";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
import { addElement, createBody, removeElement } from "../utils/element";
import { useDrag } from "../utils/useDrag";

// TODO: refactor into descriminated union
interface Props {
  type: "rectangle" | "circle";
  className?: string;
  initialPosition: {
    x: number;
    y: number;
  };
  rounded?: number;
  bodyOptions?: IBodyDefinition;
  draggable?: boolean;
}

const commonStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  transformOrigin: "center",
  touchAction: "none",
};

export const useBody = <T extends HTMLElement>({
  type,
  initialPosition,
  rounded = 0,
  bodyOptions,
  draggable,
}: Props) => {
  const ref = useRef<T>(null);
  const [width, height] = useSize(ref);
  const [elements] = useStore((state) => state.elements);
  const [engine] = useStore((state) => state.engine);

  const element = useRef<Element>(
    createBody({
      type,
      width,
      height,
      options: {
        ...bodyOptions,
        chamfer: {
          radius: rounded,
        },
      },
      position: {
        x: initialPosition.x,
        y: initialPosition.y,
      },
      ref: ref,
    })
  );

  useIsomorphicLayoutEffect(() => {
    const newBody = createBody({
      type,
      width,
      height,
      options: {
        ...bodyOptions,
        chamfer: {
          radius: rounded,
        },
      },
      position: {
        x: bodyOptions?.isStatic
          ? initialPosition.x
          : element.current.body.position.x,
        y: bodyOptions?.isStatic
          ? initialPosition.y
          : element.current.body.position.y,
      },
      ref: ref,
    });
    removeElement({ element: element.current, elements, engine });
    element.current = newBody;
    addElement({ element: newBody, elements, engine });

    return () => {
      removeElement({ element: element.current, elements, engine });
    };
  }, [width, height, bodyOptions, initialPosition.x, initialPosition.y]);

  const dragControls = useDrag({
    body: element.current.body,
    enabled: draggable ?? false,
  });

  return {
    ref,
    dragControls,
    style:
      type === "circle"
        ? {
            ...commonStyles,
            borderRadius: "9999px",
            aspectRatio: "1/1",
          }
        : {
            ...commonStyles,
            borderRadius: rounded,
          },
    matterBody: element.current.body,
  };
};
