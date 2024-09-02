import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";

const Text = ({ id, name, styles, text }: CommonComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: "Text",
      dragType: "move",
      id,
    },
  });
  return (
    <div ref={drag} className="materials-text" data-component-id={id} style={styles}>
      {text}
    </div>
  );
};

export default Text;
