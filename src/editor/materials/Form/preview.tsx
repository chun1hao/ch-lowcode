import { Form as AntdForm, Checkbox, DatePicker, Input, Radio, Select } from "antd";
import { CommonComponentProps } from "../../interface";
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo } from "react";
import dayjs from "dayjs";

export interface FormRef {
  submit: () => void;
}

export interface ItemType {
  label: string;
  name: string;
  type: string;
  id: number;
  rules: string;
  options: string;
}

const Form: ForwardRefRenderFunction<FormRef, Omit<CommonComponentProps, "ref">> = (
  { onFinish, children },
  ref
) => {
  const [form] = AntdForm.useForm();

  useImperativeHandle(ref, () => {
    return {
      submit() {
        form.submit();
      },
    };
  });

  async function save(values: any) {
    Object.keys(values).forEach((key) => {
      if (dayjs.isDayjs(values[key])) {
        values[key] = values[key].format("YYYY-MM-DD");
      }
    });

    onFinish?.(values);
  }

  const formItems = useMemo<ItemType[]>(() => {
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
        rules: item.props?.rules,
        options: item.props?.options,
      };
    });
  }, [children]);

  return (
    <AntdForm
      name="form"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      onFinish={save}
    >
      {formItems.map((item) => {
        return (
          <AntdForm.Item
            key={item.id}
            name={item.name}
            label={item.label}
            rules={
              item.rules
                ? [
                    {
                      required: true,
                      message: "不能为空",
                    },
                  ]
                : []
            }
          >
            {item.type === "date" && <DatePicker />}
            {item.type === "input" && <Input />}
            {item.type === "radio" && <Radio.Group options={JSON.parse(item.options)} />}
            {item.type === "checkbox" && <Checkbox.Group options={JSON.parse(item.options)} />}
            {item.type === "select" && <Select options={JSON.parse(item.options)} />}
          </AntdForm.Item>
        );
      })}
    </AntdForm>
  );
};

export default forwardRef(Form);
