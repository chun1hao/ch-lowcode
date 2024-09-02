import { Segmented } from "antd";
import { useState } from "react";
import { Material } from "./Material";
import { Outline } from "./Outline";
import { SourceCode } from "./SourceCode";
import { LEFT_WRAPPER } from "../../../config";

export function LeftWrapper() {
  const [key, setKey] = useState<string>("物料");

  return (
    <div className={LEFT_WRAPPER}>
      <Segmented value={key} onChange={setKey} block options={["物料", "大纲", "源码"]} />
      <div className="pt-[10px] h-[calc(100vh-100px)]">
        {key === "物料" && <Material />}
        {key === "大纲" && <Outline />}
        {key === "源码" && <SourceCode />}
      </div>
    </div>
  );
}
