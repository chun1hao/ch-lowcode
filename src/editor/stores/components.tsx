import { CSSProperties } from "react";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

export interface Component {
  id: number;
  name: string;
  props: Record<string, any>;
  children?: Component[];
  parentId?: number;
  desc: string;
  styles?: CSSProperties;
}

interface State {
  components: Component[];
  curComponentId: number | null;
  curComponent: Component | null;
  mode: "edit" | "preview";
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: Record<string, unknown>) => void;
  setCurComponentId: (componentId: number | null) => void;
  updateComponentStyles: (componentId: number, props: CSSProperties, replace?: boolean) => void;
  setMode: (mode: State["mode"]) => void;
}

export const hasPxsuffix = [
  "width",
  "height",
  "border",
  "margin",
  "padding",
  "font-size",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-radius",
];

export const hasPx = function (str: string) {
  return hasPxsuffix.includes(str);
};

const creator: StateCreator<State & Action> = (set, get) => {
  return {
    components: [
      {
        id: 1,
        name: "Page",
        props: {},
        desc: "页面",
      },
    ],
    curComponentId: null,
    curComponent: null,
    mode: "edit",
    addComponent: (component, parentId) => {
      set((state) => {
        if (!parentId) return { components: [...state.components, component] };
        const parent = getComponentById(parentId, state.components);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(component);
        }
        component.parentId = parentId;
        return { components: [...state.components] };
      });
    },
    deleteComponent: (componentId) => {
      if (!componentId) return;
      const component = getComponentById(componentId, get().components);
      if (component?.parentId) {
        const parent = getComponentById(component.parentId, get().components);
        if (parent) {
          parent.children = parent.children?.filter((c) => c.id !== componentId);
          set({ components: [...get().components] });
        }
      }
    },
    updateComponentProps: (componentId, props) => {
      set((state) => {
        const component = getComponentById(componentId, state.components);
        if (!component) return { components: [...state.components] };
        component.props = { ...component.props, ...props };
        return { components: [...state.components] };
      });
    },
    setCurComponentId: (componentId) => {
      set((state) => {
        return {
          curComponentId: componentId,
          curComponent: getComponentById(componentId, state.components),
        };
      });
    },
    updateComponentStyles: (componentId, props, replace) => {
      set((state) => {
        const component = getComponentById(componentId, state.components);
        if (!component) return { components: [...state.components] };
        component.styles = replace ? { ...props } : { ...component.styles, ...props };
        return { components: [...state.components] };
      });
    },
    setMode: (mode) => set({ mode }),
  };
};

export const useComponentsStore = create<State & Action>()(
  persist(creator, {
    name: "low-code-components",
  })
);

export function getComponentById(id: number | null, components: Component[]): Component | null {
  if (!id) return null;
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children) {
      const res = getComponentById(id, component.children);
      if (res !== null) return res;
    }
  }
  return null;
}
