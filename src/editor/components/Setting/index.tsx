import { useState } from "react";
import { useComponentsStore } from "../../stores/components";
import { Segmented } from "antd";
import { ComponentAttr } from "./ComponentAttr";
import { ComponentStyle } from "./ComponentStyle";
import { ComponentEvent } from "./ComponentEvent";
import { RIGHT_SETTING } from "../../../config";

export default function Setting() {
  const { curComponentId } = useComponentsStore();
  const [key, setKey] = useState("属性");

  if (!curComponentId)
    return <div className="h-[100%] flex items-center justify-center">先选中画布区域组件</div>;
  return (
    <div className={RIGHT_SETTING}>
      <Segmented value={key} onChange={setKey} block options={["属性", "样式", "事件"]} />
      <div className="h-[calc(100vh-100px)] overflow-auto">
        {key === "属性" && <ComponentAttr />}
        {key === "样式" && <ComponentStyle />}
        {key === "事件" && <ComponentEvent />}
      </div>
    </div>
  );
}
