import { Button, Card, Collapse, CollapseProps, Popconfirm, Space } from "antd";
import { getComponentById, useComponentsStore } from "../../stores/components";
import {
  ComponentEvent as ComponentEventType,
  useComponentConfigStore,
} from "../../stores/component-config";
import { useState } from "react";
import { ActionConfig, ActionModal } from "../SettingActions/ActionModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type AFunc = (...args: unknown[]) => void;

function CardExtra(props: { handleEdit: AFunc; handleDel: AFunc }) {
  const { handleDel, handleEdit } = props;
  return (
    <Space className="text-blue-500">
      <EditOutlined className="cursor-pointer" onClick={handleEdit} />
      <Popconfirm title="确认删除？" okText={"确认"} cancelText={"取消"} onConfirm={handleDel}>
        <DeleteOutlined className="text-blue-500 cursor-pointer" />
      </Popconfirm>
    </Space>
  );
}

export function ComponentEvent() {
  const { components, curComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEventType>();
  const [curConfig, setCurConfig] = useState<ActionConfig>();
  const [curConfigIndex, setCurConfigIndex] = useState<number>();

  if (!curComponent) return null;

  const hadnleOk = (config?: ActionConfig) => {
    if (!curComponent || !curEvent || !config) return;
    if (curConfig) {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: [
            ...(curComponent.props[curEvent.name]?.actions || []).map(
              (item: ActionConfig, index: number) => {
                return index === curConfigIndex ? config : item;
              }
            ),
          ],
        },
      });
    } else {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: [...(curComponent.props[curEvent.name]?.actions || []), config],
        },
      });
    }

    setModalOpen(false);
    setCurConfig(undefined);
  };

  const handleActionEdit = (config: ActionConfig, index: number, eventType: ComponentEventType) => {
    if (!curComponent) {
      return;
    }
    setCurEvent(eventType);
    setCurConfig(config);
    setCurConfigIndex(index);
    setModalOpen(true);
  };

  const handleActionDel = (eventName: string, act: ActionConfig) => {
    if (!curComponent) return;

    const newActions = curComponent.props[eventName]?.actions.filter(
      (action: ActionConfig) => act.key !== action.key
    );
    updateComponentProps(curComponent.id, {
      [eventName]: {
        actions: newActions,
      },
    });
  };

  const renderActions = (actions: ActionConfig[], eventType: ComponentEventType) => {
    const { name: eventName } = eventType;
    if (!actions || actions.length === 0) return <Card className="w-[100%]">没有事件</Card>;
    return actions.map((act: ActionConfig, index: number) => {
      if (act.type === "jumpPage") {
        return (
          <Card
            key={act.key}
            title="跳转链接"
            extra={
              <CardExtra
                handleEdit={() => handleActionEdit(act, index, eventType)}
                handleDel={() => handleActionDel(eventName, act)}
              />
            }
            size="small"
          >
            <div>链接：{act.url}</div>
          </Card>
        );
      }
      if (act.type === "showMessage") {
        return (
          <Card
            key={act.key}
            title="消息弹窗"
            extra={
              <CardExtra
                handleEdit={() => handleActionEdit(act, index, eventType)}
                handleDel={() => handleActionDel(eventName, act)}
              />
            }
            size="small"
          >
            <div>类型：{act.config.type}</div>
            <div>内容：{act.config.text}</div>
          </Card>
        );
      }
      if (act.type === "customJs") {
        return (
          <Card
            key={act.key}
            title="自定义JS"
            extra={
              <CardExtra
                handleEdit={() => handleActionEdit(act, index, eventType)}
                handleDel={() => handleActionDel(eventName, act)}
              />
            }
            size="small"
          >
            <div>一段js代码</div>
          </Card>
        );
      }
      if (act.type === "componentMethod") {
        return (
          <Card
            key={act.key}
            title="组件方法"
            extra={
              <CardExtra
                handleEdit={() => handleActionEdit(act, index, eventType)}
                handleDel={() => handleActionDel(eventName, act)}
              />
            }
            size="small"
          >
            <div>组件名称：{getComponentById(act.config.componentId, components)?.desc}</div>
            <div>组件id：{act.config.componentId}</div>
            <div>事件名称：{act.config.method}</div>
          </Card>
        );
      }
      return null;
    });
  };

  const items: CollapseProps["items"] = (componentConfig[curComponent.name]?.events || []).map(
    (item) => {
      return {
        key: item.name,
        label: (
          <div className="flex justify-between">
            {item.label}
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setCurConfig(undefined);
                setCurEvent(item);
                setModalOpen(true);
              }}
            >
              添加动作
            </Button>
          </div>
        ),
        children: (
          <Space direction="vertical" className="w-[100%]">
            {curComponent.props[item.name]?.actions ? (
              renderActions(curComponent.props[item.name].actions, item)
            ) : (
              <Card className="w-[100%]">没有事件</Card>
            )}
          </Space>
        ),
      };
    }
  );
  return (
    <div className="p-[10px]">
      {items?.length ? (
        <Collapse
          items={items}
          size={"small"}
          defaultActiveKey={componentConfig[curComponent.name].events?.map((item) => item.name)}
        ></Collapse>
      ) : (
        <div className="text-center pt-[20px]">当前组件不可添加事件</div>
      )}
      <ActionModal
        action={curConfig}
        visible={modalOpen}
        handleOk={(config) => hadnleOk(config)}
        handleCancel={() => {
          setCurConfig(undefined);
          setModalOpen(false);
        }}
      ></ActionModal>
    </div>
  );
}
