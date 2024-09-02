import { Button } from "antd";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { CommonComponentProps } from "../../interface";

function Modal({ id, okText, cancelText, children, title, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["Button", "Container", "Text", "Table", "Form"], id);

  return (
    <div
      ref={drop}
      style={styles}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] rounded-[4px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      {title}
      <div>{children}</div>
      <div className="flex justify-end gap-[10px]">
        <Button className="pointer-events-none" type="primary">
          {okText}
        </Button>
        <Button className="pointer-events-none" type="default">
          {cancelText}
        </Button>
      </div>
    </div>
  );
}

export default Modal;
