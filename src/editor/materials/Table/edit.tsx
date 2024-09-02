import { Table as AntdTable } from "antd";
import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import React, { useEffect, useMemo, useRef } from "react";
import { useDrag } from "react-dnd";

export interface ColumnProps {
  title: string;
  props: {
    id: number;
    dataIndex: string;
    [k: string]: unknown;
  };
}

export default function Table({ id, name, styles, children }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["TableColumn"], id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drag(ref);
    drop(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      if (!item) return null;
      return {
        title: (
          <div className="m-[-16px] p-[16px]" data-component-id={item.props?.id}>
            {item.props?.title}
          </div>
        ),
        key: item.props?.id,
        dataIndex: item.props?.dataIndex,
      };
    });
  }, [children]);

  return (
    <div
      className={`w-[100%] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      ref={ref}
      data-component-id={id}
      style={styles}
    >
      <AntdTable columns={columns} dataSource={[]} pagination={false} />
    </div>
  );
}
