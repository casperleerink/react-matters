import { Rectangle, useContainerSize } from "../../index";

interface Props {
  className?: string;
}

const Text: React.FC<Props> = ({ className = "" }) => {
  const [width, height] = useContainerSize();
  if (!width || !height) return null;
  return (
    <Rectangle
      initialPosition={{ x: width * 0.5, y: height * 0.1 }}
      rounded={4}
      bodyOptions={{
        friction: 0.5,
      }}
      className="text-gray-900 px-4 py-1 border border-gray-50"
    >
      <p
        onClick={() => {
          console.log("Hello world!");
        }}
        className="text-gray-900"
      >
        Hello world!
      </p>
    </Rectangle>
  );
};

export default Text;
