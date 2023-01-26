import { useRef } from "react";

interface Props {
  dragStart?: () => void;
  drag: ({ dx, dy }: { dx: number; dy: number }) => void;
  dragEnd?: () => void;
}

export const useDrag = ({ drag, dragStart, dragEnd }: Props) => {
  const current = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const onDragStart = (ev: React.DragEvent<HTMLElement>) => {
    current.current.x = ev.clientX;
    current.current.y = ev.clientY;
    dragStart && dragStart();
    dragging.current = true;
  };

  const onDrag = (ev: React.DragEvent<HTMLElement>) => {
    ev.preventDefault();
    if (dragging.current) {
      const dx = ev.clientX - current.current.x;
      const dy = ev.clientY - current.current.y;
      current.current.x = ev.clientX;
      current.current.y = ev.clientY;
      drag({ dx, dy });
    }
  };

  const onDragEnd = (ev: React.DragEvent<HTMLElement>) => {
    dragging.current = false;
    // current.current.x = ev.clientX;
    // current.current.y = ev.clientY;
    dragEnd && dragEnd();
  };

  return { onDragStart, onDrag, onDragEnd };
};
