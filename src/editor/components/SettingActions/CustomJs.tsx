import { useEffect, useState } from "react";
import { OnMount } from "@monaco-editor/react";
import { useComponentsStore } from "../../stores/components";
import { Divider } from "antd";
import MonacoEditor from "../MonacoEditor";

export interface CustomJSConfig {
  type: "customJs";
  code: string;
  key: number;
}

export interface CustomJSProps {
  defaultValue?: string;
  value?: string;
  onChange?: (config: CustomJSConfig) => void;
}

const CustomJs = (props: CustomJSProps) => {
  const { defaultValue, value: val, onChange } = props;
  const [value, setValue] = useState(defaultValue || "");
  const { curComponent } = useComponentsStore();

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  useEffect(() => {
    if (val) {
      setValue(val);
    }
  }, [val]);

  const handleChange = (value?: string) => {
    if (!curComponent || !value) return;
    setValue(value);
    onChange?.({
      type: "customJs",
      code: value,
      key: Date.now(),
    });
  };

  return (
    <div className="mt-[20px]">
      <div className="">
        <Divider>自定义JS</Divider>
        <div>
          <MonacoEditor
            height={"200px"}
            path="action.js"
            language="javascript"
            onMount={handleEditorMount}
            onChange={handleChange}
            value={value}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomJs;
