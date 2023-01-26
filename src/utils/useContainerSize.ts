import { useStore } from "../core/store";

export const useContainerSize = () => {
  const [container] = useStore((state) => state.container);
  return [
    container.x < 1 ? null : container.x,
    container.y < 1 ? null : container.y,
  ];
};
