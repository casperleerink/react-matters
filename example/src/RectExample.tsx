import { Circle, Rectangle, useContainerSize } from "../../index";

interface Props {}

const RectExample: React.FC<Props> = ({}) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Rectangle
      className="w-16 h-24 bg-slate-400"
      initialPosition={{
        x: width * 0.15,
        y: 200,
      }}
      rounded={16}
      constraint={{
        point: {
          x: 0,
          y: 400,
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
