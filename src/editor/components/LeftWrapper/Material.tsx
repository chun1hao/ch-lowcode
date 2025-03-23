import { useMemo, useState } from "react";
import {
  ComponentConfig,
  useComponentConfigStore,
} from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";
import { Collapse } from "antd";

export function Material() {
  const [activeKey, setActiveKey] = useState(["0"]);

  const { componentConfig } = useComponentConfigStore();

  const components = useMemo(() => {
    const map = new Map();
    Object.values(componentConfig).forEach((component) => {
      if (component.name !== "Page") {
        map.set(
          component.level,
          (map.get(component.level) || []).concat(component)
        );
      }
    });
    return Array.from(map.values()).map((item: ComponentConfig[], idx) => {
      return {
        key: idx + "",
        label: item[0].levelName,
        children: (
          <div className="flex flex-wrap gap-[10px]">
            {item.map((component, index) => {
              return (
                <MaterialItem
                  icon={component.icon}
                  name={component.name}
                  desc={component.desc}
                  key={index}
                ></MaterialItem>
              );
            })}
          </div>
        ),
      };
    });
  }, [componentConfig]);

  return (
    <Collapse
      items={components}
      expandIconPosition="end"
      activeKey={activeKey}
      ghost
      onChange={(v: string | string[]) => setActiveKey(v as string[])}
    />
  );
}
