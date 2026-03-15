import {
  Container,
  Bounds,
  MouseConstraint,
  useBody,
  useContainerSize,
} from "react-matters";
import NavBody from "../components/NavBody";

const TitleBody = () => {
  const [width, height] = useContainerSize();
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "rectangle",
    x: width * 0.5,
    y: height * 0.3,
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

const DecorativeCircle: React.FC<{ x: number; y: number }> = ({ x, y }) => {
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
  x: Math.random(),
  y: Math.random() * 0.5,
}));

const navLinks = [
  { label: "Dynamic Bodies", route: "dynamic-bodies" },
  { label: "Property Updates", route: "property-updates" },
  { label: "Constraints", route: "constraints" },
  { label: "Collision Filters", route: "collision-filters" },
  { label: "Sensors", route: "sensors" },
];

const NavLinks = () => {
  const [width, height] = useContainerSize();

  return (
    <>
      {navLinks.map((link, i) => (
        <NavBody
          key={link.route}
          label={link.label}
          route={link.route}
          x={width * (0.15 + (i * 0.7) / (navLinks.length - 1))}
          y={height * 0.55}
        />
      ))}
    </>
  );
};

const DecorativeCircles = () => {
  const [width, height] = useContainerSize();

  return (
    <>
      {circles.map((c) => (
        <DecorativeCircle
          key={c.id}
          x={width * c.x}
          y={height * c.y}
        />
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
