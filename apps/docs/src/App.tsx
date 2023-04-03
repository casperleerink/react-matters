import {
  Bounds,
  Circle,
  Rectangle,
  MatterContainer,
  MouseConstraint,
  Render,
} from "../../../packages/react-matters/index";
import CircleExample from "./CircleExample";
import RectExample from "./RectExample";
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
    <div className="w-full">
      <MatterContainer
        className="w-full h-screen relative bg-white overflow-hidden"
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
        {/* <MouseConstraint /> */}
        <CircleExample />
        <RectExample />
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
        <Text />
        <Render />
      </MatterContainer>
      <div className="w-full h-screen bg-slate-400"></div>
    </div>
  );
}

export default App;
