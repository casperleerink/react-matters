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

/**
 * Physics container that wraps your scene. Creates a Matter.js engine,
 * provides physics context to all child components, and tracks the
 * container's dimensions so bodies can be positioned relative to it.
 *
 * Children are only rendered once the container has been measured, so hooks
 * like {@link useBody} always have valid dimensions available.
 *
 * Accepts all standard `<div>` props in addition to its own.
 *
 * @example
 * ```tsx
 * <Container style={{ width: "100%", height: 500 }}>
 *   <Bounds />
 *   <Ball />
 * </Container>
 * ```
 */
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
