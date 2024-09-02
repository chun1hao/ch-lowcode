import { Form as AntdForm, Input } from "antd";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
import { useEffect, useMemo, useRef } from "react";
import React from "react";

export default function Form({ id, name, children, onFinish }: CommonComponentProps) {
  const [form] = AntdForm.useForm();

  const { canDrop, drop } = useMaterialDrop(["FormItem"], id);

  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  });

  useEffect(() => {
    drop(ref);
    drag(ref);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formItems = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
      };
    });
  }, [children]);

  return (
    <div
      className={`w-[100%] p-[20px] min-h-[100px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      ref={ref}
      data-component-id={id}
    >
      <AntdForm
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={(values) => {
          if (onFinish) onFinish(values);
        }}
      >
        {formItems.map((item: any) => {
          return (
            <div key={item.id} data-component-id={item.id}>
              <AntdForm.Item name={item.name} label={item.label} className="pointer-events-none">
                <Input className="pointer-events-none" />
              </AntdForm.Item>
            </div>
          );
        })}
      </AntdForm>
    </div>
  );
}
