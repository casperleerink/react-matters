import { useState, useCallback } from "react";
import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  useContainerSize,
} from "react-matters";
import Layout from "../components/Layout";

interface BodyDef {
  id: number;
  type: "circle" | "rectangle";
  x: number;
  y: number;
}

let nextId = 0;

const DynamicBody: React.FC<{
  body: BodyDef;
  onRemove: (id: number) => void;
}> = ({ body, onRemove }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: body.type,
    x: body.x,
    y: body.y,
    draggable: true,
    rounded: body.type === "circle" ? undefined : 4,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      onClick={() => onRemove(body.id)}
      className={`border border-gray-300 select-none cursor-pointer hover:border-white transition-colors ${
        body.type === "circle" ? "w-12 h-12 rounded-full" : "w-14 h-14"
      }`}
    />
  );
};

const DynamicBodiesInner = () => {
  const [bodies, setBodies] = useState<BodyDef[]>([]);
  const [width] = useContainerSize();

  const addBody = useCallback(
    (type: "circle" | "rectangle") => {
      setBodies((prev) => [
        ...prev,
        {
          id: nextId++,
          type,
          x: width * (0.2 + Math.random() * 0.6),
          y: 60,
        },
      ]);
    },
    [width]
  );

  const removeBody = useCallback((id: number) => {
    setBodies((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const removeLast = useCallback(() => {
    setBodies((prev) => prev.slice(0, -1));
  }, []);

  const clearAll = useCallback(() => {
    setBodies([]);
  }, []);

  return (
    <>
      <div className="fixed top-12 left-4 z-50 flex items-center gap-3">
        <button
          onClick={() => addBody("circle")}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Add Circle
        </button>
        <button
          onClick={() => addBody("rectangle")}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Add Rectangle
        </button>
        <button
          onClick={removeLast}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Remove Last
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Clear All
        </button>
        <span className="text-sm text-gray-400">Count: {bodies.length}</span>
      </div>
      {bodies.map((body) => (
        <DynamicBody key={body.id} body={body} onRemove={removeBody} />
      ))}
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const DynamicBodies = () => {
  return (
    <Layout title="Dynamic Bodies">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <DynamicBodiesInner />
      </Container>
    </Layout>
  );
};

export default DynamicBodies;
