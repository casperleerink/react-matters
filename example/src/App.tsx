import {
  Bounds,
  Circle,
  Rectangle,
  MatterContainer,
  MouseConstraint,
  Render,
} from "../../index";
import Text from "./Text";

const circles = new Array(20).fill(null).map((_, idx) => {
  return {
    id: idx,
    x: Math.random() * 800,
    y: Math.random() * 500,
  };
});

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
      <Bounds />
      <MouseConstraint />
      {circles.map((circle) => (
        <Circle
          key={circle.id}
          className="circle-1"
          initialPosition={{
            x: circle.x,
            y: circle.y,
          }}
        />
      ))}
      {rectangles.map((rectangle) => (
        <Rectangle
          key={rectangle.id}
          initialPosition={{
            x: rectangle.x,
            y: rectangle.y,
          }}
          className="rectangle-1"
          rounded={rectangle.rounded}
        />
      ))}
      <Text />
      <Render />
    </MatterContainer>
  );
}

export default App;
