import { Button } from "antd";
import { useDrag } from "react-dnd";

export interface MaterialItemProps {
  name: string;
  desc: string;
  icon?: React.FunctionComponent;
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
    <div ref={drag}>
      <Button size="small" className="cursor-move" icon={props.icon ? <props.icon /> : ""}>
        {props.desc}
      </Button>
    </div>
  );
}
