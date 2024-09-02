import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components";
import HoverMask from "../HoverMask";
import SelectMask from "../SelectMask";
import { EDIT_AREA } from "../../../config";

export default function EditArea() {
  const portalContainer = useRef<HTMLDivElement>(null);
  const { components, curComponentId, setCurComponentId } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver = (e: MouseEvent) => {
    const path = e.nativeEvent.composedPath();
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;
      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;
      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setCurComponentId(+componentId);
        return;
      }
    }
  };

  function renderComponent(components: Component[]): React.ReactNode {
    return components.map((component) => {
      const config = componentConfig[component.name];
      if (!config.edit) return null;
      return React.createElement(
        config.edit,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
        },
        renderComponent(component.children || [])
      );
    });
  }

  useEffect(() => {
    if (curComponentId) setCurComponentId(curComponentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`h-[calc(100vh-60px)] overflow-auto ${EDIT_AREA}`}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalRef={portalContainer}
          containerClassName={EDIT_AREA}
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectMask
          portalRef={portalContainer}
          containerClassName={EDIT_AREA}
          componentId={curComponentId}
        />
      )}
      {renderComponent(components)}
      <div ref={portalContainer}></div>
    </div>
  );
}
