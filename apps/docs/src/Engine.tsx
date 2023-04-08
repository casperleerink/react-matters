import { useEngine } from "../../../packages/react-matters/index";

interface Props {
  className?: string;
}

const Engine: React.FC<Props> = ({ className = "" }) => {
  const engine = useEngine();

  return (
    <div className="absolute right-4 top-4 flex gap-16">
      <button
        onClick={() => {
          if (!engine) return;
          engine.gravity = {
            x: 0,
            y: 1,
            scale: 0.001,
          };
        }}
      >
        fall
      </button>
      <button
        onClick={() => {
          if (!engine) return;
          engine.gravity = {
            x: 0,
            y: -1,
            scale: 0.001,
          };
        }}
      >
        Up
      </button>
    </div>
  );
};

export default Engine;
