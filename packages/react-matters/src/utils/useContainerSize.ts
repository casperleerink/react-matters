import { useStore } from "../core/store";

export const useContainerSize = () => {
  const [container] = useStore((state) => state.container);
  return [container.x, container.y];
};
