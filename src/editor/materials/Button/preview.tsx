import { Button as AntdButton } from "antd";
import { CommonComponentProps } from "../../interface";

const Button = ({ id, type, styles, text, ...props }: CommonComponentProps) => {
  return (
    <AntdButton className="materials-btn" data-id={id} type={type} style={styles} {...props}>
      {text}
    </AntdButton>
  );
};

export default Button;
