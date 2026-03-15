# react-matters

## 0.2.3

### Patch Changes

- Fix `useSize` cleanup calling `unobserve` on null `ref.current` after unmount — `disconnect()` already handles cleanup
- Fix `useConstraint` silently ignoring `pointA`/`pointB` changes — anchor position updates are now applied without recreating the constraint
- Fix `useDrag` throw velocity using single-frame delta instead of smoothed gesture velocity, which caused erratic or dead fling behavior on drag release
- Clean up multiline CSS transform strings in render functions to use single-line format

## 0.2.2

### Patch Changes

- Fix crash caused by undefined body options overwriting Matter.js defaults
  - Fixed `useBody` passing `undefined` values (e.g. `collisionFilter`) to Matter.js body creation, which overwrote internal defaults via `Common.extend` and caused `Detector.canCollide` to crash on `undefined.group`
  - Upgraded dependencies: React 19, Vite 8, TypeScript 5.9, Tailwind 4, tsup 8
