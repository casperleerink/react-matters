"use client";
import React from "react";
import { useRef, useMemo, useEffect } from "react";
import { useStore } from "./store";
import { Engine, type IEngineDefinition } from "matter-js";
import { useSize } from "../utils/useSize";
import { useRender } from "./useRender";

interface Props {
  children: React.ReactNode;
  initEngineOptions?: IEngineDefinition;
}

export type ContainerProps = Props & JSX.IntrinsicElements["div"];

export const Container = ({
  children,
  initEngineOptions,
  ...rest
}: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null!);

  const [engine, setStore] = useStore((state) => state.engine);
  const [width, height] = useSize(containerRef, (size) => {
    setStore({
      container: {
        x: size.width,
        y: size.height,
      },
    });
  });
  useMemo(() => {
    if (!engine) {
      setStore({ engine: Engine.create(initEngineOptions) });
    }
  }, [initEngineOptions]);

  useEffect(() => {
    setStore({ containerElement: containerRef.current });
  }, []);

  useRender();

  return (
    <div ref={containerRef} {...rest}>
      {width && height ? children : null}
    </div>
  );
};
