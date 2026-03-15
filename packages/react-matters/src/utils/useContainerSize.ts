import { useContainerSizeContext } from "../core/PhysicsContext";

export const useContainerSize = () => {
  const { width, height } = useContainerSizeContext();
  return [width, height];
};
