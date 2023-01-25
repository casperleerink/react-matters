import {
  Bounds,
  Circle,
  MatterContainer,
  MouseConstraint,
  Render,
} from "../../index";

const circles = new Array(20).fill(null).map((_) => {
  return {
    x: Math.random() * 800,
    y: Math.random() * 500,
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
          key={`${circle.x} - ${circle.y}`}
          className="circle-1"
          initialPosition={circle}
        />
      ))}
      <Render />
    </MatterContainer>
  );
}

export default App;
