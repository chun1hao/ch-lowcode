import { CommonComponentProps } from "../../interface";

const Container = ({ children, styles }: CommonComponentProps) => {
  return (
    <div className={`materials-container min-h-[100px] p-[10px] rounded`} style={styles}>
      {children}
    </div>
  );
};

export default Container;
