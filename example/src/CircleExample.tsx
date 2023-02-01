import { Circle, useContainerSize } from "../../index";

interface Props {}

const CircleExample: React.FC<Props> = ({}) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Circle
      className="w-16 h-16 bg-slate-600"
      initialPosition={{
        x: width * 0.45,
        y: 100,
      }}
      constraint={{
        point: {
          x: width * 0.5,
          y: -2,
        },
        options: {
          stiffness: 0.05,
        },
        renderProps: {
          strokeWidth: 4,
          className: "stroke-slate-600",
        },
      }}
      draggable
    />
  );
};

export default CircleExample;
