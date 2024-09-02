import { Divider, Form, Input, InputNumber, Select } from "antd";
import { hasPx, useComponentsStore } from "../../stores/components";
import { ComponentSetter, useComponentConfigStore } from "../../stores/component-config";
import { CSSProperties, useEffect, useState } from "react";
import CssEditor from "./CssEditor";
import { debounce, kebabCase } from "lodash-es";
import parse from "style-to-object";

export function ComponentStyle() {
  const [cssStr, setCssStr] = useState(`.style{\n\n}`);
  const [form] = Form.useForm();
  const { curComponent, updateComponentStyles } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    form.resetFields();
    if (curComponent?.styles) {
      const data = form.getFieldsValue();
      const newStyles: CSSProperties = { ...curComponent.styles };
      Object.keys(newStyles).forEach((k) => {
        if ((k === "height" || k === "width") && newStyles?.[k]) {
          const value = newStyles[k];
          if (typeof value === "string") {
            newStyles[k] = value.replace("px", "");
          }
        }
      });
      form.setFieldsValue({ ...data, ...newStyles });
      setCssStr(toCssStr(curComponent.styles));
    } else {
      setCssStr(`.style{\n\n}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curComponent]);

  if (!curComponent) return null;

  const valueChange = (changedValues: CSSProperties) => {
    if (!curComponent.id) return;
    updateComponentStyles(curComponent.id, changedValues);
  };

  function renderFormElememt(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === "select") {
      return <Select options={options as { value: string; label: string }[]} />;
    } else if (type === "input") {
      return <Input />;
    } else if (type === "inputNumber") {
      return <InputNumber className="w-[100%]" />;
    }
    return null;
  }

  function toCssStr(css: CSSProperties) {
    let str = ".style {\n";
    for (let [k, v] of Object.entries(css)) {
      k = kebabCase(k);
      if (!v) continue;
      if (hasPx(k) && !String(v).endsWith("px")) {
        v += "px";
      }
      str += `\t${k}: ${v};\n`;
    }
    str += "}";
    return str;
  }

  const handleEditChange = debounce((value?: string) => {
    if (!value) return;
    const custCss: Record<string, unknown> = {};
    try {
      const match = value.replace(/\/\*.*\*\//, "").match(/\{([\s\S]*?)\}/);
      if (match?.[1]) {
        parse(match?.[1].trim(), (key, value) => {
          custCss[key.replace(/-\w/, (item) => item.toUpperCase().replace("-", ""))] = value;
        });
      }
      updateComponentStyles(curComponent.id, { ...form.getFieldsValue(), ...custCss }, true);
    } catch (e) {
      console.log(e);
    }
  }, 500);

  return (
    <Form
      className="mt-3"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={valueChange}
    >
      {componentConfig[curComponent.name] &&
        componentConfig[curComponent.name].stylesSetter?.map((item) => {
          return (
            <Form.Item key={item.name} label={item.label} name={item.name}>
              {renderFormElememt(item)}
            </Form.Item>
          );
        })}
      <Divider>自定义css</Divider>
      <div className="h-[200px]">
        <CssEditor value={cssStr} onChange={handleEditChange} />
      </div>
    </Form>
  );
}
