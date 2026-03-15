import { useState, useRef, useEffect, useCallback } from "react";
import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  useConstraint,
  useContainerSize,
} from "react-matters";
import type { Body } from "matter-js";
import { useControls } from "leva";
import Layout from "../components/Layout";

// --- SVG constraint line visualization ---
const ConstraintLine: React.FC<{
  bodyA: Body;
  pointB?: { x: number; y: number };
  bodyB?: Body;
  color?: string;
}> = ({ bodyA, pointB, bodyB, color = "#6b7280" }) => {
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    let raf: number;
    const update = () => {
      if (!lineRef.current) return;
      const line = lineRef.current;
      line.setAttribute("x1", String(bodyA.position.x));
      line.setAttribute("y1", String(bodyA.position.y));
      if (bodyB) {
        line.setAttribute("x2", String(bodyB.position.x));
        line.setAttribute("y2", String(bodyB.position.y));
      } else if (pointB) {
        line.setAttribute("x2", String(pointB.x));
        line.setAttribute("y2", String(pointB.y));
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [bodyA, bodyB, pointB]);

  return (
    <line
      ref={lineRef}
      stroke={color}
      strokeWidth={2}
      strokeDasharray={bodyB && !pointB ? "4 4" : undefined}
    />
  );
};

// --- 1. Pendulum ---
const Pendulum = () => {
  const [width, height] = useContainerSize();
  const anchorPoint = { x: width * 0.2, y: height * 0.15 };

  const { ref, style, dragControls, matterBody } = useBody<HTMLDivElement>({
    type: "circle",
    x: width * 0.3,
    y: height * 0.35,
    draggable: true,
  });

  useConstraint({
    bodyA: matterBody,
    pointB: anchorPoint,
    stiffness: 1,
  });

  return (
    <>
      <ConstraintLine bodyA={matterBody} pointB={anchorPoint} />
      <circle cx={anchorPoint.x} cy={anchorPoint.y} r={4} fill="#9ca3af" />
      <foreignObject
        x={0}
        y={0}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <div
          ref={ref}
          style={style}
          {...dragControls()}
          className="w-12 h-12 border-2 border-blue-400 rounded-full select-none"
        />
      </foreignObject>
    </>
  );
};

// --- 2. Chain ---
const ChainLink: React.FC<{
  x: number;
  y: number;
  isStatic: boolean;
  onBody: (body: Body) => void;
}> = ({ x, y, isStatic, onBody }) => {
  const { ref, style, dragControls, matterBody } = useBody<HTMLDivElement>({
    type: "circle",
    x,
    y,
    isStatic,
    draggable: !isStatic,
  });

  useEffect(() => {
    onBody(matterBody);
  }, [matterBody, onBody]);

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className={`w-8 h-8 rounded-full border select-none ${
        isStatic ? "border-yellow-400" : "border-green-400"
      }`}
    />
  );
};

const ChainConstraint: React.FC<{ bodyA: Body; bodyB: Body }> = ({
  bodyA,
  bodyB,
}) => {
  useConstraint({
    bodyA,
    bodyB,
    stiffness: 0.8,
    length: 40,
  });
  return null;
};

const CHAIN_COUNT = 6;

const Chain = () => {
  const [width, height] = useContainerSize();
  const bodiesRef = useRef<(Body | null)[]>(new Array(CHAIN_COUNT).fill(null));
  const [ready, setReady] = useState(0);

  const handleBody = useCallback((index: number, body: Body) => {
    bodiesRef.current[index] = body;
    setReady((r) => r + 1);
  }, []);

  const startX = width * 0.45;
  const startY = height * 0.15;

  const allReady = ready >= CHAIN_COUNT;
  const bodies = bodiesRef.current;

  return (
    <>
      {Array.from({ length: CHAIN_COUNT }, (_, i) => (
        <ChainLink
          key={i}
          x={startX + i * 45}
          y={startY}
          isStatic={i === 0}
          onBody={(body) => handleBody(i, body)}
        />
      ))}
      {allReady &&
        bodies.slice(0, -1).map((bodyA, i) => {
          const bodyB = bodies[i + 1];
          if (!bodyA || !bodyB) return null;
          return <ChainConstraint key={i} bodyA={bodyA} bodyB={bodyB} />;
        })}
    </>
  );
};

// --- 3. Spring ---
const Spring: React.FC<{ stiffness: number }> = ({ stiffness }) => {
  const [width, height] = useContainerSize();

  const {
    ref: refA,
    style: styleA,
    dragControls: dragA,
    matterBody: bodyA,
  } = useBody<HTMLDivElement>({
    type: "circle",
    x: width * 0.75,
    y: height * 0.2,
    draggable: true,
  });

  const {
    ref: refB,
    style: styleB,
    dragControls: dragB,
    matterBody: bodyB,
  } = useBody<HTMLDivElement>({
    type: "circle",
    x: width * 0.85,
    y: height * 0.45,
    draggable: true,
  });

  useConstraint({
    bodyA,
    bodyB,
    stiffness,
    length: 100,
    damping: 0.05,
  });

  return (
    <>
      <ConstraintLine bodyA={bodyA} bodyB={bodyB} color="#f472b6" />
      <foreignObject
        x={0}
        y={0}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <div
          ref={refA}
          style={styleA}
          {...dragA()}
          className="w-12 h-12 border-2 border-pink-400 rounded-full select-none"
        />
        <div
          ref={refB}
          style={styleB}
          {...dragB()}
          className="w-12 h-12 border-2 border-pink-400 rounded-full select-none"
        />
      </foreignObject>
    </>
  );
};

const ConstraintsInner: React.FC<{ springStiffness: number }> = ({
  springStiffness,
}) => {
  return (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <Pendulum />
        <Spring stiffness={springStiffness} />
      </svg>
      <Chain />
      <Bounds />
      <MouseConstraint />
    </>
  );
};

const Constraints = () => {
  const { springStiffness } = useControls("Spring", {
    springStiffness: { value: 0.02, min: 0.005, max: 0.2, step: 0.005 },
  });

  return (
    <Layout title="Constraints">
      <Container
        className="w-full h-full relative overflow-hidden"
        initEngineOptions={{ gravity: { x: 0, y: 1 } }}
      >
        <ConstraintsInner springStiffness={springStiffness} />
      </Container>
    </Layout>
  );
};

export default Constraints;
