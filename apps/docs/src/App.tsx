import Circle from "./Circle";
import { Bounds, Container } from "../../../packages/react-matters/index";
import Engine from "./Engine";
import Text from "./Text";

const circles = new Array(30).fill(null).map((_, idx) => {
  return {
    id: idx,
    x: Math.random(),
    y: Math.random(),
  };
});

function App() {
  return (
    <div className="w-full">
      <Container
        className="w-full h-screen relative bg-gray-900 overflow-hidden"
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
        initEngineOptions={{
          gravity: {
            x: 0,
            y: 1,
          },
        }}
      >
        <Text />

        {circles.map((circle) => (
          <Circle key={circle.id} position={{ x: circle.x, y: circle.y }} />
        ))}
        <Bounds />
        <Engine />
      </Container>
    </div>
  );
}

export default App;
