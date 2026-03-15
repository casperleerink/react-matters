import { usePhysics } from "../core/PhysicsContext";

/**
 * Returns the Matter.js `Engine` instance from the nearest {@link Container}.
 * Use this for advanced scenarios like listening to collision events or
 * applying forces directly.
 *
 * Must be used inside a `<Container>`.
 *
 * @example
 * ```tsx
 * const CollisionLogger = () => {
 *   const engine = useEngine();
 *
 *   useEffect(() => {
 *     const handler = (event: Matter.IEventCollision<Matter.Engine>) => {
 *       console.log("collision", event.pairs);
 *     };
 *     Matter.Events.on(engine, "collisionStart", handler);
 *     return () => Matter.Events.off(engine, "collisionStart", handler);
 *   }, [engine]);
 *
 *   return null;
 * };
 * ```
 */
export const useEngine = () => {
  return usePhysics().engine;
};
