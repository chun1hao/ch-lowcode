import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";

export function Material() {
  const { componentConfig } = useComponentConfigStore();

  const components = useMemo(() => {
    return Object.values(componentConfig).filter((component) => component.name !== "Page");
  }, [componentConfig]);

  return (
    <div className="flex flex-wrap gap-[10px] pl-[10px]">
      {components.map((component, index) => {
        return (
          <MaterialItem name={component.name} desc={component.desc} key={index}></MaterialItem>
        );
      })}
    </div>
  );
}
