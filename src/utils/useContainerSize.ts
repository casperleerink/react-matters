import { useStore } from "../core/store";

export const useContainerSize = () => {
  const [container] = useStore((state) => state.container);
  if (container.x < 1 || container.y < 1) {
    return undefined;
  }
  return [container.x, container.y];
};
