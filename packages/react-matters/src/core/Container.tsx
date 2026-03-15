"use client";
import { type ReactNode, type JSX, useRef, useState } from "react";
import { Engine, type IEngineDefinition } from "matter-js";
import { useSize } from "../utils/useSize";
import { useRender } from "./useRender";
import {
  PhysicsContext,
  ContainerSizeContext,
  type PhysicsContextValue,
} from "./PhysicsContext";
import type { Element } from "./store";

interface Props {
  children: ReactNode;
  initEngineOptions?: IEngineDefinition;
}

export type ContainerProps = Props & JSX.IntrinsicElements["div"];

const RenderLoop = () => {
  useRender();
  return null;
};

export const Container = ({
  children,
  initEngineOptions,
  ...rest
}: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  // Create engine and elements once, synchronously
  const physicsRef = useRef<PhysicsContextValue | null>(null);
  if (!physicsRef.current) {
    physicsRef.current = {
      engine: Engine.create(initEngineOptions),
      elements: new Set<Element>(),
      containerRef,
    };
  }

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [width, height] = useSize(containerRef, (size) => {
    setContainerSize({ width: size.width, height: size.height });
  });

  return (
    <PhysicsContext.Provider value={physicsRef.current}>
      <ContainerSizeContext.Provider value={containerSize}>
        <div ref={containerRef} {...rest}>
          <RenderLoop />
          {width && height ? children : null}
        </div>
      </ContainerSizeContext.Provider>
    </PhysicsContext.Provider>
  );
};
