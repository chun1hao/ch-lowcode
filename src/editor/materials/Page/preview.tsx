import { CommonComponentProps } from "../../interface";

function Page({ children }: CommonComponentProps) {
  return <div className="p-[20px] box-border">{children}</div>;
}

export default Page;
