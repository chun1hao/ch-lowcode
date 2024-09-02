import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../SettingActions/ActionModal";

export default function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRefs = useRef<Record<string, any>>({});

  function handleEvent(component: Component) {
    const props: Record<string, any> = {};
    componentConfig[component.name].events?.forEach((item) => {
      const eventConfig = component.props[item.name];
      if (eventConfig) {
        props[item.name] = (...args: any[]) => {
          eventConfig.actions?.forEach((act: ActionConfig) => {
            if (act.type === "jumpPage" && act.url) {
              window.location.href = eventConfig.url;
            } else if (act.type === "showMessage" && act.config) {
              if (act.config.type === "success") {
                message.success(act.config.text);
              } else if (act.config.type === "error") {
                message.error(act.config.text);
              }
            } else if (act.type === "customJs" && act.code) {
              const func = new Function("context", "args", act.code);
              func(
                {
                  name: component.name,
                  props: component.props,
                  showMessage(content: string) {
                    message.success(content);
                  },
                },
                args
              );
            } else if (act.type === "componentMethod") {
              const component = componentRefs.current?.[act.config.componentId];
              if (component) {
                component[act.config.method]?.(...args);
              }
            }
          });
        };
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component) => {
      const config = componentConfig?.[component.name];

      if (!config.preview) return null;

      const isForwardRef = config.preview.$$typeof === Symbol.for("react.forward_ref");
      return React.createElement(
        config.preview,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ref: isForwardRef
            ? (ref: Record<string, any>) => {
                componentRefs.current[component.id] = ref;
              }
            : undefined,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }
  return <div>{renderComponents(components)}</div>;
}
