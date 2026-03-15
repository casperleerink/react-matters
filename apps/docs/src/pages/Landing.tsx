import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  type PositionValue,
} from "react-matters";
import NavBody from "../components/NavBody";

const TitleBody = () => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "rectangle",
    x: "50%",
    y: "30%",
    draggable: true,
    rounded: 8,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="px-8 py-4 border-2 border-gray-100 select-none"
    >
      <h1 className="text-2xl font-bold text-gray-100 whitespace-nowrap">
        react-matters
      </h1>
    </div>
  );
};

const DecorativeCircle: React.FC<{ x: PositionValue; y: PositionValue }> = ({ x, y }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x,
    y,
    draggable: true,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="w-8 h-8 border border-gray-600 rounded-full"
    />
  );
};

const circles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: `${Math.round(Math.random() * 100)}%` as PositionValue,
  y: `${Math.round(Math.random() * 50)}%` as PositionValue,
}));

const navLinks = [
  { label: "Dynamic Bodies", route: "dynamic-bodies" },
  { label: "Property Updates", route: "property-updates" },
  { label: "Constraints", route: "constraints" },
  { label: "Collision Filters", route: "collision-filters" },
  { label: "Sensors", route: "sensors" },
];

const NavLinks = () => {
  return (
    <>
      {navLinks.map((link, i) => (
        <NavBody
          key={link.route}
          label={link.label}
          route={link.route}
          x={`${Math.round(15 + (i * 70) / (navLinks.length - 1))}%`}
          y="55%"
        />
      ))}
    </>
  );
};

const DecorativeCircles = () => {
  return (
    <>
      {circles.map((c) => (
        <DecorativeCircle key={c.id} x={c.x} y={c.y} />
      ))}
    </>
  );
};

const Landing = () => {
  return (
    <Container
      className="w-screen h-screen relative bg-gray-900 overflow-hidden"
      style={{ width: "100vw", height: "100vh" }}
      initEngineOptions={{ gravity: { x: 0, y: 1 } }}
    >
      <TitleBody />
      <NavLinks />
      <DecorativeCircles />
      <Bounds />
      <MouseConstraint />
    </Container>
  );
};

export default Landing;
