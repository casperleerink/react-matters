# React Matters

React bindings for [Matter.js](https://brm.io/matter-js/) — render any React component as a physics body.

## Installation

```bash
npm install react-matters matter-js
```

## Quick Start

```tsx
import { Container, Bounds, MouseConstraint, useBody } from "react-matters";

const Ball = ({ x, y }: { x: number; y: number }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x,
    y,
    draggable: true,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-16 h-16 bg-slate-800 rounded-full"
    />
  );
};

const Box = ({ x, y }: { x: number; y: number }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "rectangle",
    x,
    y,
    rounded: 8,
    draggable: true,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-16 h-20 bg-slate-600"
    />
  );
};

function App() {
  return (
    <Container
      style={{ width: "100vw", height: "100vh", position: "relative" }}
      initEngineOptions={{ gravity: { x: 0, y: 2 } }}
    >
      <Ball x={200} y={100} />
      <Ball x={400} y={150} />
      <Box x={300} y={200} />
      <Bounds />
      <MouseConstraint />
    </Container>
  );
}
```

## API

### `<Container>`

Wraps your physics scene. All hooks must be used inside a `Container`.

| Prop | Type | Description |
| --- | --- | --- |
| `initEngineOptions` | `IEngineDefinition` | Initial Matter.js engine options (e.g. gravity) |
| `...rest` | `div` props | Passed through to the wrapper `<div>` |

### `useBody<T>(props)`

Creates a physics body from any HTML element. Returns `{ ref, style, matterBody, dragControls }`.

| Prop | Type | Description |
| --- | --- | --- |
| `type` | `"rectangle" \| "circle"` | Body shape |
| `x` | `number` | Initial x position |
| `y` | `number` | Initial y position |
| `rounded` | `number` | Corner radius (rectangles) or chamfer (circles) |
| `draggable` | `boolean` | Enable drag interaction |
| `isStatic` | `boolean` | Fixed in place |
| `isSensor` | `boolean` | Detects collisions without physical response |
| `friction` | `number` | Surface friction |
| `frictionStatic` | `number` | Static friction |
| `frictionAir` | `number` | Air resistance |
| `restitution` | `number` | Bounciness |
| `density` | `number` | Body density |
| `slop` | `number` | Collision slop tolerance |
| `timeScale` | `number` | Per-body time scaling |
| `collisionFilter` | `{ category?, mask?, group? }` | Collision filtering |

### `useConstraint(props)`

Creates a physics constraint between two bodies, or between a body and a world point. Returns a ref to the Matter.js constraint.

```tsx
// Pin body to a world point
useConstraint({ bodyA: matterBody, pointB: { x: 200, y: 100 }, stiffness: 1 });

// Connect two bodies with a spring
useConstraint({ bodyA: bodyA, bodyB: bodyB, stiffness: 0.02, length: 100 });
```

| Prop | Type | Description |
| --- | --- | --- |
| `bodyA` | `Body` | First body |
| `bodyB` | `Body` | Second body (omit for world constraint) |
| `pointA` | `{ x, y }` | Anchor offset on bodyA |
| `pointB` | `{ x, y }` | Anchor offset on bodyB, or world point if no bodyB |
| `length` | `number` | Rest length |
| `stiffness` | `number` | Stiffness (0–1) |
| `damping` | `number` | Damping (0–1) |
| `angularStiffness` | `number` | Angular stiffness |

### `<Bounds>`

Adds invisible static walls around the container edges.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `restitution` | `number` | `0` | Wall bounciness |
| `friction` | `number` | `0.5` | Wall friction |

### `<MouseConstraint>`

Enables mouse/pointer interaction with physics bodies (click and drag any body).

### `useContainerSize()`

Returns `[width, height]` of the container.

### `useEngine()`

Returns the Matter.js `Engine` instance for advanced use cases.
