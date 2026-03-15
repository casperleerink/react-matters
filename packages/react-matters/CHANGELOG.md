# react-matters

## 0.2.2

### Patch Changes

- Fix crash caused by undefined body options overwriting Matter.js defaults
  - Fixed `useBody` passing `undefined` values (e.g. `collisionFilter`) to Matter.js body creation, which overwrote internal defaults via `Common.extend` and caused `Detector.canCollide` to crash on `undefined.group`
  - Upgraded dependencies: React 19, Vite 8, TypeScript 5.9, Tailwind 4, tsup 8
