import {
  Bounds,
  Circle,
  Rectangle,
  MatterContainer,
  MouseConstraint,
  Render,
} from "../../../packages/react-matters/index";
import CircleExample from "./CircleExample";
import Engine from "./Engine";
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
    y: Math.random() * 100 + 100,
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
            y: 1,
          },
        }}
      >
        <Bounds />
        <RectExample />
        {rectangles.map((rectangle) => (
          <Rectangle
            key={rectangle.id}
            initialPosition={{
              x: rectangle.x,
              y: rectangle.y,
            }}
            className="w-16 h-20 bg-slate-600 cursor-grab active:cursor-grabbing"
            draggable
            rounded={rectangle.rounded}
          />
        ))}
        <Text />
        <Render />
        <Engine />
      </MatterContainer>
      <div className="w-full h-screen bg-slate-400"></div>
    </div>
  );
}

export default App;
