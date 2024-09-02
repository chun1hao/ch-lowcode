import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { CommonComponentProps } from "../../interface";

function Page({ id, children }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    ["Button", "Container", "Modal", "Text", "Table", "Form"],
    id
  );

  return (
    <div
      ref={drop}
      data-component-id={id}
      className="p-[20px] box-border min-h-[100%] relative"
      style={{ border: canDrop ? "2px solid blue" : "none" }}
    >
      {Array.isArray(children) && children.length ? (
        children
      ) : (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          拖动组件开始
        </div>
      )}
    </div>
  );
}

export default Page;
