import { useContainerSize, useBody } from "react-matters";

interface Props {
  className?: string;
}

const Text: React.FC<Props> = ({ className }) => {
  const [width, height] = useContainerSize();

  const { style, ref, dragControls } = useBody<HTMLDivElement>({
    type: "rectangle",
    x: width * 0.5,
    y: height * 0.5,
    rounded: 8,
    draggable: true,
  });

  return (
    <div
      ref={ref}
      style={style}
      {...dragControls()}
      className="px-8 py-4 border border-gray-100 select-none"
    >
      <p className="text-gray-100">Hello world!</p>
    </div>
  );
};

export default Text;
