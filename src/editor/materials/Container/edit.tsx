import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(["Button", "Container", "Text", "Table", "Form"], id);
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      id: id,
      dragType: "move",
    },
  });

  useEffect(() => {
    drop(ref);
    drag(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={ref}
      data-component-id={id}
      className={`materials-container min-h-[100px] p-[10px] rounded ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      style={styles}
    >
      {children}
    </div>
  );
};

export default Container;
