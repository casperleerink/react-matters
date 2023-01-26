"use client";
import React from "react";
import { useRef, useMemo, useEffect } from "react";
import { useStore } from "./store";

import { Engine, type IEngineDefinition } from "matter-js";
import { useSize } from "../utils/useSize";

interface Props {
  children: React.ReactNode;
  engineOptions?: IEngineDefinition;
}

export type ContainerProps = Props & JSX.IntrinsicElements["div"];

export const Container = ({
  children,
  engineOptions,
  ...rest
}: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  const [engine, setStore] = useStore((state) => state.engine);
  useSize(containerRef, (size) => {
    setStore({
      container: {
        x: size.width,
        y: size.height,
      },
    });
  });
  useMemo(() => {
    if (!engine) {
      setStore({ engine: Engine.create(engineOptions) });
    }
  }, [engineOptions]);

  useEffect(() => {
    setStore({ containerElement: containerRef.current });
  }, []);

  return (
    <div ref={containerRef} {...rest}>
      {children}
    </div>
  );
};
