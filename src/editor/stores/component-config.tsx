import { create } from "zustand";
import ContainerEdit from "../materials/Container/edit";
import ButtonEdit from "../materials/Button/edit";
import PageEdit from "../materials/Page/edit";
import ContainerPreview from "../materials/Container/preview";
import ButtonPreview from "../materials/Button/preview";
import PagePreview from "../materials/Page/preview";
import ModalEdit from "../materials/Modal/edit";
import ModalPreview from "../materials/Modal/preview";
import TableEdit from "../materials/Table/edit";
import TablePreview from "../materials/Table/preview";
import TableColumn from "../materials/TableColumn";
import FormEdit from "../materials/Form/edit";
import FormPreview from "../materials/Form/preview";
import FormItem from "../materials/Form/formItem";
import Text from "../materials/Text/index";

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentMethod {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, unknown>; // 设置区-属性回显
  desc: string;
  setter?: ComponentSetter[]; // 设置区-属性
  stylesSetter?: ComponentSetter[]; // 设置区-样式
  edit: any;
  preview: any;
  events?: ComponentEvent[];
  methods?: ComponentMethod[];
  [key: string]: unknown;
}

interface State {
  componentConfig: Record<string, ComponentConfig>;
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => {
  return {
    componentConfig: {
      Page: {
        name: "Page",
        defaultProps: {},
        edit: PageEdit,
        preview: PagePreview,
        desc: "页面",
      },
      Container: {
        name: "Container",
        defaultProps: {},
        desc: "容器",
        stylesSetter: [
          {
            name: "width",
            label: "宽度",
            type: "inputNumber",
          },
          {
            name: "height",
            label: "高度",
            type: "inputNumber",
          },
        ],
        edit: ContainerEdit,
        preview: ContainerPreview,
      },
      Text: {
        name: "Text",
        defaultProps: {
          text: "这里是一段文本",
        },
        desc: "文本",
        setter: [
          {
            name: "text",
            label: "文本",
            type: "textarea",
          },
        ],
        stylesSetter: [
          {
            name: "width",
            label: "宽度",
            type: "inputNumber",
          },
          {
            name: "height",
            label: "高度",
            type: "inputNumber",
          },
        ],
        edit: Text,
        preview: Text,
      },
      Button: {
        name: "Button",
        defaultProps: {
          type: "primary",
          text: "按钮",
        },
        desc: "按钮",
        setter: [
          {
            name: "type",
            label: "按钮类型",
            type: "select",
            options: [
              { label: "主按钮", value: "primary" },
              { label: "次按钮", value: "default" },
              { label: "虚线框按钮", value: "dashed" },
            ],
          },
          {
            name: "text",
            label: "按钮文本",
            type: "input",
          },
        ],
        stylesSetter: [
          {
            name: "width",
            label: "宽度",
            type: "inputNumber",
          },
          {
            name: "height",
            label: "高度",
            type: "inputNumber",
          },
        ],
        edit: ButtonEdit,
        preview: ButtonPreview,
        events: [
          {
            name: "onClick",
            label: "点击事件",
          },
        ],
      },
      Modal: {
        name: "Modal",
        defaultProps: {
          title: "弹窗标题",
          okText: "确认",
          cancelText: "取消",
        },
        setter: [
          {
            name: "title",
            label: "标题文本",
            type: "input",
          },
          {
            name: "okText",
            label: "确认文本",
            type: "input",
          },
          {
            name: "cancelText",
            label: "取消文本",
            type: "input",
          },
        ],
        stylesSetter: [],
        events: [
          {
            name: "onOk",
            label: "确认事件",
          },
          {
            name: "onCancel",
            label: "取消事件",
          },
        ],
        methods: [
          {
            name: "open",
            label: "打开弹窗",
          },
          {
            name: "close",
            label: "关闭弹窗",
          },
        ],
        desc: "弹窗",
        edit: ModalEdit,
        preview: ModalPreview,
      },
      Table: {
        name: "Table",
        defaultProps: {},
        desc: "表格",
        setter: [
          {
            name: "url",
            label: "url",
            type: "input",
          },
        ],
        edit: TableEdit,
        preview: TablePreview,
      },
      TableColumn: {
        name: "TableColumn",
        desc: "表格列",
        defaultProps: {
          uuid: "dataIndex",
          title: "列名",
          type: "text",
        },
        setter: [
          {
            name: "title",
            label: "标题",
            type: "input",
          },
          {
            name: "dataIndex",
            label: "字段",
            type: "input",
          },
          {
            name: "type",
            label: "字段类型",
            type: "select",
            options: [
              {
                label: "文本",
                value: "text",
              },
              {
                label: "日期",
                value: "date",
              },
            ],
          },
        ],
        edit: TableColumn,
        preview: TableColumn,
      },
      Form: {
        name: "Form",
        defaultProps: {},
        desc: "表单",
        setter: [
          {
            name: "title",
            label: "标题",
            type: "input",
          },
        ],
        events: [
          {
            name: "onFinish",
            label: "提交事件",
          },
        ],
        methods: [
          {
            name: "submit",
            label: "提交",
          },
        ],
        edit: FormEdit,
        preview: FormPreview,
      },
      FormItem: {
        name: "FormItem",
        desc: "表单项",
        defaultProps: {
          uuid: "name",
          label: "测试",
          type: "input",
          rules: true,
          options: JSON.stringify([
            { label: "Apple", value: "Apple" },
            { label: "Pear", value: "Pear" },
            { label: "Orange", value: "Orange", disabled: false },
          ]),
        },
        edit: FormItem,
        preview: FormItem,
        setter: [
          {
            name: "type",
            label: "类型",
            type: "select",
            options: [
              {
                label: "文本",
                value: "input",
              },
              {
                label: "日期",
                value: "date",
              },
              {
                label: "单选框",
                value: "radio",
              },
              {
                label: "多选框",
                value: "checkbox",
              },
              {
                label: "下拉框",
                value: "select",
              },
            ],
          },
          {
            name: "label",
            label: "标题",
            type: "input",
          },
          {
            name: "name",
            label: "字段",
            type: "input",
          },
          {
            name: "rules",
            label: "校验",
            type: "switch",
          },
          {
            name: "options",
            label: "选项",
            type: "textarea",
          },
        ],
      },
    },
    registerComponent: (name, componentConfig) => {
      set((state) => {
        return {
          ...state,
          componentConfig: {
            ...state.componentConfig,
            [name]: componentConfig,
          },
        };
      });
    },
  };
});
