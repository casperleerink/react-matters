import { useState, useEffect, useCallback } from "react";
import { Events } from "matter-js";
import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  useContainerSize,
  useEngine,
} from "react-matters";
import Layout from "../components/Layout";

interface BodyDef {
  id: number;
  x: number;
  y: number;
}

let nextId = 0;

const SensorZone: React.FC<{ overlapCount: number }> = ({ overlapCount }) => {
  const [width, height] = useContainerSize();
  const { ref, style } = useBody<HTMLDivElement>({
    type: "rectangle",
    x: width * 0.5,
    y: height * 0.55,
    isStatic: true,
    isSensor: true,
  });

  const bgColor =
    overlapCount === 0
      ? "border-gray-500"
      : overlapCount <= 2
        ? "border-yellow-400"
        : "border-red-400";

  return (
    <div
      ref={ref}
      style={{ ...style, width: 200, height: 200 }}
      className={`border-2 ${bgColor} flex items-center justify-center select-none transition-colors`}
    >
      <span className="text-xs text-gray-300">
        Sensor {overlapCount > 0 ? `(${overlapCount})` : ""}
      </span>
    </div>
  );
};

const FallingBody: React.FC<{ body: BodyDef }> = ({ body }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x: body.x,
    y: body.y,
    draggable: true,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-10 h-10 rounded-full border border-blue-400 select-none"
    />
  );
};

const SensorTracker: React.FC<{
  onOverlapChange: (count: number) => void;
}> = ({ onOverlapChange }) => {
  const engine = useEngine();

  useEffect(() => {
    if (!engine) return;
    const overlapping = new Set<number>();

    const onStart = (event: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of event.pairs) {
        if (pair.bodyA.isSensor || pair.bodyB.isSensor) {
          const other = pair.bodyA.isSensor ? pair.bodyB : pair.bodyA;
          overlapping.add(other.id);
          onOverlapChange(overlapping.size);
        }
      }
    };

    const onEnd = (event: Matter.IEventCollision<Matter.Engine>) => {
      for (const pair of event.pairs) {
        if (pair.bodyA.isSensor || pair.bodyB.isSensor) {
          const other = pair.bodyA.isSensor ? pair.bodyB : pair.bodyA;
          overlapping.delete(other.id);
          onOverlapChange(overlapping.size);
        }
      }
    };

    Events.on(engine, "collisionStart", onStart);
    Events.on(engine, "collisionEnd", onEnd);

    return () => {
      Events.off(engine, "collisionStart", onStart);
      Events.off(engine, "collisionEnd", onEnd);
    };
  }, [engine, onOverlapChange]);

  return null;
};

const SensorsInner: React.FC<{
  bodies: BodyDef[];
  overlapCount: number;
  onOverlapChange: (count: number) => void;
}> = ({ bodies, overlapCount, onOverlapChange }) => {
  return (
    <>
      <SensorZone overlapCount={overlapCount} />
      <SensorTracker onOverlapChange={onOverlapChange} />
      {bodies.map((body) => (
        <FallingBody key={body.id} body={body} />
      ))}
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const Sensors = () => {
  const [bodies, setBodies] = useState<BodyDef[]>([]);
  const [overlapCount, setOverlapCount] = useState(0);

  const spawnBody = useCallback(() => {
    setBodies((prev) => [
      ...prev,
      {
        id: nextId++,
        x: 150 + Math.random() * 500,
        y: 50,
      },
    ]);
  }, []);

  const handleOverlapChange = useCallback((count: number) => {
    setOverlapCount(count);
  }, []);

  return (
    <Layout title="Sensors">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <SensorsInner
          bodies={bodies}
          overlapCount={overlapCount}
          onOverlapChange={handleOverlapChange}
        />
      </Container>
      <div className="fixed top-12 left-4 z-50 flex items-center gap-3">
        <button
          onClick={spawnBody}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Spawn Body
        </button>
        <span className="text-xs text-gray-400">
          Bodies inside sensor: {overlapCount}
        </span>
      </div>
    </Layout>
  );
};

export default Sensors;
