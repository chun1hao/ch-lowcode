import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../../stores/components";

interface HoverMaskProps {
  portalRef: React.RefObject<HTMLDivElement>;
  containerClassName: string;
  componentId: number;
}

const HoverMask = ({ containerClassName, componentId, portalRef }: HoverMaskProps) => {
  const { components } = useComponentsStore();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  useEffect(() => {
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, components]);

  useEffect(() => {
    const scrollHandler = () => updatePosition();
    const el = document.querySelector(`.${containerClassName}`)!;
    el.addEventListener("scroll", scrollHandler);
    return () => {
      el.removeEventListener("scroll", scrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updatePosition() {
    if (!componentId) return;
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = container.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { left, top, width, height } = node.getBoundingClientRect();
    const { left: containerLeft, top: containerTop } = container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;

    if (labelTop <= 0) {
      labelTop -= 20;
    }
    setPosition({
      left: left - containerLeft + container.scrollLeft,
      top: top - containerTop,
      width,
      height,
      labelTop,
      labelLeft: left - containerLeft + width,
    });
  }

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId]);

  // const el = useMemo(() => {
  // const target = document.createElement("div");
  // target.className = "wrapper";

  // const container = document.querySelector(`.${portalWapperClassName}`);
  // container!.appendChild(target);

  //   return target;
  // }, [portalWapperClassName]);

  return portalRef.current
    ? createPortal(
        <>
          <div
            className="absolute bg-[rgba(0, 0, 255, 0.1)] border-[1px] border-[blue] border-dashed rounded-sm pointer-events-none z-[12] box-border"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
            }}
          />
          <div
            className="absolute font-[14px] z-[13] translate-x-[-100%] translate-y-[-100%]"
            style={{
              left: position.labelLeft,
              top: position.labelTop,
              display: !position.width || position.width < 10 ? "none" : "inline",
            }}
          >
            <div className="p-0 px-[8px] text-[12px] bg-[#ccc] rounded-[4px] text-[#fff] whitespace-nowrap cursor-pointer">
              {curComponent?.desc}
            </div>
          </div>
        </>,
        portalRef.current
      )
    : null;
};

export default HoverMask;
