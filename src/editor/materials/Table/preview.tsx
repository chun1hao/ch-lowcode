import { Table as AntdTable } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CommonComponentProps } from "../../interface";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";

export default function Table({ url, children }: CommonComponentProps) {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    if (url) {
      setLoading(true);

      const { data } = await axios.get(url);
      setData(data);

      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      if (item?.props?.type === "date") {
        return {
          title: item.props?.title,
          dataIndex: item.props?.dataIndex,
          render: (value: any) => (value ? dayjs(value).format("YYYY-MM-DD") : null),
        };
      } else {
        return {
          title: item.props?.title,
          dataIndex: item.props?.dataIndex,
        };
      }
    });
  }, [children]);

  return (
    <AntdTable
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      loading={loading}
    />
  );
}
