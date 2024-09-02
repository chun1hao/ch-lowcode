import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Component, getComponentById, useComponentsStore } from "../../stores/components";
import { Dropdown, Popconfirm } from "antd";
import { DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { debounce } from "lodash-es";
import { LEFT_WRAPPER, RIGHT_SETTING } from "../../../config";

interface SelectMaskProps {
  portalRef: React.RefObject<HTMLDivElement>;
  componentId: number;
  containerClassName: string;
}

const SelectMask = ({ portalRef, containerClassName, componentId }: SelectMaskProps) => {
  const { components, curComponent, deleteComponent, setCurComponentId } = useComponentsStore();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelLeft: 0,
    labelTop: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      updatePosition();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, components]);

  useEffect(() => {
    const resizeHandler = debounce(() => updatePosition(), 100);
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curComponent]);

  useEffect(() => {
    const leftdom = document.querySelector(`.${LEFT_WRAPPER}`)!;
    const rightdom = document.querySelector(`.${RIGHT_SETTING}`)!;

    const observer = new ResizeObserver(() => {
      updatePosition();
    });

    observer.observe(leftdom);
    observer.observe(rightdom);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId]);

  useEffect(() => {
    const scrollHandler = () =>
      setTimeout(() => {
        updatePosition();
      }, 100);
    const el = document.querySelector(`.${containerClassName}`)!;
    el.addEventListener("scroll", scrollHandler);
    return () => {
      el.removeEventListener("scroll", scrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curComponent]);

  const parentComponents = useMemo(() => {
    const parents: Component[] = [];
    let parentId = curComponent?.parentId;
    while (parentId && parentId !== 1) {
      const parent = getComponentById(parentId, components);
      if (!parent) return parents;
      parents.push(parent);
      parentId = parent.parentId;
    }
    return parents;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId]);

  function updatePosition() {
    if (!componentId) return;
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;
    const node = container.querySelector(`[data-component-id='${componentId}']`);
    if (!node) return;
    const { left, top, width, height } = node.getBoundingClientRect();
    const { left: containerLeft, top: containerTop } = container.getBoundingClientRect();

    let labelTop = top - containerTop;
    if (labelTop <= 0) {
      labelTop -= 20;
    }
    setPosition({
      left: left - containerLeft + container.scrollLeft,
      top: top - containerTop,
      width,
      height,
      labelLeft: left - containerLeft + container.scrollLeft,
      labelTop,
    });
  }

  const handleDelete = () => {
    deleteComponent(componentId);
    setCurComponentId(null);
  };
  return portalRef.current
    ? createPortal(
        <>
          <div
            className="absolute bg-[#0000ff19] border-[1px] border-[blue] border-dashed rounded-sm pointer-events-none z-[12] box-border"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
            }}
          />
          <div
            className="absolute text-[12px] z-[13]  translate-y-[-100%] bg-[blue] rounded-md pr-[5px]"
            style={{
              left: position.labelLeft,
              top: position.labelTop,
              display: !position.width || position.width < 10 ? "none" : "inline",
            }}
          >
            <div className="flex">
              <div className="pl-[5px] text-[12px]   rounded-[4px] text-[#fff] whitespace-nowrap cursor-pointer">
                {curComponent?.name}
              </div>
              {curComponent?.id !== 1 && (
                <div className="pl-[5px]  rounded-md">
                  <Popconfirm
                    title="确认删除？"
                    okText={"确认"}
                    cancelText={"取消"}
                    onConfirm={handleDelete}
                  >
                    <DeleteOutlined className="text-[#fff]" />
                  </Popconfirm>
                </div>
              )}
              {parentComponents.length > 0 && (
                <Dropdown
                  menu={{
                    items: parentComponents.map((item) => ({
                      key: item.id,
                      label: item.desc,
                    })),
                    onClick: ({ key }) => {
                      setCurComponentId(+key);
                    },
                  }}
                >
                  <MenuOutlined className="text-[#fff] pl-[5px]" />
                </Dropdown>
              )}
            </div>
          </div>
        </>,
        portalRef.current
      )
    : null;
};

export default SelectMask;
