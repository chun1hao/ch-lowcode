import { useEffect, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, getComponentById, useComponentsStore } from "../../stores/components";
import { Select, TreeSelect } from "antd";

export interface ComponentMethodConfig {
  type: "componentMethod";
  config: {
    componentId: number;
    method: string;
  };
  key: number;
}

interface ComponentMethodProps {
  value?: ComponentMethodConfig["config"];
  onChange?: (config: ComponentMethodConfig) => void;
}

export function ComponentMethod(props: ComponentMethodProps) {
  const { value, onChange } = props;
  const { components, curComponentId } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [selectedComponent, setSelectedComponent] = useState<Component | null>();
  const [curId, setCurId] = useState<number>();
  const [curMethod, setCurMethod] = useState<string>();

  useEffect(() => {
    if (value) {
      setCurId(value.componentId);
      setCurMethod(value.method);

      setSelectedComponent(getComponentById(value.componentId, components));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function componentChange(value: number) {
    if (!curComponentId) return;

    setSelectedComponent(getComponentById(value, components));
  }

  function componentMethodChange(value: string) {
    if (!curComponentId || !selectedComponent) return;

    setCurMethod(value);

    onChange?.({
      type: "componentMethod",
      config: {
        componentId: selectedComponent?.id,
        method: value,
      },
      key: Date.now(),
    });
  }

  return (
    <div className="mt-[40px]">
      <div className="flex items-center gap-[10px]">
        <div className="w-[80px] text-right">组件：</div>
        <div className="flex-1">
          <TreeSelect
            className="w-[100%]"
            treeData={components}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            value={curId}
            onChange={(value) => {
              componentChange(value);
            }}
          />
        </div>
      </div>
      {componentConfig[selectedComponent?.name || ""] && (
        <div className="flex items-center gap-[10px] mt-[20px]">
          <div className="w-[80px] text-right">方法：</div>
          <div className="flex-1">
            <Select
              className="w-[100%]"
              options={componentConfig[selectedComponent?.name || ""].methods?.map((method) => ({
                label: method.label,
                value: method.name,
              }))}
              value={curMethod}
              onChange={(value) => {
                componentMethodChange(value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
