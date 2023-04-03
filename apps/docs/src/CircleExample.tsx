import {
  Circle,
  useContainerSize,
} from "../../../packages/react-matters/index";

interface Props {}

const CircleExample: React.FC<Props> = ({}) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Circle
      className="w-16 h-16 "
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
          pointB: {
            x: 0,
            y: -30,
          },
        },
        renderProps: {
          strokeWidth: 4,
          className: "stroke-slate-800",
        },
      }}
    >
      <div className="absolute inset-x-4 inset-y-0 bg-slate-400"></div>
    </Circle>
  );
};

export default CircleExample;
