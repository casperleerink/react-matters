import {
  useBody,
  useContainerSize,
} from "../../../packages/react-matters/index";

interface Props {
  position: { x: number; y: number };
}

const Circle: React.FC<Props> = ({ position }) => {
  const [width, height] = useContainerSize();
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    initialPosition: {
      x: width * position.x,
      y: height * position.y,
    },
    draggable: true,
  });
  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="border-gray-100 border p-4 w-16 h-16"
    />
  );
};

export default Circle;
