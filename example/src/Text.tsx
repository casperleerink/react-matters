import { Rectangle, useContainerSize } from "../../index";

interface Props {
  className?: string;
}

const Text: React.FC<Props> = ({ className = "" }) => {
  const size = useContainerSize();
  if (!size) return null;
  return (
    <Rectangle
      initialPosition={{ x: size[0] * 0.5, y: size[1] * 0.1 }}
      rounded={4}
      bodyOptions={{
        friction: 0.5,
      }}
      className="text-1"
    >
      <p className="">Hello world!</p>
    </Rectangle>
  );
};

export default Text;
