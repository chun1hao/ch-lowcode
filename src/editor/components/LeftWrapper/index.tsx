import { Tabs, TabsProps } from "antd";
import { useState } from "react";
import { Material } from "./Material";
import { Outline } from "./Outline";
import { SourceCode } from "./SourceCode";
import { LEFT_WRAPPER } from "../../../config";

const itemConfig = [
  { key: "1", label: "物料", Component: Material },
  { key: "2", label: "大纲", Component: Outline },
  { key: "3", label: "源码", Component: SourceCode },
];
const items: TabsProps["items"] = itemConfig.map((item) => {
  return {
    key: item.key,
    label: item.label,
    children: (
      <div className="h-[calc(100vh-100px)]">
        <item.Component />
      </div>
    ),
  };
});

export function LeftWrapper() {
  const [key, setKey] = useState("1");

  return (
    <div className={LEFT_WRAPPER}>
      <Tabs centered activeKey={key} items={items} onChange={setKey} />
    </div>
  );
}
