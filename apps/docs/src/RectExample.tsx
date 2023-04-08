import {
  Circle,
  Rectangle,
  useContainerSize,
} from "../../../packages/react-matters/index";

interface Props {}

const RectExample: React.FC<Props> = ({}) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Rectangle
      className="w-16 h-24 bg-slate-400"
      initialPosition={{
        x: width * 0.5,
        y: height * 0.6,
      }}
      rounded={16}
      constraint={{
        point: {
          x: width * 0.5,
          y: height * 0.5,
        },
        options: {
          stiffness: 0.02,
        },
        renderProps: {
          strokeWidth: 2,
          className: "stroke-slate-400",
        },
      }}
      draggable
    />
  );
};

export default RectExample;
