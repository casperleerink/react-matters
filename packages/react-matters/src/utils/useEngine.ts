import { useStore } from "../core/store";

export const useEngine = () => {
  const [engine] = useStore((state) => state.engine);
  return engine;
};
