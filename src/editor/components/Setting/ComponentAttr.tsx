import { Form, Input, Select, Switch, Tooltip } from "antd";
import { useComponentsStore } from "../../stores/components";
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from "../../stores/component-config";
import { useEffect, useState } from "react";
import { generateRandomString } from "../../../utils";
import { QuestionCircleOutlined } from "@ant-design/icons";

export function ComponentAttr() {
  const [form] = Form.useForm();
  const { curComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [showArea, setShowArea] = useState<boolean>(() => {
    return ["select", "checkbox", "radio"].includes(curComponent?.props.type);
  });

  useEffect(() => {
    setShowArea(["select", "checkbox", "radio"].includes(curComponent?.props.type));
  }, [curComponent]);

  useEffect(() => {
    form.resetFields();
    const data = form.getFieldsValue();
    const props = { ...curComponent?.props };
    if (props.uuid) {
      props[props.uuid] = generateRandomString();
    }
    const newData = { ...data, ...props };
    form.setFieldsValue(newData);
    if (curComponent?.id) {
      updateComponentProps(curComponent.id, newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curComponent]);

  if (!curComponent?.id) return null;

  const valueChange = (changedValues: ComponentConfig) => {
    if (curComponent?.id) {
      updateComponentProps(curComponent.id, changedValues);
    }
  };

  const handleChange = (val: string) => {
    setShowArea(["select", "checkbox", "radio"].includes(val));
  };

  function renderComponent(item: ComponentSetter) {
    const { type, options } = item;
    if (type === "select") {
      return (
        <Select options={options as { value: string; label: string }[]} onChange={handleChange} />
      );
    } else if (type === "input") {
      return <Input />;
    } else if (type === "textarea") {
      return <Input.TextArea autoSize></Input.TextArea>;
    } else if (type === "switch") {
      return <Switch checkedChildren="开启" unCheckedChildren="关闭"></Switch>;
    }
    return null;
  }
  return (
    <Form
      className="mt-3"
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件名称">
        <Input disabled value={curComponent?.name}></Input>
      </Form.Item>
      <Form.Item label="组件描述">
        <Input disabled value={curComponent?.desc}></Input>
      </Form.Item>
      <Form.Item label="组件id">
        <Input disabled value={curComponent?.id}></Input>
      </Form.Item>
      {componentConfig[curComponent!.name]?.setter?.map((item) => {
        const isSelectOption = item.name === "options" && showArea;

        if (item.name !== "options" || isSelectOption) {
          return (
            <Form.Item
              key={item.name}
              name={item.name}
              label={
                <span>
                  {item.label}
                  {isSelectOption && (
                    <Tooltip title="需要是一个JSON，格式{ label, value, disabled? }[]">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  )}
                </span>
              }
            >
              {renderComponent(item)}
            </Form.Item>
          );
        }
        return null;
      })}
    </Form>
  );
}
