import { Input } from "antd";
import { useComponentsStore } from "../../stores/components";
import { useEffect, useState } from "react";
export interface JumpPageConfig {
  type: "jumpPage";
  url: string;
  key: number;
}

export interface JumpPageProps {
  value?: string;
  defaultValue?: string;
  onChange?: (config: JumpPageConfig) => void;
}
const JumpPage = (props: JumpPageProps) => {
  const { defaultValue, value: val, onChange } = props;
  const { curComponent } = useComponentsStore();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (val) setValue(val);
  }, [val]);

  const urlChange = (value: string) => {
    if (!curComponent) return;
    setValue(value);
    onChange?.({
      type: "jumpPage",
      url: value,
      key: Date.now(),
    });
  };

  return (
    <div className="mt-[10px]">
      <div className="flex items-center">
        <div className="w-[80px] text-right">跳转链接：</div>
        <div className="flex-1">
          <Input.TextArea onChange={(e) => urlChange(e.target.value)} value={value} />
        </div>
      </div>
    </div>
  );
};

export default JumpPage;
