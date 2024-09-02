import { Button as AntdButton } from "antd";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";

const Button = ({ id, name, type, styles, text }: CommonComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: "Button",
      dragType: "move",
      id,
    },
  });
  return (
    <AntdButton
      ref={drag}
      className="materials-btn"
      data-component-id={id}
      type={type}
      style={styles}
    >
      {text}
    </AntdButton>
  );
};

export default Button;
