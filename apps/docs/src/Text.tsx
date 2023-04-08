import {
  Rectangle,
  useContainerSize,
} from "../../../packages/react-matters/index";

interface Props {
  className?: string;
}

const Text: React.FC<Props> = ({}) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Rectangle
      initialPosition={{ x: width * 0.5, y: height * 0.1 }}
      rounded={4}
      bodyOptions={{
        friction: 0.5,
      }}
      draggable
      className="text-gray-900 px-4 py-1 border border-gray-900 cursor-grab select-none active:cursor-grabbing"
    >
      <p className="text-gray-900">Hello worldsssasdasd!</p>
    </Rectangle>
  );
};

export default Text;
