"use client";

import { createContext, useContext, type RefObject } from "react";
import type { Engine } from "matter-js";
import type { Element } from "./store";

export interface PhysicsContextValue {
  engine: Engine;
  elements: Set<Element>;
  containerRef: RefObject<HTMLDivElement>;
}

export const PhysicsContext = createContext<PhysicsContextValue | null>(null);

export function usePhysics(): PhysicsContextValue {
  const ctx = useContext(PhysicsContext);
  if (!ctx) {
    throw new Error("usePhysics must be used within a <Container>");
  }
  return ctx;
}

export interface ContainerSizeContextValue {
  width: number;
  height: number;
}

export const ContainerSizeContext =
  createContext<ContainerSizeContextValue | null>(null);

export function useContainerSizeContext(): ContainerSizeContextValue {
  const ctx = useContext(ContainerSizeContext);
  if (!ctx) {
    throw new Error(
      "useContainerSizeContext must be used within a <Container>",
    );
  }
  return ctx;
}
