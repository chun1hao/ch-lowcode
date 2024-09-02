import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal as AntdModal } from "antd";
import { CommonComponentProps } from "../../interface";

export interface ModalRef {
  open: () => void;
  close: () => void;
}

const Modal: React.ForwardRefRenderFunction<ModalRef, Omit<CommonComponentProps, "ref">> = (
  { children, title, onOk, onCancel, styles, okText, cancelText },
  ref
) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open() {
        setOpen(true);
      },
      close() {
        setOpen(false);
      },
    };
  });

  return (
    <AntdModal
      open={open}
      title={title}
      style={styles}
      onCancel={() => {
        if (onCancel) onCancel();
        setOpen(false);
      }}
      onOk={() => {
        if (onOk) onOk();
        setOpen(false);
      }}
      okText={okText}
      cancelText={cancelText}
      destroyOnClose
    >
      {children}
    </AntdModal>
  );
};

export default forwardRef(Modal);
