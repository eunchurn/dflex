/* eslint-disable import/no-extraneous-dependencies */

import React from "react";

import { store, DnD } from "@dflex/dnd";

// shared dragged event
let draggedEvent: DnD | null;

interface Props {
  component: string | React.JSXElementConstructor<any>;
  id: string;
  children: React.ReactNode;
  depth: number;
  enableContainersTransition?: boolean;
  style?: React.CSSProperties;
}

const Core = ({
  component: CoreComponent = "div",
  id,
  children,
  depth,
  enableContainersTransition = false,
  style,
}: Props) => {
  const ref = React.useRef(null) as React.MutableRefObject<any>;

  const [isDragged, setIsDragged] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) store.register({ id, ref: ref.current, depth });
  }, [ref]);

  const onMouseUp = () => {
    if (draggedEvent) {
      draggedEvent.endDragging();
      draggedEvent = null;
      setIsDragged(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggedEvent) {
      const { clientX, clientY } = e;

      draggedEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();

    const { button, clientX, clientY } = e;

    // avoid right mouse click and ensure id
    if (typeof button === "number" && button === 0) {
      if (id) {
        draggedEvent = new DnD(
          id,
          { x: clientX, y: clientY },
          {
            enableContainersTransition,
          }
        );

        setIsDragged(true);
      }
    }
  };

  return (
    <CoreComponent
      ref={ref}
      key={id}
      id={id}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        ...style,
        ...(isDragged
          ? {
              background: "pink",
              transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s",
            }
          : {}),
      }}
    >
      {children}
    </CoreComponent>
  );
};

export default Core;
