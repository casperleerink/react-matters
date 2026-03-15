/** A percentage string like `"50%"` */
export type Percentage = `${number}%`;

/** A position value: absolute pixels or a percentage of the container dimension */
export type PositionValue = number | Percentage;

/**
 * Resolves a {@link PositionValue} to absolute pixels.
 *
 * - `number` → returned as-is.
 * - `"50%"` → `containerDimension * 0.5`.
 */
export function resolvePosition(
  value: PositionValue,
  containerDimension: number,
): number {
  if (typeof value === "number") return value;
  return (parseFloat(value) / 100) * containerDimension;
}
