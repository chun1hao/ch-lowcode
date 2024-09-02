import { useEffect, useState } from "react";
import { Modal, Segmented } from "antd";
import JumpPage, { JumpPageConfig } from "./JumpPage";
import { ShowMessage, ShowMessageConfig } from "./ShowMessage";
import CustomJs, { CustomJSConfig } from "./CustomJs";
import { ComponentMethod, ComponentMethodConfig } from "./ComponentMethod";

export type ActionConfig =
  | JumpPageConfig
  | ShowMessageConfig
  | CustomJSConfig
  | ComponentMethodConfig;

interface ActionModalProps {
  visible: boolean;
  action?: ActionConfig;
  handleOk: (config?: ActionConfig) => void;
  handleCancel: () => void;
}

export function ActionModal(props: ActionModalProps) {
  const { visible, action, handleOk, handleCancel } = props;
  const [key, setKey] = useState("访问链接");
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  const map = {
    jumpPage: "访问链接",
    showMessage: "消息提示",
    customJs: "自定义JS",
    componentMethod: "组件方法",
  };

  useEffect(() => {
    if (action?.type) {
      setKey(map[action.type]);
    }
    if (action) {
      setCurConfig(action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);
  return (
    <Modal
      title="事件配置"
      width={500}
      open={visible}
      okText={action ? "编辑" : "添加"}
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <div className="h-[300px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["访问链接", "消息提示", "自定义JS", "组件方法"]}
        />
        {key === "访问链接" && (
          <JumpPage
            value={action?.type === "jumpPage" ? action.url : ""}
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "消息提示" && (
          <ShowMessage
            value={action?.type === "showMessage" ? action.config : undefined}
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "自定义JS" && (
          <CustomJs
            value={action?.type === "customJs" ? action.code : ""}
            onChange={(config) => setCurConfig(config)}
          />
        )}
        {key === "组件方法" && (
          <ComponentMethod
            value={action?.type === "componentMethod" ? action.config : undefined}
            onChange={(config) => setCurConfig(config)}
          />
        )}
      </div>
    </Modal>
  );
}
