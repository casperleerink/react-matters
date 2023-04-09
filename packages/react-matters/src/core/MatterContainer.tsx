"use client";

import React from "react";
import { Container as MatterContainer, ContainerProps } from "./Container";
import { Provider } from "./store";

export const Container = ({ children, ...rest }: ContainerProps) => {
  return (
    <Provider>
      <MatterContainer {...rest}>{children}</MatterContainer>
    </Provider>
  );
};
