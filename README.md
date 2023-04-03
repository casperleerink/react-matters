# React Matters

## What is React Matters?

React Matters is a renderer for matter-js enabled rendering React Components as Matter.js bodies.

## How to use:

`npm install react-matters`

### Quick start

```tsx
import {
  Bounds,
  Circle,
  Rectangle,
  MatterContainer,
  MouseConstraint,
  Render,
} from "react-matters";

//example circles
const circles = new Array(20).fill(null).map((_, idx) => {
  return {
    id: idx,
    x: Math.random() * 800,
    y: Math.random() * 500,
  };
});

//example rectangles
const rectangles = new Array(10).fill(null).map((_, idx) => {
  return {
    id: idx,
    x: Math.random() * 800 + 200,
    y: Math.random() * 600 + 100,
    rounded: 8,
  };
});

function App() {
  return (
    <MatterContainer
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "lightgray",
        overflow: "hidden",
      }}
      engineOptions={{
        gravity: {
          x: 0,
          y: 2.2,
        },
      }}
    >
      {/* Bounds is an ease of use component that adds static (unmovable) boundaries around your container */}
      <Bounds />
      {circles.map((circle) => (
        <Circle
          key={circle.id}
          className="w-16 h-16 bg-slate-800"
          initialPosition={{
            x: circle.x,
            y: circle.y,
          }}
          draggable
        />
      ))}
      {rectangles.map((rectangle) => (
        <Rectangle
          key={rectangle.id}
          initialPosition={{
            x: rectangle.x,
            y: rectangle.y,
          }}
          className="w-16 h-20 bg-slate-600"
          rounded={rectangle.rounded}
          draggable
        />
      ))}
      {/* Add Render to animate the scene */}
      <Render />
    </MatterContainer>
  );
}
```
