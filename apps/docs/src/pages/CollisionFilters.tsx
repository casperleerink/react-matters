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

const GROUPS = [
  { name: "Red", category: 0x0001, color: "border-red-400", bg: "bg-red-400" },
  {
    name: "Green",
    category: 0x0002,
    color: "border-green-400",
    bg: "bg-green-400",
  },
  {
    name: "Blue",
    category: 0x0004,
    color: "border-blue-400",
    bg: "bg-blue-400",
  },
] as const;

interface BodyDef {
  id: number;
  x: number;
  y: number;
  category: number;
  colorClass: string;
}

let nextId = 0;

const FilteredBody: React.FC<{ body: BodyDef }> = ({ body }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x: body.x,
    y: body.y,
    draggable: true,
    collisionFilter: {
      category: body.category,
      mask: body.category, // only collide with same category
    },
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className={`w-10 h-10 rounded-full border-2 ${body.colorClass} select-none`}
    />
  );
};

const CollisionFiltersInner: React.FC<{
  bodies: BodyDef[];
}> = ({ bodies }) => {
  return (
    <>
      {bodies.map((body) => (
        <FilteredBody key={body.id} body={body} />
      ))}
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const CollisionFilters = () => {
  const [bodies, setBodies] = useState<BodyDef[]>([]);

  const spawnGroup = useCallback((groupIndex: number) => {
    const group = GROUPS[groupIndex];
    setBodies((prev) => [
      ...prev,
      {
        id: nextId++,
        x: 200 + Math.random() * 400,
        y: 50,
        category: group.category,
        colorClass: group.color,
      },
    ]);
  }, []);

  useControls("Spawn", {
    "Spawn Red": button(() => spawnGroup(0)),
    "Spawn Green": button(() => spawnGroup(1)),
    "Spawn Blue": button(() => spawnGroup(2)),
  });

  return (
    <Layout title="Collision Filters">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <CollisionFiltersInner bodies={bodies} />
      </Container>
    </Layout>
  );
};

export default CollisionFilters;
