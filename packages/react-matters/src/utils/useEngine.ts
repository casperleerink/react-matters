import { usePhysics } from "../core/PhysicsContext";

export const useEngine = () => {
  return usePhysics().engine;
};
