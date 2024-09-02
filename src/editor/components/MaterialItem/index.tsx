import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  name: string;
  desc: string;
}

export function MaterialItem(props: MaterialItemProps) {
  const name = props.name;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
    },
  });
  return (
    <div
      ref={drag}
      className="
            border-dashed
            rounded-[6px]
            border-[1px]
            border-[#000]
            py-[4px] px-[6px] 
            cursor-move
            bg-white
            hover:bg-[#ccc]
        "
    >
      {props.desc}
    </div>
  );
}
