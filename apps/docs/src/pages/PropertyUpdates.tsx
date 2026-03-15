import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  type PositionValue,
} from "react-matters";
import { useControls } from "leva";
import Layout from "../components/Layout";

const Platform: React.FC<{ x: PositionValue; y: PositionValue; w: number }> = ({
  x,
  y,
  w,
}) => {
  const { ref, style } = useBody<HTMLDivElement>({
    type: "rectangle",
    x,
    y,
    isStatic: true,
  });

  return (
    <div
      ref={ref}
      style={{ ...style, width: w, height: 12 }}
      className="bg-gray-600"
    />
  );
};

const FallingBody: React.FC<{ x: PositionValue; y: PositionValue }> = ({ x, y }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x,
    y,
    draggable: true,
    restitution: 0.5,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-10 h-10 border border-gray-500 rounded-full"
    />
  );
};

const TestSubject: React.FC<{
  restitution: number;
  friction: number;
  density: number;
  frictionAir: number;
  isStatic: boolean;
}> = ({ restitution, friction, density, frictionAir, isStatic }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "rectangle",
    x: "50%",
    y: "30%",
    draggable: true,
    rounded: 8,
    restitution,
    friction,
    density,
    frictionAir,
    isStatic,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-20 h-20 border-2 border-yellow-400 flex items-center justify-center select-none"
    >
      <span className="text-yellow-400 text-xs font-bold">TEST</span>
    </div>
  );
};

const fallingBodies = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: `${Math.round(15 + Math.random() * 70)}%` as PositionValue,
  y: `${Math.round(Math.random() * 30)}%` as PositionValue,
}));

const Platforms = () => {
  return (
    <>
      <Platform x="30%" y="60%" w={200} />
      <Platform x="70%" y="75%" w={200} />
    </>
  );
};

const FallingBodies = () => {
  return (
    <>
      {fallingBodies.map((b) => (
        <FallingBody key={b.id} x={b.x} y={b.y} />
      ))}
    </>
  );
};

const PropertyUpdatesInner: React.FC<{
  restitution: number;
  friction: number;
  density: number;
  frictionAir: number;
  isStatic: boolean;
}> = (props) => {
  return (
    <>
      <TestSubject {...props} />
      <Platforms />
      <FallingBodies />
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const PropertyUpdates = () => {
  const { restitution, friction, density, frictionAir, isStatic } = useControls(
    "Physics Properties",
    {
      restitution: { value: 0.5, min: 0, max: 1, step: 0.01 },
      friction: { value: 0.1, min: 0, max: 1, step: 0.01 },
      density: { value: 0.001, min: 0.001, max: 0.05, step: 0.001 },
      frictionAir: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
      isStatic: false,
    },
  );

  return (
    <Layout title="Property Updates">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <PropertyUpdatesInner
          restitution={restitution}
          friction={friction}
          density={density}
          frictionAir={frictionAir}
          isStatic={isStatic}
        />
      </Container>
    </Layout>
  );
};

export default PropertyUpdates;
