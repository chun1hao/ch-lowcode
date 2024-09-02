import { Input, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import { useEffect, useState } from "react";

type MessageType = "success" | "error";
export interface ShowMessageConfig {
  type: "showMessage";
  config: {
    type: MessageType;
    text: string;
  };
  key: number;
}

export interface ShowMessageProps {
  value?: ShowMessageConfig["config"];
  defaultValue?: ShowMessageConfig["config"];
  onChange?: (config: ShowMessageConfig) => void;
}

export function ShowMessage(props: ShowMessageProps) {
  const { value, defaultValue, onChange } = props;

  const [type, setType] = useState<MessageType>(defaultValue?.type || "success");
  const [text, setText] = useState(defaultValue?.text || "");

  const { curComponentId } = useComponentsStore();

  useEffect(() => {
    if (value) {
      setText(value.text);
      setType(value.type);
    }
  }, [value]);

  function messageTypeChange(value: MessageType) {
    if (!curComponentId) return;
    setType(value);

    onChange?.({
      type: "showMessage",
      config: {
        type: value,
        text,
      },
      key: Date.now(),
    });
  }

  function messageTextChange(value: string) {
    if (!curComponentId) return;
    setText(value);
    onChange?.({
      type: "showMessage",
      config: {
        type,
        text: value,
      },
      key: Date.now(),
    });
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center">
        <div className="w-[80px] text-right">类型：</div>
        <div className="flex-1">
          <Select
            className="w-[100%]"
            options={[
              { label: "成功", value: "success" },
              { label: "失败", value: "error" },
            ]}
            onChange={(value) => messageTypeChange(value)}
            value={type}
          />
        </div>
      </div>
      <div className="flex items-center mt-[10px]">
        <div className="w-[80px] text-right">文本：</div>
        <div className="flex-1">
          <Input onChange={(e) => messageTextChange(e.target.value)} value={text} />
        </div>
      </div>
    </div>
  );
}
