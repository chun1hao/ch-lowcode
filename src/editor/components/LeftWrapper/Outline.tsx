import { Tree } from "antd";
import { useComponentsStore } from "../../stores/components";

export function Outline() {
  const { components, setCurComponentId } = useComponentsStore();

  const handleSelect = ([selectKey]: React.Key[]) => {
    setCurComponentId(selectKey as number);
  };
  return (
    <Tree
      fieldNames={{ title: "desc", key: "id" }}
      treeData={components as any}
      showLine
      defaultExpandAll
      onSelect={handleSelect}
    />
  );
}
