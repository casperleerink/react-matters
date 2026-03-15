import { useBody, type PositionValue } from "react-matters";

interface Props {
  position: { x: PositionValue; y: PositionValue };
}

const Circle: React.FC<Props> = ({ position }) => {
  const { ref, style, dragControls } = useBody<HTMLDivElement>({
    type: "circle",
    x: position.x,
    y: position.y,
    draggable: true,
  });
  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="border-gray-100 border w-16 h-16"
    />
  );
};

export default Circle;
