import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponentsStore } from "../stores/components";

export interface ItemDropType {
  type: string;
  id: number;
  dragType: "move" | "add";
}

export function useMaterialDrop(accept: string[], id: number) {
  const { components, addComponent, deleteComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop({
    accept,
    drop: (item: ItemDropType, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const config = componentConfig[item.type];

      if (item.dragType === "move") {
        const component = getComponentById(item.id, components);
        if (component) {
          deleteComponent(component.id);
          addComponent(component, id);
        }
      } else {
        addComponent(
          {
            id: new Date().getTime(),
            name: item.type,
            props: config.defaultProps,
            desc: config.desc,
          },
          id
        );
      }
    },
    collect: (monitor) => {
      return {
        canDrop: monitor.canDrop(),
      };
    },
  });

  return { canDrop, drop };
}
