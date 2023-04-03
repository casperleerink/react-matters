"use client";

import React from "react";
import { Container, ContainerProps } from "./Container";
import { Provider } from "./store";

export const MatterContainer = ({ children, ...rest }: ContainerProps) => {
  return (
    <Provider>
      <Container {...rest}>{children}</Container>
    </Provider>
  );
};
