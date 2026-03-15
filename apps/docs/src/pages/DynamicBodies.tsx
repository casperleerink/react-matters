import { useState, useCallback } from "react";
import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  useContainerSize,
} from "react-matters";
import { useControls, button } from "leva";
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

const DynamicBodiesInner: React.FC<{
  bodies: BodyDef[];
  onRemove: (id: number) => void;
}> = ({ bodies, onRemove }) => {
  return (
    <>
      {bodies.map((body) => (
        <DynamicBody key={body.id} body={body} onRemove={onRemove} />
      ))}
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const DynamicBodies = () => {
  const [bodies, setBodies] = useState<BodyDef[]>([]);

  const addBody = useCallback((type: "circle" | "rectangle") => {
    setBodies((prev) => [
      ...prev,
      {
        id: nextId++,
        type,
        x: 200 + Math.random() * 400,
        y: 60,
      },
    ]);
  }, []);

  const removeBody = useCallback((id: number) => {
    setBodies((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useControls("Bodies", {
    "Add Circle": button(() => addBody("circle")),
    "Add Rectangle": button(() => addBody("rectangle")),
    "Remove Last": button(() => setBodies((prev) => prev.slice(0, -1))),
    "Clear All": button(() => setBodies([])),
    count: { value: bodies.length, editable: false },
  });

  return (
    <Layout title="Dynamic Bodies">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <DynamicBodiesInner bodies={bodies} onRemove={removeBody} />
      </Container>
    </Layout>
  );
};

export default DynamicBodies;
