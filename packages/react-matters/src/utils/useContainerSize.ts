import { useContainerSizeContext } from "../core/PhysicsContext";

/**
 * Returns the current `[width, height]` of the nearest {@link Container}.
 * Useful for positioning bodies relative to the container or building
 * responsive layouts.
 *
 * Must be used inside a `<Container>`.
 *
 * @example
 * ```tsx
 * const ResponsiveBall = () => {
 *   const [width, height] = useContainerSize();
 *   const { ref, style } = useBody<HTMLDivElement>({
 *     type: "circle",
 *     x: width / 2,
 *     y: height / 4,
 *   });
 *   return <div ref={ref} style={{ ...style, width: 40, height: 40 }} />;
 * };
 * ```
 */
export const useContainerSize = () => {
  const { width, height } = useContainerSizeContext();
  return [width, height];
};
