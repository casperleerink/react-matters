import { useBody } from "react-matters";

interface Props {
  label: string;
  route: string;
  x: number;
  y: number;
}

const NavBody: React.FC<Props> = ({ label, route, x, y }) => {
  const { ref, style, dragControls } = useBody<HTMLAnchorElement>({
    type: "rectangle",
    x,
    y,
    draggable: true,
    rounded: 4,
  });

  return (
    <a
      ref={ref}
      style={style}
      {...dragControls()}
      href={`#${route}`}
      className="px-5 py-3 border border-gray-400 text-gray-100 text-sm select-none hover:border-gray-100 transition-colors whitespace-nowrap"
    >
      {label}
    </a>
  );
};

export default NavBody;
